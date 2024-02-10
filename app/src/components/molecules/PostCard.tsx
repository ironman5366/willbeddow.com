import React from "react";
import { PostQuery } from "../../../tina/__generated__/types";
import { Card, Title, Text } from "@mantine/core";
import { WHITE_SMOKE, WINE_MID_COLOR } from "@/theme";
import FormattedDate from "@/components/atoms/FormattedDate";
import { getDocumentPath } from "@/blogUtils";
import FancyLink from "@/components/atoms/FancyLink";

interface Props {
  post: PostQuery["post"];
}

export default function PostCard({ post }: Props) {
  const postLink = getDocumentPath(post);
  return (
    <Card
      style={{
        backgroundColor: WHITE_SMOKE,
        borderRadius: 10,
        padding: 10,
        border: `2px solid ${WINE_MID_COLOR}`,
        color: WINE_MID_COLOR,
      }}
    >
      <Title order={3}>
        <FancyLink href={postLink} className="underline">
          {post.title}
        </FancyLink>
      </Title>
      <Text size={"sm"}>
        Created {<FormattedDate isoString={post.created_at} />}, Updated{" "}
        {<FormattedDate isoString={post.updated_at} />}
      </Text>
      <Text size={"md"}>
        <i>{post.blurb}</i>
      </Text>
    </Card>
  );
}
