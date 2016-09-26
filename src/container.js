import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getInfo } from './reducer'
import CPUComponent from './component/cpu'
import MemoryComponent from './component/memory'

class Root extends Component {
  render() {
    return (
      <div>
        <div onClick={() => this.props.dispatch(getInfo())}>trigger</div>
        <CPUComponent />
        <MemoryComponent />
      </div>
    )
  }
}

export default connect()(Root)
