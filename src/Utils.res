type popup = {
  cpu?: bool,
  memory?: bool,
  battery?: bool,
  storage?: bool,
}

let rec getSystemInfo = (
  ~callback,
  ~last: option<array<Chrome.System.Cpu.processorUsage>>=?,
  (),
) => {
  let _ = Js.Promise2.all3((
    Js.Promise2.make((~resolve, ~reject as _) => {
      Chrome.System.Cpu.getInfoWithCallback(info => {
        resolve(. info)
      })
    }),
    Js.Promise2.make((~resolve, ~reject as _) => {
      Chrome.System.Memory.getInfoWithCallback(info => {
        resolve(. info)
      })
    }),
    Js.Promise2.make((~resolve, ~reject as _) => {
      Chrome.System.Storage.getInfoWithCallback(info => {
        resolve(. info)
      })
    }),
  ))->Js.Promise2.then(((cpu, memory, storage)) => {
    let usages = cpu.processors->Array.map(p => p.usage)

    let next = switch last {
    | None => usages
    | Some(last) =>
      usages
      ->Array.keep(a => a.total > 0) // https://github.com/pd4d10/system-monitor/issues/3
      ->Array.zipBy(last, (a, b) => {
        let v: Chrome.System.Cpu.processorUsage = {
          user: a.user - b.user,
          kernel: a.kernel - b.kernel,
          idle: a.idle - b.idle,
          total: a.total - b.total,
        }
        v
      })
    }

    callback(cpu, memory, storage, next)

    let _ = Js.Global.setTimeout(() => {
      getSystemInfo(~callback, ~last=usages, ())
    }, 1000)

    Js.Promise2.resolve()
  })
}

let getPopupStatus = () => {
  Js.Promise2.make((~resolve, ~reject as _) => {
    Chrome.Storage.Sync.getAll(items => {
      let popup = items["popup"]->Option.getWithDefault(Js.Dict.empty())

      resolve(. {
        cpu: popup->Js.Dict.get("cpu")->Belt.Option.getWithDefault(true),
        memory: popup->Js.Dict.get("memory")->Belt.Option.getWithDefault(true),
        battery: popup->Js.Dict.get("battery")->Belt.Option.getWithDefault(true),
        storage: popup->Js.Dict.get("storage")->Belt.Option.getWithDefault(true),
      })
    })
  })
}

let setPopupStatus = popup => {
  Js.Promise2.make((~resolve, ~reject as _) => {
    Chrome.Storage.Sync.setWithCallback(
      {
        "popup": popup,
      },
      resolve(. _),
    )
  })
}
