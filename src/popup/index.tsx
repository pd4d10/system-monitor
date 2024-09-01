import { FC, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { getSystemInfo } from "../utils";
import BatteryComponent from "./battery";
import CpuComponent from "./cpu";
import MemoryComponent from "./memory";
import StorageComponent from "./storage";

type SetState<S> = (data: Partial<S>) => (s: S) => void;

const Container: FC = () => {
  const [state, _setState] = useState({
    supportBatteryAPI: false,
    cpu: {
      modelName: "",
      usage: [],
      temperatures: [],
    },
    memory: {
      capacity: 1,
      availableCapacity: 1,
    },
    storage: { storage: [] },
    battery: {
      isSupported: false,
      isCharging: false,
      level: 0,
      chargingTime: 0,
      dischargingTime: 0,
    },
  });
  const setState: SetState<typeof state> = (data) => (s) => {
    _setState({
      ...s,
      ...data,
    });
  };

  useEffect(() => {
    const addBatteryListener = async () => {
      // @ts-ignore types
      const _battery = await navigator.getBattery();

      const handleBatteryChange = () => {
        setState({
          battery: {
            ...state.battery,
            isCharging: _battery.charging,
            level: _battery.level,
            chargingTime: _battery.chargingTime,
            dischargingTime: _battery.dischargingTime,
          },
        });
      };

      handleBatteryChange();
      [
        "chargingchange",
        "levelchange",
        "chargingtimechange",
        "dischargingtimechange",
      ].forEach((event) => {
        _battery.addEventListener(event, handleBatteryChange);
      });
    };

    const init = async () => {
      // Trigger CPU, memory and storage status update periodly
      // @ts-ignore TODO:
      await getSystemInfo(setState);

      // Battery
      // @ts-ignore types
      if (typeof navigator.getBattery === "function") {
        setState({
          supportBatteryAPI: true,
        });
        addBatteryListener();
      }
    };

    init();
  }, []);

  return (
    <div style={{ width: 230 }}>
      <CpuComponent {...state.cpu} />
      <MemoryComponent {...state.memory} />
      {state.supportBatteryAPI && <BatteryComponent {...state.battery} />}
      <StorageComponent {...state.storage} />
      {location.search === "" && (
        <div style={{ lineHeight: 1.5, marginTop: 8 }}>
          <a
            href="#"
            style={{ outline: "none", display: "block" }}
            onClick={(e) => {
              e.preventDefault();
              const { clientWidth, clientHeight } = document.documentElement;
              window.open(
                chrome.runtime.getURL("dist/popup.html?window=1"),
                undefined,
                `width=${clientWidth},height=${clientHeight + 24}`,
              );
            }}
          >
            Open as new window
          </a>
          <a
            href="#"
            style={{ outline: "none", display: "block" }}
            onClick={(e) => {
              e.preventDefault();
              chrome.runtime.openOptionsPage();
            }}
          >
            Settings
          </a>
        </div>
      )}
    </div>
  );
};

const root = document.createElement("div");
document.body.appendChild(root);
createRoot(root).render(<Container />);
