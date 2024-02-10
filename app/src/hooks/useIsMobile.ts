import { useMediaQuery } from "@mantine/hooks";
import { em } from "@mantine/core";

export default function useIsMobile() {
  return useMediaQuery(`(max-width: ${em(800)})`);
}
