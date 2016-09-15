import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getCPUInfo } from './reducer'

const CPU = ({
  archName,
  arr
}) => (
  <div>
    <h3>{archName}</h3>
    <ul>
      {arr.map(ratio => <li>{ratio}</li>)}
    </ul>
  </div>
)

const DataCPU = connect(
  state => ({
    archName: state.archName,
    arr: state.cpu,
  })
)(CPU)

class Root extends Component {
  componentDidMount() {
    this.props.dispatch(getCPUInfo())
  }

  render() {
    return (
      <div>
        <DataCPU />
      </div>
    )
  }
}

export default connect()(Root)
