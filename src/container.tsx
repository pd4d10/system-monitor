import { h, Component } from 'preact'
import { trigger, giga } from './util'
import CPUComponent from './component/cpu'
import MemoryComponent from './component/memory'
import StorageComponent from './component/storage'
import './container.less'

export default class Container extends Component {
  state = {
    cpu: {
      modelName: '',
      usage: [],
    },
    memory: {
      capacity: 1,
      availableCapacity: 1,
    },
    storage: [],
  }

  componentDidMount() {
    trigger(this.setState.bind(this))
  }

  render() {
    const { cpu, memory, storage } = this.state

    return (
      <div className="container">
        <CPUComponent
          modelName={cpu.modelName}
          usage={cpu.usage}
        />
        <MemoryComponent
          total={giga(memory.capacity)}
          available={giga(memory.availableCapacity)}
        />
        <StorageComponent
          storage={storage}
        />
      </div>
    )
  }
}
