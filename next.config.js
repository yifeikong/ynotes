/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: "/archive",
        destination: "/archive/1"
      },
      {
        source: "/feed",
        destination: "/rss.xml",
      },
      {
        source: "/feed/atom",
        destination: "/atom.xml"
      },
    ]
  },
}

module.exports = nextConfig
