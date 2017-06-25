import { h } from 'preact'

const style = {
  fontSize: '14px',
  margin: '4px 0',
}

const Tip = (props) => (
  <p style={style} {...props} />
)

export default Tip
