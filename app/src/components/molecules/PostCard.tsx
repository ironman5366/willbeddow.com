import React from "react";
import { PostQuery } from "../../../tina/__generated__/types";
import { Title, Text } from "@mantine/core";
import { BG_COLOR, TEXT_COLOR, ACCENT_COLOR } from "@/theme";
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
        backgroundColor: BG_COLOR,
        padding: "12px 0",
        borderBottom: `1px solid ${ACCENT_COLOR}`,
        color: TEXT_COLOR,
      }}
    >
      <Title order={3} style={{ marginBottom: "4px", fontWeight: 600 }}>
        <FancyLink href={postLink}>{post.title}</FancyLink>
      </Title>
      <Text size="sm" c="dimmed" style={{ marginBottom: "4px" }}>
        <FormattedDate isoString={post.created_at} />
      </Text>
      <Text size="md">{post.blurb}</Text>
    </article>
  );
}
