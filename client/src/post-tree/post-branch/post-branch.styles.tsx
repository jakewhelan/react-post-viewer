import { compileStylesheet } from '@core/jss'

const styles = {
  root: {
    border: '1px solid black',
    borderTop: 'none',
    padding: '20px'
  },
  posts: {
    maxWidth: '450px',
    width: '100%',
    margin: '0 auto'
  },
  heading: {
    fontSize: '20px',
    fontWeight: 600,
    textTransform: 'uppercase',
    fontFamily: 'arial, sans-serif',
    paddingBottom: '20px'
  }
}

export const classes = compileStylesheet(styles)
