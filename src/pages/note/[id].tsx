/**
 * This page shows a single post
 */

import React from 'react'
import type {NextPage, GetStaticProps, GetStaticPaths} from 'next'
import {open} from 'sqlite'
import sqlite3 from 'sqlite3'
import Layout from '../../components/Layout'
import {marked} from 'marked'
import dayjs from 'dayjs'
import {Post} from '../../types'
import {renderer} from '../../utils'

const PostPage = ({id, title, content, published, modified}: Post) => {
  const timeFormat = "YYYY-MM-DD HH:mm"
  return (
    <Layout title={`${title} - Yifei's Notes`}>
      <div className="my-4 border -mx-2 p-4 lg:p-8 shadow">
        <h1 className="text-2xl my-4 font-semibold">{title}</h1>
        <div className="text-gray-400 my-4 border-y py-2">
          <p className="mr-4">Posted on:
            <time className="mx-2">{dayjs(published).format(timeFormat)}</time>
          </p>
          <p>Last modified: 
            <time className="mx-2">{dayjs(modified).format(timeFormat)}</time>
          </p>
        </div>
        <div className="break-words" dangerouslySetInnerHTML={{ __html: content as string}}/>
      </div>
    </Layout>
  )
}

export const getStaticProps: GetStaticProps = async ({params}) => {
  const db = await open({
    filename: ".cache.db",
    driver: sqlite3.Database
  })

  const postId = params?.id
  const post = await db.get("select * from posts where id=?", postId)

  marked.use({renderer})
  const content = marked.parse(post.content)

  return {
    props: {...post, content}
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  const db = await open({filename: ".cache.db", driver: sqlite3.Database})
  const posts = await db.all("select id from posts where status='publish'")
  return {
    paths: posts.map((p: Record<string, string>) => ({params: {id: p.id.toString()}})),
    fallback: false
  }
}

export default PostPage
