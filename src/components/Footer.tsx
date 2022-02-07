import type { NextPage } from 'next'


const Footer = () => {
  return (<>
    <div className="py-4 px-4 -mx-4 bg-gray-200">
      <p>&copy; 2016-2022 Yifei Kong. Powered by <a className="underline" href="https://github.com/yifeikong/ynotes">ynotes</a></p>
      <p className="text-gray-500 my-2">All contents are under the <a className="underline" href="https://creativecommons.org/licenses/by-nc-sa/4.0/">CC-BY-NC-SA</a> license, if not otherwise specified. </p>
      <p className="text-gray-500 my-2">Opinions expressed here are solely my own and do not express the views or opinions of my employer.</p>
    </div>
  </>)
}

export default Footer
