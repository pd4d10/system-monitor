import "./style.css";
import { FC, Component, PropsWithChildren } from "react";
import { getSystemInfo, getPopupStatus } from "./utils";

// Convert byte to GB
export function toGiga(byte: number) {
  return (byte / (1024 * 1024 * 1024)).toFixed(2);
}

const width = 220;

const Tip: FC<PropsWithChildren<{}>> = ({ children }) => (
  <p className="my-1 text-sm">{children}</p>
);

const Title: FC<PropsWithChildren<{}>> = ({ children }) => (
  <h2 className="my-2">{children}</h2>
);

const Bar: FC<{
  borderColor: string;
  usages: {
    offset?: number;
    ratio: number;
    color: string;
  }[];
}> = (info) => (
  <div
    className="block h-[10] w-[220] mb-1 relative"
    style={{
      border: `1px solid ${info.borderColor}`,
    }}
  >
    {info.usages.map(({ ratio, offset, color }, index) => (
      <div
        key={index.toString()}
        className="absolute left-0 top-0 w-full h-full"
        style={{
          transition: "transform 0.5s",
          backgroundColor: color,
          transformOrigin: "left top",
          transform: `${
            typeof offset === "undefined"
              ? ""
              : `translateX(${offset * width}px) `
          }scaleX(${ratio})`,
        }}
      />
    ))}
  </div>
);

const Icon: FC<{ color: string; text: string }> = ({ color, text }) => (
  <div className="text-sm float-left mr-2 leading-none">
    <div
      className="align-top w-3 h-3 mr-0.5 inline-block"
      style={{ backgroundColor: color }}
    />
    {text}
  </div>
);

export default class Container extends Component {
  state = {
    status: {
      cpu: false,
      memory: false,
      storage: false,
      battery: false,
    },
    supportBatteryAPI: false,
    cpu: {
      modelName: "",
      temperatures: [],
    },
    memory: {
      capacity: 1,
      availableCapacity: 1,
    },
    storage: [],
    processors: [],
    battery: {
      isSupported: false,
      isCharging: false,
      level: 0,
      chargingtime: 0,
      dischargingTime: 0,
    },
  };

  addBatteryListener = async () => {
    const _battery = await navigator.getBattery();

    const handleBatteryChange = () => {
      this.setState({
        battery: {
          ...this.state.battery,
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

  async componentDidMount() {
    const status = await getPopupStatus();
    this.setState({ status }, async () => {
      // Trigger CPU, memory and storage status update periodly
      getSystemInfo(({ cpu, memory, storage }) => {
        console.log(cpu, memory, storage, cpu.usage);
        this.setState({
          cpu,
          memory,
          storage,
          processors: cpu.usage,
        });
      });

      // Battery
      if (typeof navigator.getBattery === "function") {
        this.setState({
          supportBatteryAPI: true,
        });
        this.addBatteryListener();
      }
    });
  }

  render() {
    const { state } = this;
    const info = state.cpu;

    const colors = {
      kernel: "#3a5eca",
      user: "#6687e7",
      border: "#b3c3f3",
    };

    return (
      <div className="h-[230]">
        {state.status.cpu && (
          <div>
            <Title>CPU</Title>
            <Tip>
              {info.modelName}
              {info.temperatures.length > 0 &&
                ` | ${info.temperatures.map((t) => `${t}°C`).join(", ")}`}
            </Tip>
            <div className="overflow-hidden my-2">
              <Icon color={colors.kernel} text="Kernel" />
              <Icon color={colors.user} text="User" />
            </div>
            {state.processors.map(({ user, kernel, total }, index) => (
              <Bar
                key={index}
                borderColor={colors.border}
                usages={[
                  {
                    ratio: kernel / total,
                    color: colors.kernel,
                  },
                  {
                    offset: kernel / total,
                    ratio: user / total,
                    color: colors.user,
                  },
                ]}
              />
            ))}
          </div>
        )}
        {state.status.memory && (
          <div>
            <Title>Memory</Title>
            <Tip>
              Available: {toGiga(state.memory.availableCapacity)}GB/
              {toGiga(state.memory.capacity)}GB
            </Tip>
            <Bar
              borderColor="#8fd8d4"
              usages={[
                {
                  color: "#198e88",
                  ratio:
                    1 - state.memory.availableCapacity / state.memory.capacity,
                },
              ]}
            />
          </div>
        )}
        {state.status.battery && state.supportBatteryAPI && (
          <div>
            <Title>Battery</Title>
            <Tip>
              {(state.battery.level * 100).toFixed(2)}% (
              {state.battery.isCharging ? "Charging" : "Not charging"})
            </Tip>
            <Bar
              usages={[
                {
                  color: "#B6C8F5",
                  ratio: state.battery.level,
                },
              ]}
              borderColor="#B6C8F5"
            />
          </div>
        )}
        {state.status.storage && (
          <div>
            <Title>Storage</Title>
            {state.storage.map(({ name, capacity, id }) => (
              <Tip key={id}>{`${name || "Unknown"} / ${toGiga(
                capacity
              )}GB`}</Tip>
            ))}
          </div>
        )}
        {location.search === "" && (
          <div className="leading-normal mt-2">
            <a
              href="#"
              className="block"
              onClick={(e) => {
                e.preventDefault();
                const { clientWidth, clientHeight } = document.documentElement;
                window.open(
                  chrome.runtime.getURL("popup.html?window=1"),
                  undefined,
                  `width=${clientWidth},height=${clientHeight + 24}`
                );
              }}
            >
              Open as new window
            </a>
            <a
              href="#"
              className="block"
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
  }
}
