import { FC } from "react";
import { toGiga } from "../utils";
import { Bar, Tip, Title } from "./styled";

const MemoryComponent: FC<{
  capacity: number;
  availableCapacity: number;
}> = ({ capacity, availableCapacity }) => {
  const memoryStyle = {
    width: `${100 * (1 - availableCapacity / capacity)}%`,
  };
  return (
    <div>
      <Title>Memory</Title>
      <Tip>
        Available: {toGiga(availableCapacity)}GB/{toGiga(capacity)}GB
      </Tip>
      <Bar
        borderColor="#8fd8d4"
        usages={[
          {
            color: "#198e88",
            ratio: 1 - availableCapacity / capacity,
          },
        ]}
      />
    </div>
  );
};

export default MemoryComponent;
