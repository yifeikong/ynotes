import type { NextPage, GetStaticProps, GetStaticPaths } from 'next'
import React from 'react'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../../styles/Home.module.css'
import Layout from '../../components/Layout'
import sqlite3 from 'sqlite3'
import {open} from 'sqlite'
import dayjs from 'dayjs'
import Link from 'next/link'
import {useRouter} from 'next/router'
import {Post} from '../../types'

const range = (n: number) => Array.from(Array(Math.ceil(n)).keys())

interface ArchiveProps {
  posts: Post[]
  pageCount: number
}

const Archive = ({posts, pageCount}: ArchiveProps) => {
  const router = useRouter()
  const {page} = router.query
  const currentPageNum = parseInt(page as string)
  const timeFormat = "YYYY-MM-DD HH:mm"
  return (<>
    <Layout>
    <h2 className="text-2xl text-semibold my-4">Archives - Page {currentPageNum}</h2>
    <ol className="list-disc ml-4">
    {posts.map(post => (
      <li className="my-2" key={post.id}>
        <h2 className=""><Link href={`/note/${post.id}`} passHref>
          <a>{post.title}</a>
        </Link></h2>
        <div className="text-gray-400">
          <p className="mr-4">
            <time className="">{dayjs(post.published).format(timeFormat)}</time>
          </p>
        </div>
      </li>
    ))}
    </ol>
    <p className="my-4 mx-auto text-center">
      { currentPageNum !== 1 ? (
        <Link href={`/archive/${currentPageNum - 1}`} passHref key="<">
          <a className="text-blue-500 mx-2">&lt;</a>
        </Link>) : (
          <span className="text-gray-400 mx-2">&lt;</span>
        )}
      {range(pageCount).map(pageNum => (
        (pageNum + 1 !== currentPageNum) ? (
          <Link href={`/archive/${pageNum + 1}`}
            passHref key={pageNum}>
            <a className="text-blue-500 underline mx-2" >{pageNum + 1}</a>
          </Link>) : (
          <span className="mx-2 text-gray-600">{pageNum + 1}</span>
          )
      ))}
      { currentPageNum !== pageCount? (
        <Link href={`/archive/${currentPageNum + 1}`} passHref key=">">
          <a className="text-blue-500 mx-2">&gt;</a>
        </Link>) : (
          <span className="text-gray-400 mx-2">&gt;</span>
        )}
    </p>
    </Layout>
  </>)
}

export const getStaticProps: GetStaticProps = async ({params}) => {
  const pageNum = parseInt(params?.page as string)
  const offset = (pageNum - 1) * 50
  const db = await open({ filename: ".cache.db", driver: sqlite3.Database })
  const posts = await db.all("select id from posts where status='publish'")
  const pageCount = Math.ceil(posts.length / 50)

  const newestPosts = await db.all(
    `select id, title, published from posts
    where "status" = "publish"
    order by published desc
    limit 50
    offset ${offset}`
  )
  return {props: {posts: newestPosts, pageCount}}
}


export const getStaticPaths: GetStaticPaths = async () => {
  const db = await open({filename: ".cache.db", driver: sqlite3.Database})
  const posts = await db.all("select id from posts where status='publish'")
  const pageCount = posts.length / 50
  console.log(pageCount)
  return {
    paths: range(pageCount).map(
      pageNum => ({params: {page: (pageNum + 1).toString()}})
    ),
    fallback: false
  }
}

export default Archive
