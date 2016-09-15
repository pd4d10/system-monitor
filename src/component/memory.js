import React, { PropTypes } from 'react'
import { connect } from 'react-redux'

const Memory = ({
  total,
  available,
  ratio,
}) => (
  <div>
    {total} / 
    {available} /
    {ratio}
  </div>
)

Memory.propTypes = {
  total: PropTypes.number.isRequired,
  available: PropTypes.number.isRequired,
}

const GEGA = 1024 * 1024 * 1024

const mapStateToProps = ({
  memory: {
    total,
    available,
  }
}) => ({
  total: `${total / GEGA}G`,
  available: `${available / GEGA}G`,
  ratio: available / total,
})

export default connect(mapStateToProps)(Memory)
