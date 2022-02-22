import React from 'react'
import Header from './Header'
import Footer from './Footer'
import Head from 'next/head'


const Layout = ({...props}) => {
  return (<>
    <Head>
      <title>{props.title}</title>
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    </Head>
    <div className="mx-auto max-w-screen-md">
      <div className="mx-4">
        <Header />
        {props.children}
        <Footer />
      </div>
    </div>
  </>)
}

export default Layout
