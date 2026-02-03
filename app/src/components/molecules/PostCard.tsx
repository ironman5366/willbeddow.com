import React from "react";
import { PostQuery } from "../../../tina/__generated__/types";
import { DEEP, TEAL } from "@/theme";
import FormattedDate from "@/components/atoms/FormattedDate";
import { getDocumentPath } from "@/blogUtils";
import FancyLink from "@/components/atoms/FancyLink";

interface Props {
  post: PostQuery["post"];
}

export default function PostCard({ post }: Props) {
  const postLink = getDocumentPath(post);
  return (
    <div
      style={{
        borderBottom: `1px solid ${TEAL}`,
        padding: "12px 0",
        color: DEEP,
      }}
    >
      <h3
        style={{
          fontSize: "1em",
          fontWeight: 600,
          margin: "0 0 4px 0",
        }}
      >
        <FancyLink href={postLink}>{post.title}</FancyLink>
      </h3>
      <p
        style={{
          fontSize: "0.8em",
          margin: "0 0 4px 0",
          color: TEAL,
        }}
      >
        <FormattedDate isoString={post.created_at} />
      </p>
      <p
        style={{
          fontSize: "0.9em",
          margin: 0,
          fontStyle: "italic",
        }}
      >
        {post.blurb}
      </p>
    </div>
  );
}
