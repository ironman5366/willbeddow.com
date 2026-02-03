import React from "react";
import { PostQuery } from "../../../tina/__generated__/types";
import { Card, Title, Text } from "@mantine/core";
import { CREAM, CHARCOAL, CHARCOAL_LIGHT } from "@/theme";
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
        backgroundColor: CREAM,
        padding: "16px",
        border: `1px solid ${CHARCOAL}`,
        color: CHARCOAL,
      }}
    >
      <Title order={3} style={{ marginBottom: "4px", fontWeight: 500 }}>
        <FancyLink href={postLink}>
          {post.title}
        </FancyLink>
      </Title>
      <Text size={"sm"} c={CHARCOAL_LIGHT} style={{ marginBottom: "8px" }}>
        <FormattedDate isoString={post.created_at} />
      </Text>
      <Text size={"sm"} c={CHARCOAL_LIGHT}>
        {post.blurb}
      </Text>
    </Card>
  );
}
