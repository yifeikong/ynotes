import axios from 'axios'
import {promises as fs} from 'fs'
import path from 'path'
import mkdirp from 'mkdirp'
import glob from 'fast-glob'


const BASE_URL = 'https://sg.storage.bunnycdn.com'
const DOWNLOAD_DIR = './_data'


const visit = async (filepath: string) => {
  const res = await axios.get(`${BASE_URL}${filepath}`, {
    headers: {
      Accept: '*/*',
      AccessKey: '0b17b3e3-6da6-40e3-8a574487998c-287f-443b'
    }
  })

  for (const item of res.data) {
    const {ObjectName: objectName, IsDirectory: isDirecotry} = item
      const newPath = `${filepath}${objectName}`
    if (isDirecotry) {
      console.log(`visiting new directory: ${newPath}`)
      await visit(newPath + "/")
    } else {
      console.log(`downloading file: ${newPath}`)
      const shortPath = newPath.replace("/onefly/", "")
      const url = `https://onefly.b-cdn.net/${shortPath}`
      const imageRes = await axios.get(url, {
        responseType: 'arraybuffer'
      })
      const fullpath = `${DOWNLOAD_DIR}/${shortPath}`
      const dirname = path.dirname(fullpath)
      console.log(`making dir ${dirname}`)
      await mkdirp(dirname)
      await fs.writeFile(fullpath, imageRes.data)
    }
  }
}


const downloadSina = async () => {
  const files = await glob("../notes/**/*.md")
  for (const file of files) {
    const fileContent = await fs.readFile(file, "utf-8")
    const lines = fileContent.split("\n")
    for (const [_, line] of lines.entries()) {
      // https://ws1.sinaimg.cn/large/006tNc79gy1fmjv6ugbr4j31jw0mo4qp.jpg
      const m = line.match(/https?:\/\/\w+\.sinaimg\.cn\/large\/([\w\.]+)/)
      if (m) {
        const url = m[0].replace(/ws\d/, "tva1")
        console.log(`downloading ${url}`)
        const imageRes = await axios.get(url, {responseType: "arraybuffer"})
        await fs.writeFile(`sinaimg/${m[1]}`, imageRes.data)
      }
    }
  }

}

// visit("/onefly/notes/")
downloadSina()
