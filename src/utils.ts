import hljs from 'highlight.js'


export const renderer = {
  heading(text: string, level: number) {
    let sizeClass
    if (level <= 2) {
      sizeClass = "text-xl"
    } else {
      sizeClass = ""
    }
    const className = `my-2 font-semibold ${sizeClass}`
    return `<h${level} class="${className}">${text}</h${level}>`
  },
  paragraph(text: string) {
    return `<p class="my-4 font-light">${text}</p>`
  },
  code(code: string, infostring: string, escaped: boolean) {
    let highlighted: string
    try{
      if (!infostring) {
        highlighted = hljs.highlightAuto(code).value
      } else {
        highlighted =  hljs.highlight(code, {language: infostring}).value
        }
    } catch (e) {
      highlighted = code
    }
    return `<pre class="text-sm bg-gray-100 my-4 p-2 overflow-x-auto"><code>${highlighted}</code></pre>`
  },
  list(body: string, ordered: boolean, start: number) {
    const el = ordered ? "ol" : "ul"
    return `<${el} class="my-4 ml-4 font-light ${ordered ? "list-decimal": "list-disc"}">${body}</${el}>`
  },
  listitem(text: string, task: boolean, checked: boolean) {
    return `<li class="">${text}</li>`
  },
  codespan(text: string) {
    return `<code class="px-1 bg-gray-100 border-2 rounded">${text}</code>`
  },
  link(href: string, title: string, text: string) {
    return `<a class="underline" href="${href}" title="${title}">${text}</a>`
  },
  tablecell(content: string, flags: any) {
    if (flags.header) {
      return `<th class="border border-solid px-2 py-1 font-semibold">${content}</th>`
    } else {
      return `<td class="border border-solid px-2 py-1 ">${content}</td>`
    }
  }
}
