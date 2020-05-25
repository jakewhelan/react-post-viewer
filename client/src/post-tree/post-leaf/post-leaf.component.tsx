import React from 'react'
import { classes } from './post-leaf.styles'
import { Props, State } from './post-leaf.interfaces'
import { PostTreeService } from '@post-tree/post-tree.service'
import dayjs from 'dayjs'

class PostLeafComponent extends React.PureComponent<Props, State> {
  constructor (props) {
    super(props)

    this.locationOnChange = this.locationOnChange.bind(this)
    this.submitLocationChange = this.submitLocationChange.bind(this)
    this.authorOnChange = this.authorOnChange.bind(this)
    this.submitAuthorChange = this.submitAuthorChange.bind(this)
    this.openDetails = this.openDetails.bind(this)
    this.closeDetails = this.closeDetails.bind(this)
  }

  state: State = {
    location: this.props.location,
    author: this.props.author
  }

  componentDidUpdate ({ location, author }: Props): void {
    if (author !== this.props.author) {
      this.setState({
        author: this.props.author
      })
    }

    if (location !== this.props.location) {
      this.setState({
        location: this.props.location
      })
    }
  }

  private locationOnChange ({ target: { value } }): void {
    if (this.state.location === value) return

    this.setState({
      location: value
    })
  }

  private submitLocationChange ({ type, key }: any): void {
    if (this.state.location === this.props.location) return

    if (type === 'blur' || (type === 'keyup' && key === 'Enter')) {
      PostTreeService.setPostLocation(this.props.postId, this.state.location)
    }
  }

  private authorOnChange ({ target: { value } }): void {
    if (this.state.author === value) return

    this.setState({
      author: value
    })
  }

  private submitAuthorChange ({ type, key }: any): void {
    if (this.state.author === this.props.author) return

    if (type === 'blur' || (type === 'keyup' && key === 'Enter')) {
      PostTreeService.setPostAuthor(this.props.postId, this.state.author)
    }
  }

  private openDetails (): void {
    PostTreeService.openPost(this.props.postId)
  }

  private closeDetails (): void {
    PostTreeService.closePost(this.props.postId)
  }

  private get formattedDate (): string {
    return dayjs.unix(this.props.time).format('DD/MM/YYYY')
  }

  render (): JSX.Element {
    const {
      postId,
      text,
      open
    } = this.props

    if (!open) {
      return (
        <div className={classes.root}>
          <div className={classes.postId}>
          Post {postId}
          </div>
          <button
            className={classes.detailsButton}
            onClick={this.openDetails}
          >
          Open details
          </button>
        </div>
      )
    }

    return (
      <div className={`${classes.root} is-open`}>
        <div className={classes.postId}>
          Post {postId}
        </div>
        <button
          className={classes.detailsButton}
          onClick={this.closeDetails}
        >
          Close details
        </button>
        <ul className={classes.list}>
          <li>
            <label className={classes.label}>Post id</label>
            <input
              className={classes.input}
              name="post-id"
              value={postId}
              disabled={true}
            />
          </li>
          <li>
            <label className={classes.label}>Location</label>
            <input
              className={classes.input}
              name="location"
              value={this.state.location}
              onChange={this.locationOnChange}
              onBlur={this.submitLocationChange}
              onKeyUp={this.submitLocationChange}
            />
          </li>
          <li>
            <label className={classes.label}>Date</label>
            <input
              className={classes.input}
              name="time"
              value={this.formattedDate}
              disabled={true}
            />
          </li>
          <li>
            <label className={classes.label}>Author</label>
            <input
              className={classes.input}
              name="author"
              value={this.state.author}
              onChange={this.authorOnChange}
              onBlur={this.submitAuthorChange}
              onKeyUp={this.submitAuthorChange}
            />
          </li>
          <li>
            <label className={classes.label}>Text</label>
            <textarea
              className={classes.textarea}
              name="text"
              value={text}
              disabled={true}
            />
          </li>
        </ul>
      </div>
    )
  }
}

export const PostLeaf = PostLeafComponent as React.ComponentType<Props>
