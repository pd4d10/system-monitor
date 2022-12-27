type usage = {
  offset?: float,
  ratio: float,
  color: string,
}

let width = 220.

@react.component
let make = (~borderColor, ~usages) => {
  <div
    className="block h-[10] w-[220] mb-1 relative"
    style={ReactDOM.Style.make(~border=`1px solid ${borderColor}`, ())}>
    {usages
    ->Array.mapWithIndex((i, usage) =>
      <div
        key={i->Int.toString}
        className="absolute left-0 top-0 w-full h-full"
        style={ReactDOM.Style.make(
          ~transition="transform 0.5s",
          ~backgroundColor=usage.color,
          ~transformOrigin="left top",
          ~transform=switch usage.offset {
          | None => ""
          | Some(offset) => {
              let px = offset *. width
              `translateX(${px->Float.toString}px) scaleX(${usage.ratio->Float.toString})`
            }
          },
          (),
        )}
      />
    )
    ->React.array}
  </div>
}
