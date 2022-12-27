%%raw(`
import "/src/style.css"
`)

type batteryInfo = {
  charging: bool,
  chargingTime: int,
  dischargingTime: int,
  level: float,
}

type navigator
external navigator: navigator = "navigator"
@send external getBattery: navigator => promise<'a> = "getBattery"
type batteryStatus = Idle | Unsupported | Fetched(batteryInfo)

let useBattery = () => {
  let (state, setState) = React.useState(_ => Idle)
  let events = ["chargingchange", "levelchange", "chargingtimechange", "dischargingtimechange"]

  React.useEffect0(() => {
    let bRef = ref(None)

    let handleChange = () => {
      switch bRef.contents {
      | Some(bm) =>
        setState(_ => Fetched({
          charging: bm["charging"],
          chargingTime: bm["chargingTime"],
          dischargingTime: bm["dischargingTime"],
          level: bm["level"],
        }))
      | _ => ()
      }
    }

    let _ =
      navigator
      ->getBattery
      ->Js.Promise2.then(bm => {
        bRef := bm->Some
        handleChange()

        events->Array.forEach(
          event => {
            bm["addEventListener"](. event, handleChange)
          },
        )

        Js.Promise2.resolve()
      })

    Some(
      () => {
        switch bRef.contents {
        | Some(bm) =>
          events->Array.forEach(event => {
            bm["removeEventListener"](. event, handleChange)
          })
        | _ => ()
        }
      },
    )
  })

  state
}

let kernelColor = "#3a5eca"
let userColor = "#6687e7"
let borderColor = "#b3c3f3"

let toGiga = byte => {
  (byte->Int.toFloat /. (1024. *. 1024. *. 1024.))->Js.Float.toFixed
}

@react.component
let default = () => {
  let (status, setStatus) = React.useState(_ => None)
  let (state, setState) = React.useState(_ => None)

  let battery = useBattery()

  React.useEffect0(() => {
    Utils.getSystemInfo(~callback=(cpu, memory, storage, usages) => {
      setState(_ => (cpu, memory, storage, usages, [40, 50]->Some)->Some) // TODO: temperatures
    }, ())

    let _ = Utils.getPopupStatus()->Js.Promise2.then(status => {
      setStatus(_ => status->Some)
      Js.Promise2.resolve()
    })

    None
  })

  <div className="h-[230]">
    {switch (state, status) {
    | (Some((cpu, memory, storage, usages, temperatures)), Some(status)) =>
      <>
        {switch status.cpu {
        | Some(true) =>
          <div>
            <Title> {"CPU"->React.string} </Title>
            <Tip>
              {cpu.modelName->React.string}
              {switch temperatures {
              | None => React.null
              | Some(temperatures) => {
                  let v =
                    temperatures->Array.map(t => t->Int.toString ++ "°C")->Js.Array2.joinWith(", ")
                  (" | " ++ v)->React.string
                }
              }}
            </Tip>
            <div className="overflow-hidden my-2">
              <Icon color={kernelColor} text="Kernel" />
              <Icon color={userColor} text="User" />
            </div>
            {usages
            ->Array.mapWithIndex((index, {user, kernel, total}) =>
              <Bar
                key={index->Int.toString}
                borderColor
                usages={[
                  {
                    ratio: kernel->Int.toFloat /. total->Int.toFloat,
                    color: kernelColor,
                  },
                  {
                    offset: kernel->Int.toFloat /. total->Int.toFloat,
                    ratio: user->Int.toFloat /. total->Int.toFloat,
                    color: userColor,
                  },
                ]}
              />
            )
            ->React.array}
          </div>
        | _ => React.null
        }}
        {switch status.memory {
        | Some(true) =>
          <div>
            <Title> {"Memory"->React.string} </Title>
            <Tip>
              {`Available: ${toGiga(memory.availableCapacity)}GB/
              ${toGiga(memory.capacity)}GB`->React.string}
            </Tip>
            <Bar
              borderColor="#8fd8d4"
              usages={[
                {
                  color: "#198e88",
                  ratio: 1. -.
                  memory.availableCapacity->Int.toFloat /. memory.capacity->Int.toFloat,
                },
              ]}
            />
          </div>
        | _ => React.null
        }}
        {switch (status.battery, battery) {
        | (Some(true), Fetched(info)) =>
          <div>
            <Title> {"Battery"->React.string} </Title>
            <Tip>
              {`${(info.level *. 100.)->Js.Float.toFixed}% (
              ${info.charging ? "Charging" : "Not charging"})`->React.string}
            </Tip>
            <Bar
              usages={[
                {
                  color: "#B6C8F5",
                  ratio: info.level,
                },
              ]}
              borderColor="#B6C8F5"
            />
          </div>
        | (_, _) => React.null
        }}
        {switch status.storage {
        | Some(true) =>
          <div>
            <Title> {"Storage"->React.string} </Title>
            {storage
            ->Array.map(({name, capacity, id}) =>
              <Tip key={id}> {`${name} / ${toGiga(capacity)}GB`->React.string} </Tip>
            )
            ->React.array}
          </div>
        | _ => React.null
        }}
        {switch Webapi.Dom.location->Webapi.Dom.Location.search {
        | "" =>
          <div className="leading-normal mt-2">
            <a
              href="#"
              className="block"
              onClick={e => {
                e->ReactEvent.Mouse.preventDefault

                open Webapi.Dom
                let html = document->Document.documentElement
                let width = html->Element.clientWidth
                let height = html->Element.clientHeight + 24

                let _ =
                  window->Window.open_(
                    ~url=Chrome.Runtime.getURL("popup.html?window=1"),
                    ~name="",
                    ~features=`width=${width->Int.toString},height=${height->Int.toString}}`,
                  )
              }}>
              {"Open as new window"->React.string}
            </a>
            <a
              href="#"
              className="block"
              onClick={e => {
                e->ReactEvent.Mouse.preventDefault
                // TODO: chrome.runtime.openOptionsPage()
              }}>
              {"Settings"->React.string}
            </a>
          </div>
        | _ => React.null
        }}
      </>
    | _ => React.null
    }}
  </div>
}
