export interface Post {
  id: number
  location: string
  time: number
  author: string
  text: string
  open: boolean
}

export type PostKey = keyof Post
