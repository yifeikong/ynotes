import { GetStaticProps } from 'next'
import sqlite3 from 'sqlite3'
import {open} from 'sqlite'
import {List} from '../../types'
import Layout from '../../components/Layout'


interface Props {
  lists: List[];
}

const SeriesIndex = ({lists}: Props) => {
  return (<>
    <Layout title={`Post lists - Yifei's Notes`}>
      <h2 className="my-4 text-2xl text-semibold">Post Lists</h2>
      <ol className="ml-4 list-disc">
        {lists.map(list => 
          <li className="my-2" key={list.id}>{list.title}</li>
        )}
      </ol>
    </Layout>
  </>)
}

export const getStaticProps: GetStaticProps = async () => {
  const db = await open({ filename: '.cache.db', driver: sqlite3.Database })

  const lists = await db.all(
    `select id, slug, title, notes from lists order by id desc`
  )
  return {
    props: {
      lists
    }
  }
}


export default SeriesIndex;
