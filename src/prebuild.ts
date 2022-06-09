import glob from 'fast-glob'
import {promises as fs} from 'fs'
import {open} from 'sqlite'
import sqlite3 from 'sqlite3'
import dayjs from 'dayjs'
import crypto from 'crypto'
import {Feed} from 'feed'
import {renderer} from './utils'
import {marked} from 'marked'
import yaml from 'js-yaml'
import path from 'path'


type PostStatus = "publish" | "draft"

interface Post {
  title: string
  status: PostStatus
  oldStatus?: PostStatus
  published?: number  // 发布时间
  created?: number    // 创建时间
  modified?: number   // 更新时间
  wp_id: number
  content: string
  path: string
  isModified: boolean
  contentHash?: string
}

interface StatusRecord {
  status: PostStatus
  contentHash: string
}

interface PostList {
  title: string
  notes: Post[]
}

const readPosts = async () => {
  // @ts-ignore
  const files = await glob("../notes/**/*.md")
  let posts = []
  let statuses = await _readOldPostStatuses()
  for (const file of files) {
    // console.log(file)
    const fileContent = await fs.readFile(file, "utf-8")
    // console.log(fileContent.slice(0, 10))
    const path = file.replace("../notes/", "")
    let post: Post = {title: "", status: "draft", wp_id: 0, content: "", path, isModified: false}
    let startIdx = 0
    let outOfMeta = false
    const lines = fileContent.split("\n")
    for (const [idx, line] of lines.entries()) {
      // 部分老文章采用了一级标题，兼容一下
      if (!outOfMeta && /^#[^#]+/u.test(line)) {
        post.title = line.replace(/#\s*/, "")
        continue
      }
      if (/^Status:.*/.test(line)) {
        post.status = <PostStatus>line.replace(/^Status:\s*/, "")
        continue
      }
      if (/^Date:.*/.test(line)) {
        post.created = Date.parse(line.replace(/^Date:\s*/, ""))
        continue
      }
      if (/^Modified:.*/.test(line)) {
        post.modified = Date.parse(line.replace(/^Modified:\s*/, ""))
        continue
      }
      if (/^Published:.*/.test(line)) {
        const published = Date.parse(line.replace(/^Published:\s*/, ""))
        post.published = isNaN(published) ? undefined : published
        continue
      }
      if (/^wp_id:\s*\d+/.test(line)) {
        post.wp_id = parseInt(line.replace(/^wp_id:\s*/, ""))
        continue
      }
      if (/^ID:/.test(line) || line.trim().length === 0 || line === "<!--") {
        continue
      }
      // 遇到 --> 或正文其他内容的时候退出
      if (line === "-->") {
        outOfMeta = true
        continue
      }
      startIdx = idx
      break
    }
    console.log(`inserting ${post.title}, ${post.wp_id}`)
    post.content = lines.slice(startIdx, lines.length).join("\n")
    post.contentHash = crypto.createHash("md5").update(post.content).digest("hex")
    if (post.wp_id !== 0) {
      if (post.wp_id in statuses) {
        post.oldStatus = statuses[post.wp_id].status
        if (post.contentHash != statuses[post.wp_id].contentHash) {
          post.isModified = true
        }
      } else {
        post.oldStatus = post.status
      }
    } else {
      post.oldStatus = "draft"
    }
    posts.push(post)
  }
  return posts
}

const writeToDatabase = async (posts: Post[]) => {
  const db = await open({ filename: ".cache.db", driver: sqlite3.Database })
  await db.exec(
    `create table posts(
    id integer primary key autoincrement,
    title text,
    status text,
    published integer,
    created integer,
    modified integer,
    content text)`
  )
  const oldPosts = posts.filter(p => p.wp_id !== 0)
  const newPosts = posts.filter(p => p.wp_id === 0)

  for (const post of oldPosts) {
    try {
      await db.run(
        `insert into posts
        (id, title, status, published, created, modified, content)
        values(?, ?, ?, ?, ?, ?, ?)`,
        [post.wp_id, post.title, post.status, post.published, post.created,
          post.modified, post.content
        ]
      )
    } catch (e) {
      console.log(post.wp_id, post.title, e)
    }
  }
  for (const post of newPosts) {
    try {
      const res = await db.run(
        `insert into posts
        (title, status, published, created, modified, content)
        values(?, ?, ?, ?, ?, ?)`,
        [post.title, post.status, post.published, post.created,
          post.modified, post.content
        ]
      )
      post.wp_id = <number>res.lastID
    } catch (e) {
      console.log(post.wp_id, post.title, e)
    }
  }
}


const writeBackPosts = async (posts: Post[]) => {
  for (const post of posts) {
    const fileContent = [
      "# " + post.title + "\n",
      "<!--",
      "Status: " + post.status,
      "Date: " + dayjs(post.created).format(),
      "Modified: " + dayjs(post.modified).format(),
      "Published: " + (post.published ? dayjs(post.published).format() : "not yet"),
      "wp_id: " + post.wp_id,
      "-->" + "\n",
      post.content,
    ].join("\n")

    await fs.writeFile(`../notes/${post.path}`, fileContent)
  }
}


/**
 * 补充所有字段，除了 wp_id，这个字段需要插入数据库后获取
 */
const fillMetadataInplace = async (posts: Post[]) => {
  for (const post of posts) {
    if (!post.title) {
      post.title = "无标题"
    }
    if (!post.status) {
      post.status = "draft"
    }
    if (!post.published) {
      // 已发布时才填充发布时间
      if (post.status === "publish") {
        // 对于老文章，补上创作时间
        if (post.oldStatus === "publish") {
          post.published = post.created
          // 新发布的文章采用当前时间
        } else {
          post.published = Date.now()
        }
      }
    }
    // 如果文章暂时下架，同时删除发布日期，重新上架时会作为新文章出现
    if (post.status === "draft") {
      post.published === undefined
    }
    const stat = await fs.stat(`../notes/${post.path}`)
    if (!post.created) {
      post.created = stat.birthtimeMs
    }
    // 如果文件内容变更，才更新修改时间
    if (post.isModified) {
      post.modified = stat.mtimeMs
    }
  }
}

const _readOldPostStatuses = async () => {
  try {
    const postStatusesText = await fs.readFile("../notes/statuses.csv", "utf-8")
    let statuses: Record<number, StatusRecord> = {}
    for (const line of postStatusesText.split("\n")) {
      const [wpId, status, contentHash] = line.split(",")
      const statusRecord = {status: <PostStatus>status, contentHash}
      statuses[parseInt(wpId)] = statusRecord
    }
    return statuses
  } catch (e) {
    return {}
  }
}

/**
 * Create the statuses file if not exists
 * FIXME 貌似并不需要这个函数……
 */
const initPostStatuses = async (posts: Post[]) => {
  try {
    // if file exists, no need to init the file
    await fs.stat("../notes/statuses.csv")
    return
  } catch (err) {
    // file does not exist
    console.log("statuses.txt not found, creating now.")
  }
  let oldPosts = posts.filter(p => p.wp_id !== 0)
  await updateStatusesFile(oldPosts)
}

const updateStatusesFile = async (posts: Post[]) => {
  const statuses = []
  posts.sort((x, y) => x.wp_id - y.wp_id)
  for (const post of posts) {
    statuses.push(`${post.wp_id},${post.status},${post.contentHash}`)
  }
  await fs.writeFile("../notes/statuses.csv", statuses.join("\n"))
}

/**
 * Read from database and build RSS and Atom feed.
 */
const buildFeed = async () => {
  const db = await open({ filename: ".cache.db", driver: sqlite3.Database })
  const newestPosts = await db.all(
    `select * from posts
    where "status" = "publish"
    order by published desc
    limit 20`
  )
  const baseUrl = "https://yifei.me"
  const date = new Date()
  const feed = new Feed({
    title: `Yifei's Notes`,
    description: "Yifei's Notes",
    id: baseUrl,
    link: baseUrl,
    image: `${baseUrl}/favicon.png`,
    favicon: `${baseUrl}/favicon.ico`,
    copyright: `2006-${date.getFullYear()}, Yifei Kong`,
    author: {
      name: "Yifei Kong",
      link: "https://yifei.me"
    }
  })
  marked.use({renderer})
  for (const post of newestPosts) {
    const url = `${baseUrl}/note/${post.id}`
    const content = marked.parse(post.content)
    feed.addItem({
      title: post.title,
      id: url,
      link: url,
      description: content,
      author: [{
        name: "Yifei Kong",
        link: baseUrl
      }],
      content: content,
      date: new Date(post.published),
    })
  }
  await fs.writeFile("public/rss.xml", feed.rss2())
  await fs.writeFile("public/atom.xml", feed.atom1())
}

const buildLists = async () => {
  const files = await glob("../notes/_list/*.yaml")
  let posts = []
  const db = await open({ filename: ".cache.db", driver: sqlite3.Database })
  await db.exec(
    `create table lists(
      id integer primary key autoincrement,
      slug text,
      title text,
      notes text
    )`
  )
  for (const file of files) {
    const fileContent = await fs.readFile(file, "utf-8")
    const list = yaml.load(fileContent)
    const slug = path.basename(file, ".yaml")
    try {
      await db.run(
        `insert into lists
        (slug, title, notes)
        values(?, ?, ?)`,
        // @ts-ignore
        [slug, list.title, JSON.stringify(list.notes) ]
      )
    } catch (e) {
      console.error(`failed to insert list: ${slug}`, e)
    }
  }
}


const prebuild = async () => {
  const posts = await readPosts()
  // await initPostStatuses(posts)
  await fillMetadataInplace(posts)
  await writeToDatabase(posts)
  await writeBackPosts(posts)
  await updateStatusesFile(posts)
  await buildFeed()
  await buildLists()
}

prebuild()
