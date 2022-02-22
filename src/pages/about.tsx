import React from 'react'
import type {NextPage, GetStaticProps, GetStaticPaths} from 'next'
import {open} from 'sqlite'
import sqlite3 from 'sqlite3'
import Layout from '../components/Layout'
import {marked} from 'marked'
import dayjs from 'dayjs'
import hljs from 'highlight.js'


const AboutPage: NextPage = () => {
  const timeFormat = "YYYY-MM-DD HH:mm"
  return (
    <Layout title="About Yifei's Notes">
      <div className="my-4 border -mx-2 p-4 shadow">
        <h1 className="text-2xl my-4 font-semibold">About</h1>
        <div className="space-y-4 my-4">
          <p>Hi, I&#39;m Yifei, a software engineer. My recent interests covers NLP and Information Retrieval, but I also write front end and iOS code because of work.</p>
          <p>I&#39;m trying to build a toy search engine, so-called a 2005 version of Google, to validate and explore some of my thoughts, most of my notes will be on that from now(2022) on.</p>
          <p>This is the place where I share my notes with people, currently comments is not supported. If you got any question, you can contact me via the following:</p>
          <ul className="list-disc mx-4">
            <li>Email: kong<span>(at)</span>yifei.me</li>
            <li>GitHub: @<a className="underline" href="https://github.com/yifeikong">yifeikong</a></li>
            <li>WeChat: oneflyapp</li>
          </ul>
          <p>If you would like to get timely updates, you can subscribe the <a className="underline" href="https://yifei.me/feed">RSS</a> or follow my WeChat public account: spider-learn</p>
          <p>All contents are under the <a className="underline" href="https://creativecommons.org/licenses/by-nc-sa/4.0/">CC-BY-NC-SA</a> license, if not otherwise specified.</p>
        </div>
      </div>
    </Layout>
  )
}

export default AboutPage
