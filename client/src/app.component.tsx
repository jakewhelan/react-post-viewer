import React from 'react'
import { hot } from 'react-hot-loader/root'
import { classes } from './app.styles'
import { PostTree } from '@post-tree/post-tree.component'

class AppComponent extends React.PureComponent {
  render (): JSX.Element {
    return (
      <div className={classes.root}>
        <PostTree />
      </div>
    )
  }
}

export const App = hot(AppComponent)
