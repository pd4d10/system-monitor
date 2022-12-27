%%raw(`
import "/src/style.css"
`)

@react.component
let default = () => {
  let initial: Utils.popup = {}
  let (popup, setPopup) = React.useState(_ => initial)

  React.useEffect0(() => {
    let _ = Utils.getPopupStatus()->Js.Promise2.then(({cpu, memory, battery, storage}) => {
      setPopup(
        _ => {
          ...popup,
          cpu,
          memory,
          battery,
          storage,
        },
      )
      Js.Promise2.resolve()
    })
    None
  })

  let select = (key, checked) => {
    <div>
      <input
        id={key}
        type_="checkbox"
        checked
        onChange={e => {
          let checked = (e->ReactEvent.Form.target)["checked"]
          let v: Utils.popup = {
            cpu: key == "cpu" ? checked : popup.cpu->Option.getWithDefault(true),
            memory: key == "memory" ? checked : popup.memory->Option.getWithDefault(true),
            battery: key == "battery" ? checked : popup.battery->Option.getWithDefault(true),
            storage: key == "storage" ? checked : popup.storage->Option.getWithDefault(true),
          }
          setPopup(_ => v)
          let _ = Utils.setPopupStatus(v)
        }}
      />
      <label className="select-none" htmlFor={key}>
        {`Show ${key == "cpu" ? "CPU" : key}`->React.string}
      </label>
    </div>
  }

  <div className="leading-relaxed">
    <h2> {"Popup settings"->React.string} </h2>
    <div className="my-3">
      {select("cpu", popup.cpu->Option.getWithDefault(true))}
      {select("memory", popup.memory->Option.getWithDefault(true))}
      {select("battery", popup.battery->Option.getWithDefault(true))}
      {select("storage", popup.storage->Option.getWithDefault(true))}
    </div>
    <hr />
    <footer>
      <a href="https://github.com/pd4d10/system-monitor"> {"Source code"->React.string} </a>
      <br />
      <a href="https://github.com/pd4d10/system-monitor/issues/new">
        {"Submit an issue"->React.string}
      </a>
    </footer>
  </div>
}
