import React from 'react'
import { render } from 'react-dom'

class Options extends React.Component {
  state = {
    ready: false,
    popup: {},
  }

  setParams = params => {
    const result = { popup: { ...this.state.popup, ...params } }
    this.setState(result, () => {
      chrome.storage.sync.set({ popup: params })
    })
  }

  componentDidMount() {
    chrome.storage.sync.get(res => {
      if (!res.popup) {
        this.setParams({
          cpu: true,
          memory: true,
          battery: true,
          storage: true,
        })
      } else {
        this.setState(res.popup)
      }
      this.setState({ ready: true })
    })
  }

  render() {
    const items = ['cpu', 'memory', 'battery', 'storage']
    return (
      this.state.ready && (
        <React.Fragment>
          <div>
            {items.map(item => (
              <div>
                <input
                  type="checkbox"
                  value={this.state.popup[item]}
                  onChange={e => {
                    this.setParams({ [item]: e.target.value })
                  }}
                />
                Show {item}
              </div>
            ))}
          </div>
          <footer>
            <a href="https://github.com/pd4d10/system-monitor">Source code</a>
            <br />
            <a href="https://github.com/pd4d10/system-monitor/issues/new">
              Submit an issue
            </a>
          </footer>
        </React.Fragment>
      )
    )
  }
}

const root = document.createElement('div')
document.body.appendChild(root)
render(<Options />, root)
