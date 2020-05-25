import { Reducer } from 'redux'
import { injectReducer } from '@app/app.store'
import { StoreState } from './post-tree.interfaces'
import { TreeGroupingKey } from './model/tree-grouping-key'
import {
  SET_POSTS,
  SET_TREE,
  SET_GROUPED_BY,
  SET_AUTHOR,
  SET_LOCATION,
  SET_ACTIVE
} from './post-tree.actions'

const initialState: StoreState = {
  posts: {},
  tree: [],
  groupedBy: TreeGroupingKey.Week
}

const postTree: Reducer = (state = initialState, action): StoreState => {
  switch (action.type) {
    case SET_POSTS: {
      const { posts } = action.payload

      return {
        ...state,
        posts
      }
    }

    case SET_TREE: {
      const { tree } = action.payload

      return {
        ...state,
        tree
      }
    }

    case SET_GROUPED_BY: {
      const { groupedBy } = action.payload

      return {
        ...state,
        groupedBy
      }
    }

    case SET_AUTHOR: {
      const { postId, author } = action.payload

      return {
        ...state,
        posts: {
          ...state.posts,
          [postId]: {
            ...state.posts[postId],
            author
          }
        }
      }
    }

    case SET_LOCATION: {
      const { postId, location } = action.payload

      return {
        ...state,
        posts: {
          ...state.posts,
          [postId]: {
            ...state.posts[postId],
            location
          }
        }
      }
    }

    case SET_ACTIVE: {
      const { postId, isActive } = action.payload

      return {
        ...state,
        posts: {
          ...state.posts,
          [postId]: {
            ...state.posts[postId],
            open: isActive
          }
        }
      }
    }

    default: {
      return state
    }
  }
}

injectReducer('postTree', postTree)
