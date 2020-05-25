import React from 'react'
import { classes } from './post-branch.styles'
import { Props } from './post-branch.interfaces'

class PostBranchComponent extends React.PureComponent<Props> {
  render (): JSX.Element {
    return (
      <div className={classes.root}>
        <div className={classes.heading}>
          {this.props.title}
        </div>
        <div className={classes.posts}>
          {this.props.children}
        </div>
      </div>
    )
  }
}

export const PostBranch = PostBranchComponent
