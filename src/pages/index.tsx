/**
 * This page shows the most recent 20 posts
 */
import type { NextPage, GetStaticProps } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../../styles/Home.module.css'
import Layout from '../components/Layout'
import sqlite3 from 'sqlite3'
import {open} from 'sqlite'
import dayjs from 'dayjs'
import Link from 'next/link'
import {Post} from '../types'

interface Props {
  posts: Post[]
}

const Home = ({posts}: Props) => {
  const timeFormat = "YYYY-MM-DD HH:mm"
  return (<>
    <Layout title="Yifei's Notes">
    {posts.map(post => (
      <div className="border my-2 p-2 lg:p-4 rounded" key={post.id}>
        <h2 className="text-xl"><Link href={`/note/${post.id}`} passHref>
          <a>{post.title}</a>
        </Link></h2>
        <div className="text-gray-400 py-2">
          <p className="mr-4">
            <time className="">{dayjs(post.published).format(timeFormat)}</time>
          </p>
        </div>
        <p><Link href={`/note/${post.id}`} passHref>
          <a className="text-blue-500 hover:underline">Read more ≫</a>
        </Link></p>
      </div>
    ))}
    <p className="my-4">
      <Link href="/archive/1" passHref>
        <a className="text-blue-500 underline">Read all notes ≫</a>
      </Link>
    </p>
    </Layout>
  </>)
}


export const getStaticProps: GetStaticProps = async () => {
  const db = await open({ filename: ".cache.db", driver: sqlite3.Database })

  const newestPosts = await db.all(
    `select id, title, published from posts
    where "status" = "publish"
    order by published desc
    limit 20`
  )
  return {props: {posts: newestPosts}}
}

export default Home
