import { FC, PropsWithChildren } from "react";

const width = 220;

export const Tip: FC<PropsWithChildren> = ({ children }) => (
  <p
    style={{
      fontSize: 14,
      margin: "4px 0",
    }}
  >
    {children}
  </p>
);

export const Title: FC<PropsWithChildren> = ({ children }) => (
  <h2
    style={{
      margin: "8px 0",
    }}
  >
    {children}
  </h2>
);

export const Bar: FC<{
  borderColor: string;
  usages: {
    ratio: number;
    offset?: number;
    color: string;
  }[];
}> = (info) => (
  <div
    style={{
      display: "block",
      width: `${width}px`,
      height: "10px",
      marginBottom: "4px",
      border: `1px solid ${info.borderColor}`,
      position: "relative",
    }}
  >
    {info.usages.map(({ ratio, offset, color }, index) => (
      <div
        key={index.toString()}
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: "100%",
          height: "100%",
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
