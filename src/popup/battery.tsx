import React from "react";
import { Bar, Tip, Title } from "./styled";

const BatteryComponent = (info) => (
  <div>
    <Title>Battery</Title>
    <Tip>
      {(info.level * 100).toFixed(2)}% (
      {info.isCharging ? "Charging" : "Not charging"})
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
);

export default BatteryComponent;
