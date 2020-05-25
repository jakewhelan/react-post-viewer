import 'reset-css/reset.css'
import 'box-sizing-border-box/_index.css'
import { compileStylesheet } from '@core/jss'

const styles = {
  root: {
    maxWidth: '700px',
    margin: '0 auto'
  }
}

export const classes = compileStylesheet(styles)
