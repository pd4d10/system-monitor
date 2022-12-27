@react.component
let make = (~color, ~text) => {
  <div className="text-sm float-left mr-2 leading-none">
    <div className="align-top w-3 h-3 mr-0.5 inline-block" style={{backgroundColor: color}} />
    {text->React.string}
  </div>
}
