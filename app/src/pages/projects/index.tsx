import React, { useEffect } from "react";
import { Button, Stack } from "@mantine/core";
import client from "../../../tina/__generated__/client";
import BlogList from "@/components/organisms/BlogList";

export default function Projects() {
  return (
    <Stack>
      Hello
      <Button>Mantine button</Button>
      <BlogList />
    </Stack>
  );
}
