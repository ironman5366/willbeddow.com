import { Center, Paper, Title } from "@mantine/core";
import NicelyCentered from "@/components/atoms/NicelyCentered";
import BlogList from "@/components/organisms/BlogList";

export default function Writing() {
  return (
    <NicelyCentered component={"div"}>
      <Center>
        <Title c={"wine"}>Writing</Title>
      </Center>
      <BlogList />
    </NicelyCentered>
  );
}
