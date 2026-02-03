import React from "react";
import { PostQuery } from "../../../tina/__generated__/types";
import { Title, Text } from "@mantine/core";
import { BACKGROUND_COLOR, SECONDARY_COLOR, TEXT_COLOR } from "@/theme";
import FormattedDate from "@/components/atoms/FormattedDate";
import { getDocumentPath } from "@/blogUtils";
import FancyLink from "@/components/atoms/FancyLink";

interface Props {
  post: PostQuery["post"];
}

export default function PostCard({ post }: Props) {
  const postLink = getDocumentPath(post);
  return (
    <article
      style={{
        backgroundColor: BACKGROUND_COLOR,
        borderRadius: 0,
        padding: "12px 0",
        borderBottom: `1px solid ${SECONDARY_COLOR}`,
        color: TEXT_COLOR,
      }}
    >
      <Title
        order={3}
        style={{
          fontSize: "1.1em",
          fontWeight: 600,
          marginBottom: "4px",
        }}
      >
        <FancyLink href={postLink}>{post.title}</FancyLink>
      </Title>
      <Text
        size="sm"
        style={{
          color: SECONDARY_COLOR,
          marginBottom: "4px",
        }}
      >
        <FormattedDate isoString={post.created_at} />
      </Text>
      <Text size="sm" style={{ color: TEXT_COLOR }}>
        {post.blurb}
      </Text>
    </article>
  );
}
