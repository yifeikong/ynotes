# Ynotes

Ynotes is a very simple static site genrateor with next.js. It is used to generate my [weblog](https://yifei.me)

Ynotes read in markdown files and converts them into html files. The markdown files should contain metadata inside comments, the format is:

```markdown
# Hello world
<!--
ID: 9b518166-0ded-4107-aca6-7174e2749ae0
Status: publish
Date: 2020-09-14T15:46:27
Modified: 2020-09-14T15:46:27
Published: 2020-09-14T15:46:27
wp_id: 2028
-->

This is my first post.
```

## How it works

1. Glob all markdown files from the source directory.
2. Extract metadata and content from these files and store them in a cache sqlite database.
3. run `yarn build`, html files will be generated using the cache database.

## TODO

- [x] Support RSS and ATOM. https://yifei.me/feed https://yifei.me/feed/atom
- [ ] Support series of articles.
