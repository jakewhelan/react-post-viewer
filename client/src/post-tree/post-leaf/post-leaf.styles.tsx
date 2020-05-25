import { compileStylesheet } from '@core/jss'

const width = {
  maxWidth: '450px',
  width: '100%'
}

const styles = {
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    border: '1px solid black',
    borderBottom: 'none',
    marginBottom: '5px',
    '&.is-open': {
      borderBottom: '1px solid black'
    }
  },
  list: {
    ...width,
    padding: '20px 10px 40px'
  },
  input: {
    ...width,
    marginBottom: '10px',
    padding: '5px 5px'
  },
  textarea: {
    ...width,
    height: '100px'
  },
  postId: {
    lineHeight: '40px',
    height: '40px',
    minWidth: '17%',
    textAlign: 'center',
    borderBottom: '1px solid black'
  },
  detailsButton: {
    width: '83%',
    border: 'none',
    borderLeft: '1px solid black',
    borderBottom: '1px solid black',
    cursor: 'pointer',
    outline: 'none',
    background: '#f0f0f0',
    '&:hover': {
      background: '#d2d2d2'
    }
  },
  label: {
    paddingLeft: '5px'
  }
}

export const classes = compileStylesheet(styles)
