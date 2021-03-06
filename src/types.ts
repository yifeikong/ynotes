export interface Post {
  id: number
  title: string
  published: number
  modified: number
  content?: string
}

export interface List {
  id: number
  slug: string
  title: string
  notes: string
}
