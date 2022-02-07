import React from 'react'
import Header from './Header'
import Footer from './Footer'


const Layout = ({...props}) => {
  return (<>
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
