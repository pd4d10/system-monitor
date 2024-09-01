import React from 'react'
import { createRoot } from 'react-dom/client';
import { storage } from './utils'

class Option extends React.Component {
  state = {
    ready: false,
    popup: {},
  }

  setParams = (params) => {
    const result = { ...this.state.popup, ...params }
    this.setState({ popup: result }, () => {
      storage.setPopupStatus(result)
    })
  }

  componentDidMount() {
    storage.getPopupStatus().then((popup) => {
      this.setState({ popup, ready: true })
    })
  }

  textMap = {
    cpu: 'CPU',
  }

  render() {
    return (
      this.state.ready && (
        <div style={{ lineHeight: 1.8 }}>
          <h2>Popup settings</h2>
          <div style={{ marginTop: 12, marginBottom: 12 }}>
            {['cpu', 'memory', 'battery', 'storage'].map((item) => (
              <div key={item}>
                <input
                  id={item}
                  type="checkbox"
                  checked={this.state.popup[item]}
                  onChange={(e) => {
                    this.setParams({ [item]: e.target.checked })
                  }}
                />
                <label
                  style={{
                    userSelect: 'none',
                    marginLeft: 2,
                  }}
                  htmlFor={item}
                >
                  Show {this.textMap[item] || item}
                </label>
              </div>
            ))}
          </div>
          <hr />
          <footer>
            <a href="https://github.com/pd4d10/system-monitor">Source code</a>
            <br />
            <a href="https://github.com/pd4d10/system-monitor/issues/new">
              Submit an issue
            </a>
          </footer>
        </div>
      )
    )
  }
}

const root = document.createElement('div')
document.body.appendChild(root)
createRoot(root).render(<Option />)
