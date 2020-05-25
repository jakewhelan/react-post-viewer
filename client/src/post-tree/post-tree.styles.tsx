import { compileStylesheet } from '@core/jss'

const styles = {
  buttonContainer: {
    display: 'flex'
  },
  button: {
    flex: 1,
    height: '50px',
    cursor: 'pointer',
    outline: 'none',
    border: '1px solid black',
    background: '#f0f0f0',
    '&:hover': {
      background: '#d2d2d2'
    },
    '&:nth-of-type(2)': {
      borderLeft: 'none',
      borderRight: 'none'
    }
  },
  selected: {
    background: '#d2d2d2 !important'
  }
}

export const classes = compileStylesheet(styles)
