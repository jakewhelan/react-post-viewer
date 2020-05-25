import { dispatch } from '@app/app.store'
import { Post } from './model/post'
import { Branch } from './model/branch'
import { TreeGroupingKey } from './model/tree-grouping-key'
import { Dictionary } from '@core/interfaces'

export const SET_POSTS = '[post-tree] SET_POSTS'
export const SET_TREE = '[post-tree] SET_TREE'
export const SET_GROUPED_BY = '[post-tree] SET_GROUPED_BY'
export const SET_AUTHOR = '[post-tree] SET_AUTHOR'
export const SET_LOCATION = '[post-tree] SET_LOCATION'
export const SET_ACTIVE = '[post-tree] SET_ACTIVE'

export const postTreeActions = {
  setPosts: (posts: Dictionary<Post>) => dispatch({ type: SET_POSTS, payload: { posts } }),
  setTree: (tree: Branch[]) => dispatch({ type: SET_TREE, payload: { tree } }),
  groupedBy: (groupedBy: TreeGroupingKey) => dispatch({ type: SET_GROUPED_BY, payload: { groupedBy } }),
  setPostAuthor: (postId: number, author: string) => dispatch({ type: SET_AUTHOR, payload: { postId, author } }),
  setPostLocation: (postId: number, location: string) => dispatch({ type: SET_LOCATION, payload: { postId, location } }),
  setPostActive: (postId: number, isActive: boolean) => dispatch({ type: SET_ACTIVE, payload: { postId, isActive } })
}
