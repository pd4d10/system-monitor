import { h } from 'preact'

const style = {
  fontSize: '14px',
  margin: '4px 0',
}

const Tip = (props: any) => (
  <p style={style}>{props.children}</p>
)

export default Tip
