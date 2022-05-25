# Ynotes

Ynotes is a very simple static site genrateor with next.js. It is used to generate my [weblog](https://yifei.me)

Ynotes read in markdown files and converts them into html files. The markdown files should contain metadata inside comments, the format is:

```markdown
# Hello world
<!--
ID: 42
Status: publish
Date: 2020-09-14T15:46:27
Modified: 2020-09-14T15:46:27
Published: 2020-09-14T15:46:27
wp_id: 2028
-->

This is my first post.
```

- ID: unique id for the post
- Status: `publish` or `draft`
- Date: time created, `%Y-%m-%dT%H:%M:%S`
- Modified: time modified, same format
- Published: time published
- wp_id: deprecated

Content should start after an empty line.

## How it works

1. Glob all markdown files from the source directory.
2. Extract metadata and content from these files and store them in a cache sqlite database.
3. run `make build`, html files will be generated using the cache database.
4. run `make publish`, the site will be published to vercel.

## TODO

- [x] Support RSS and ATOM. https://yifei.me/feed, https://yifei.me/feed/atom
- [ ] Support series of articles.
