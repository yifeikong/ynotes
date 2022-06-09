import React from 'react'
import Link from 'next/link'


const Header = () => {
  return (<>
    <nav className="px-4 py-1 -mx-4 space-x-2 md:space-x-4 bg-gray-50">
    <Link href="/"><a className="underline cursor-pointer">Home</a></Link>
    <Link href="/archive"><a className="underline cursor-pointer">Archive</a></Link>
    <Link href="/list"><a className="underline cursor-pointer">List</a></Link>
    <Link href="/about"><a className="underline cursor-pointer">About</a></Link>
    <Link href="https://github.com/yifeikong"><a className="underline cursor-pointer">GitHub</a></Link>
    <Link href="/feed"><a className="underline cursor-pointer">RSS</a></Link>
    </nav>
    <h1 className="my-6 font-mono text-2xl">
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
