import { Dictionary } from '@core/interfaces'
import { Post } from './model/post'
import { Branch } from './model/branch'
import { TreeGroupingKey } from './model/tree-grouping-key'

/**
 * Redux store state belonging to the reducer
 */
export interface StoreState {
  posts: Dictionary<Post>
  tree: Branch[]
  groupedBy: TreeGroupingKey
}

/**
 * Service state derived from the redux store
 */
export interface ServiceState {
  posts: Dictionary<Post>
  groupedBy: TreeGroupingKey
}

/**
 * Component props derived from the redux store
 */
export interface StateProps {
  posts: Dictionary<Post>
  tree: Branch[]
  groupedBy: TreeGroupingKey
}

/**
 * Component props, including store derived props and HTML element generic props
 */
export interface Props extends StateProps, React.HTMLProps<HTMLDivElement> {}

/**
 * Component local state
 */
export interface State {
  resolved: boolean
}
