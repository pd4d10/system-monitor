import { FC, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { Bar, colors, Icon, Tip, Title } from "./styled";
import { getSystemInfo, toGiga } from "./utils";

type SetState<S> = (data: Partial<S>) => (s: S) => void;

const App: FC = () => {
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

  const { cpu, memory, battery, storage } = state;

  return (
    <div style={{ width: 230 }}>
      {/* CPU */}
      <div>
        <Title>CPU</Title>
        <Tip>
          {cpu.modelName}
          {cpu.temperatures.length > 0
            && ` | ${cpu.temperatures.map((t) => `${t}°C`).join(", ")}`}
        </Tip>
        <div style={{ overflow: "hidden", margin: "8px 0" }}>
          <Icon color={colors.cpu.kernel} text="Kernel" />
          <Icon color={colors.cpu.user} text="User" />
        </div>
        {cpu.usage.map(({ user, kernel, total }, index) => (
          <Bar
            key={index}
            borderColor={colors.cpu.border}
            usages={[
              { ratio: kernel / total, color: colors.cpu.kernel },
              { offset: kernel / total, ratio: user / total, color: colors.cpu.user },
            ]}
          />
        ))}
      </div>

      {/* memory */}
      <div>
        <Title>Memory</Title>
        <Tip>
          Available: {toGiga(memory.availableCapacity)}GB/{toGiga(memory.capacity)}GB
        </Tip>
        <Bar
          borderColor={colors.memory.border}
          usages={[{ color: colors.memory.usage, ratio: 1 - memory.availableCapacity / memory.capacity }]}
        />
      </div>

      {/* battery */}
      {state.supportBatteryAPI && (
        <div>
          <Title>Battery</Title>
          <Tip>
            {(battery.level * 100).toFixed(2)}% (
            {battery.isCharging ? "Charging" : "Not charging"})
          </Tip>
          <Bar
            usages={[{ color: colors.battery.usage, ratio: battery.level }]}
            borderColor={colors.battery.border}
          />
        </div>
      )}

      {/* storage */}
      <div>
        <Title>Storage</Title>
        {storage.storage.map(({ name, capacity, id }) => (
          <Tip key={id}>{`${name || "Unknown"} / ${toGiga(capacity)}GB`}</Tip>
        ))}
      </div>

      {/* new window */}
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
        </div>
      )}
    </div>
  );
};

const root = document.createElement("div");
document.body.appendChild(root);
createRoot(root).render(<App />);
