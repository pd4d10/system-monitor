import { useEffect, useState } from "react";
import "./style.css";
import * as Utils from "./Utils.js";

interface Popup {
  cpu?: boolean;
  memory?: boolean;
  battery?: boolean;
  storage?: boolean;
}

export default function Options() {
  const [popup, setPopup] = useState<Popup>({});

  useEffect(() => {
    Utils.getPopupStatus(({ cpu, memory, battery, storage }) => {
      setPopup({
        ...popup,
        cpu,
        memory,
        battery,
        storage,
      });
    });
  }, []);

  const select = (key: keyof Popup, checked: boolean) => {
    return (
      <div>
        <input
          id={key}
          type="checkbox"
          checked={checked}
          onChange={(e) => {
            const v: Popup = {
              cpu: key == "cpu" ? e.target.checked : popup.cpu ?? true,
              memory: key == "memory" ? e.target.checked : popup.memory ?? true,
              battery:
                key == "battery" ? e.target.checked : popup.battery ?? true,
              storage:
                key == "storage" ? e.target.checked : popup.storage ?? true,
            };
            setPopup(v);
            Utils.setPopupStatus(v);
          }}
        />
        <label className="select-none" htmlFor={key}>
          Show {key == "cpu" ? "CPU" : key}
        </label>
      </div>
    );
  };

  return (
    <div className="leading-relaxed">
      <h2>Popup settings</h2>
      <div className="my-3">
        {select("cpu", popup.cpu ?? true)}
        {select("memory", popup.memory ?? true)}
        {select("battery", popup.battery ?? true)}
        {select("storage", popup.storage ?? true)}
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
  );
}
