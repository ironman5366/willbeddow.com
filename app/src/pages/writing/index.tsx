import { Center, Paper, Title } from "@mantine/core";
import NicelyCentered from "@/components/atoms/NicelyCentered";
import BlogTable from "@/components/organisms/BlogTable";

export default function Writing() {
  return (
    <NicelyCentered
      component={Paper}
      style={{
        borderRadius: 20,
      }}
    >
      <Center>
        <Title c={"wine"}>Writing</Title>
      </Center>
      <BlogTable />
    </NicelyCentered>
  );
}
