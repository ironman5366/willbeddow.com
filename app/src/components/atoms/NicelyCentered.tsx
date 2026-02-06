import React, { PropsWithChildren } from "react";

interface Props {
  component: React.ElementType;
  style?: React.CSSProperties;
}

export default function NicelyCentered({
  children,
  component,
  style,
}: PropsWithChildren<Props>) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
      }}
    >
      {React.createElement(
        component,
        {
          style: {
            maxWidth: "min(700px, 100%)",
            width: "100%",
            ...style,
          },
        },
        children
      )}
    </div>
  );
}
