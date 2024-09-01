import React from "react";
import { toGiga } from "../utils";
import { Tip, Title } from "./styled";

const StorageComponent: React.FC<{
  storage: { name: string; capacity: number; id: string }[];
}> = ({ storage }) => (
  <div>
    <Title>Storage</Title>
    {storage.map(({ name, capacity, id }) => <Tip key={id}>{`${name || "Unknown"} / ${toGiga(capacity)}GB`}</Tip>)}
  </div>
);

export default StorageComponent;
