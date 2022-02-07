import React from 'react'
import Link from 'next/link'


const Header = () => {
  return (<>
    <nav className="space-x-2 bg-gray-50 py-1 -mx-4 px-4">
    <Link href="/"><a className="cursor-pointer underline">Home</a></Link>
    <Link href="/archive"><a className="cursor-pointer underline">Archive</a></Link>
    <Link href="/about"><a className="cursor-pointer underline">About</a></Link>
    <Link href="https://github.com/yifeikong"><a className="cursor-pointer underline">GitHub</a></Link>
    <Link href="/feed"><a className="cursor-pointer underline">RSS</a></Link>
    </nav>
    <h1 className="font-mono text-2xl my-6">
      <Link href="/" passHref >
        <a className="cursor-pointer">
          <span className="text-green-400">$</span>
          &nbsp;
          <span className="text-blue-400">ls</span>
          &nbsp;
          <span className="text-[#e5c07b]">~yifei/notes/</span>
        </a>
      </Link>
    </h1>
  </>)
}

export default Header
