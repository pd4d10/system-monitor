import { FC, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";

const storageKey = "popup";

type Status = {
  cpu: boolean;
  memory: boolean;
  battery: boolean;
  storage: boolean;
};

const App: FC = () => {
  const [status, setStatus] = useState<Status>();
  const mergeStatus = (data: Partial<Status>) => {
    setStatus(previous => ({
      // defaults
      cpu: true,
      memory: true,
      battery: true,
      storage: true,

      // overrides
      ...previous,
      ...data,
    }));
  };

  useEffect(() => {
    chrome.storage.sync.get(storageKey, (res) => {
      mergeStatus(res[storageKey]);
    });
  }, []);

  useEffect(() => {
    chrome.storage.sync.set({ [storageKey]: status });
  }, [status]);

  return (
    status && (
      <div style={{ lineHeight: 1.8 }}>
        <h2>Popup settings</h2>
        <div style={{ marginTop: 12, marginBottom: 12 }}>
          {(["cpu", "memory", "battery", "storage"] as const).map((item) => (
            <div key={item}>
              <input
                id={item}
                type="checkbox"
                checked={status[item]}
                onChange={(e) => {
                  mergeStatus({ [item]: e.target.checked });
                }}
              />
              <label style={{ userSelect: "none", marginLeft: 2 }} htmlFor={item}>
                Show {item}
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
  );
};

const root = document.createElement("div");
document.body.appendChild(root);
createRoot(root).render(<App />);
