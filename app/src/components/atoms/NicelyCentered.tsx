import React, { PropsWithChildren } from "react";
import { Center } from "@mantine/core";

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
    <Center>
      {React.createElement(
        component,
        {
          style: {
            maxWidth: "728px",
            padding: 30,
            ...style,
          },
        },
        children
      )}
    </Center>
  );
}
