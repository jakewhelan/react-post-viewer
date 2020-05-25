/**
 * Component props, including store derived props and HTML element generic props
 */
export interface Props extends React.HTMLProps<HTMLDivElement> {
  postId: number
  location: string
  time: number
  author: string
  text: string
  open: boolean
}

export interface State {
  location: string
  author: string
}
