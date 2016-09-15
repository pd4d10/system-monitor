import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getCPUInfo } from './reducer/cpu'
import { getMemoryInfo } from './reducer/memory'
import CPUComponent from './component/cpu'
import MemoryComponent from './component/memory'

class Root extends Component {
  render() {
    return (
      <div>
        <div onClick={
        () => {
          this.props.dispatch(getCPUInfo())
          this.props.dispatch(getMemoryInfo())
        }
        }>trigger</div>
        <CPUComponent />
        <MemoryComponent />
      </div>
    )
  }
}

export default connect()(Root)
