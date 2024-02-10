import React, { PropsWithChildren } from "react";
import { Center } from "@mantine/core";
import useIsMobile from "@/hooks/useIsMobile";

interface Props {
  component: React.ElementType;
  style?: React.CSSProperties;
}

export default function NicelyCentered({
  children,
  component,
  style,
}: PropsWithChildren<Props>) {
  const isMobile = useIsMobile();

  return (
    <Center>
      {React.createElement(
        component,
        {
          style: {
            maxWidth: "min(728px, 90vw)",
            padding: isMobile ? 10 : 30,
            ...style,
          },
        },
        children
      )}
    </Center>
  );
}
