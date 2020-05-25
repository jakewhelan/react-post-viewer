import './post-tree.reducer'
import React from 'react'
import { connect } from 'react-redux'
import { classes } from './post-tree.styles'
import { Props, State, StateProps } from './post-tree.interfaces'
import { PostTreeService } from './post-tree.service'
import { Post } from './model/post'
import { PostLeaf } from './post-leaf/post-leaf.component'
import { PostBranch } from './post-branch/post-branch.component'
import { TreeGroupingKey } from './model/tree-grouping-key'

export class PostTreeComponent extends React.PureComponent<Props, State> {
  static mapStateToProps = ({
    postTree: {
      posts,
      tree,
      groupedBy
    }
  }): StateProps => ({
    posts,
    tree,
    groupedBy
  })

  state: State = {
    resolved: false
  }

  constructor (props) {
    super(props)
    this.authorButtonOnClick = this.authorButtonOnClick.bind(this)
    this.weekButtonOnClick = this.weekButtonOnClick.bind(this)
    this.locationButtonOnClick = this.locationButtonOnClick.bind(this)
    this.TreeElement = this.TreeElement.bind(this)
  }

  async componentDidMount (): Promise<void> {
    await PostTreeService.getPosts()

    this.setState({ resolved: true })
  }

  private authorButtonOnClick (): void {
    PostTreeService.groupPostsBy(TreeGroupingKey.Author)
  }

  private weekButtonOnClick (): void {
    PostTreeService.groupPostsBy(TreeGroupingKey.Week)
  }

  private locationButtonOnClick (): void {
    PostTreeService.groupPostsBy(TreeGroupingKey.Location)
  }

  private generateLeafElements (leaves: number[]): JSX.Element[] {
    return leaves
      .map(postId => {
        const post: Post = this.props.posts[postId]
        const {
          location,
          time,
          author,
          text,
          open
        } = post

        return (
          <PostLeaf
            key={postId}
            postId={postId}
            location={location}
            time={time}
            author={author}
            text={text}
            open={open}
          >
            {JSON.stringify(this.props.posts[postId])}
          </PostLeaf>
        )
      })
  }

  private TreeElement (): JSX.Element {
    const { tree } = this.props

    return (
      <div className="tree">
        {
          tree.map(([branch, leaves]) => (
            <PostBranch
              key={branch}
              title={branch}
            >
              {this.generateLeafElements(leaves)}
            </PostBranch>
          ))
        }
      </div>
    )
  }

  render (): JSX.Element {
    const { resolved } = this.state
    const { TreeElement } = this

    if (!resolved) {
      return (
        <div>
          Loading please wait...
        </div>
      )
    }

    const { selected } = classes
    const { groupedBy } = this.props

    return (
      <div className={classes.root}>
        <div className={classes.buttonContainer}>
          <button
            className={`${(groupedBy === TreeGroupingKey.Week) ? selected : ''} ${classes.button}`}
            onClick={this.weekButtonOnClick}
          >
            By week
          </button>
          <button
            className={`${(groupedBy === TreeGroupingKey.Author) ? selected : ''} ${classes.button}`}
            onClick={this.authorButtonOnClick}>
            By author
          </button>
          <button
            className={`${(groupedBy === TreeGroupingKey.Location) ? selected : ''} ${classes.button}`}
            onClick={this.locationButtonOnClick}
          >
            By location
          </button>
        </div>
        <TreeElement />
      </div>
    )
  }
}

export const PostTree = connect(PostTreeComponent.mapStateToProps)(PostTreeComponent)
