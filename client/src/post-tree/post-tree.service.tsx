import { postTreeActions } from './post-tree.actions'
import { Post, PostKey } from './model/post'
import { TreeGroupingKey } from './model/tree-grouping-key'
import { SortOrder } from './model/sort-order'
import { Service, CoreService } from '@core/service'
import { ServiceState } from './post-tree.interfaces'
import { Dictionary } from '@core/interfaces'
import { store } from '@app/app.store'
import dayjs from 'dayjs'
import dayJsWeekOfYearExtension from 'dayjs/plugin/weekOfYear'
import { Branch } from './model/branch'

dayjs.extend(dayJsWeekOfYearExtension)

/**
 * PostTreeService
 *
 * Public API for the PostTree component and its children.
 *
 * This service has responsibility for fetching the post data
 * from the server, mutating it and communicating changes with
 * the store. Mutations also include applying sorting and
 * grouping rules.
 */
export class PostTreeSvc extends CoreService<ServiceState> implements Service<ServiceState> {
  public getContext (state: Dictionary<any>): ServiceState {
    const { postTree: { posts, groupedBy } } = state

    return {
      posts,
      groupedBy
    }
  }

  /**
   * Fetches posts from /posts endpoint
   *
   * @method GET
   * @returns {Promise<void>}
   */
  public getPosts (): Promise<void> {
    return window.fetch('/api/posts')
      .then(result => result.json())
      .then(({ data }: { data: Post[] }) => {
        const posts: Dictionary<Post> = data
          .reduce((acc, cur) => ({
            ...acc,
            [cur.id]: {
              ...cur,
              time: parseInt(String(cur.time)),
              open: false
            }
          }), {})

        postTreeActions.setPosts(posts)
        this.rebuildTree()
      })
  }

  /**
   * Public API for changing how the post tree
   * is structured/grouped
   *
   * Sorting rules:
   *  - If TreeGroupingKey.Week: sort groups descending, posts ascending
   *  - All other cases: sort groups ascending, posts ascending
   *
   * @param {TreeGroupingKey} key
   * @returns {void}
   */
  public groupPostsBy (key: TreeGroupingKey): void {
    const sortOrder = (key === TreeGroupingKey.Week)
      ? SortOrder.Ascending
      : SortOrder.Descending

    const generateBranchKey = (key === TreeGroupingKey.Week)
      ? this.generateWeekBranchKey
      : undefined

    const { posts } = this.context
    const tree = this.groupByKey(posts, key, sortOrder, generateBranchKey)

    postTreeActions.groupedBy(key)
    postTreeActions.setTree(tree)
  }

  /**
   * Sets the author of post with provided id
   *
   * @param {number} postId
   * @param {string} author
   */
  public setPostAuthor (postId: number, author: string): void {
    postTreeActions.setPostAuthor(postId, author)
    this.rebuildTree()
  }

  /**
   * Sets the location of post with provided id
   *
   * @param {number} postId
   * @param {string} location
   */
  public setPostLocation (postId: number, location: string): void {
    postTreeActions.setPostLocation(postId, location)
    this.rebuildTree()
  }

  /**
   * Sets the post with provided id as active (open)
   *
   * @param {number} postId
   */
  public openPost (postId): void {
    postTreeActions.setPostActive(postId, true)
  }

  /**
   * Sets the post with provided id as inactive (closed)
   *
   * @param {number} postId
   */
  public closePost (postId): void {
    postTreeActions.setPostActive(postId, false)
  }

  /**
   * Rebuilds the post tree structure
   *
   * Usually this should be called after an event
   * which has potential to change grouping or sort
   * order
   *
   * Examples:
   *  - Change location
   *  - Change author
   *  - Change grouping type
   */
  private rebuildTree (): void {
    this.groupPostsBy(this.context.groupedBy)
  }

  /**
   * Groups posts into a tree structure and sorts
   * the branches by timestamp
   *
   * @param {Dictionary<Post>} posts dictionary of posts
   * @param {PostKey} key some key from Post
   * @param {SortOrder} sortOrder the sorting order for the groups/branches
   * @param {Function} generateBranchKey lambda that generates the branch key
   */
  private groupByKey (
    posts: Dictionary<Post>,
    key: PostKey,
    sortOrder: SortOrder,
    generateBranchKey: (cur: Post, key: PostKey) => string = cur => String(cur[key])
  ): Branch[] {
    const groups: Dictionary<Post[]> = Object
      .values(posts)
      .reduce((acc, cur) => {
        const branchKey = generateBranchKey(cur, key)

        return {
          ...acc,
          [branchKey]: [
            ...(acc[branchKey] || []),
            cur
          ]
        }
      }, {})

    const tree = Object
      .entries(groups)
      .map<[string, number[]]>(([branch, posts]) => [
      branch,
      posts
        .sort((a, b) => b.time - a.time)
        .map(({ id }) => id)
    ])
      .sort()

    if (sortOrder === SortOrder.Descending) return tree
    return tree.reverse()
  }

  /**
   * Provided to groupByKey() in the special case of
   * TreeGroupingKey.Week to provide a custom group
   * key schema
   *
   * @param {Post} cur the current post
   * @param _ not used
   */
  private generateWeekBranchKey (cur: Post, _: PostKey): string {
    const date = dayjs.unix(cur.time)
    return `Week ${date.week()}`
  }
}

export const PostTreeService = new PostTreeSvc(store)
