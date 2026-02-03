import React, { useEffect, useMemo, useState } from "react";
import { Center, Stack } from "@mantine/core";
import { PostConnectionQuery } from "../../../tina/__generated__/types";
import client from "../../../tina/__generated__/client";
import PostCard from "@/components/molecules/PostCard";
import Link from "next/link";
import useIsMobile from "@/hooks/useIsMobile";
import { TEXT_COLOR } from "@/theme";

function AllPostsLink({ style }: { style?: React.CSSProperties }) {
  return (
    <Link
      href="/writing"
      style={{
        color: TEXT_COLOR,
        fontWeight: 500,
        textDecoration: "underline",
        fontSize: "0.95em",
        ...style,
      }}
    >
      All posts &rarr;
    </Link>
  );
}

interface Props {
  truncateTo?: number;
}

export default function BlogList({ truncateTo }: Props) {
  const [posts, setPosts] = useState<PostConnectionQuery | undefined>();
  const isMobile = useIsMobile();

  useEffect(() => {
    client.queries
      .postConnection({
        last: truncateTo,
        sort: "created_at",
      })
      .then((res) => {
        setPosts(res.data);
      });
  }, []);

  const postList = useMemo(() => {
    if (posts && posts.postConnection && posts.postConnection.edges) {
      return posts.postConnection.edges.sort(
        (a, b) =>
          new Date(b!.node!.created_at!).getTime() -
          new Date(a!.node!.created_at!).getTime()
      );
    }
    return [];
  }, [posts]);

  return (
    <Stack gap="xs">
      {postList.length > 0
        ? postList.map((post) => (
            <PostCard post={post!.node!} key={post?.node?.id} />
          ))
        : "Loading posts..."}
      {truncateTo !== undefined && (
        <div style={{ marginTop: "8px", textAlign: isMobile ? "center" : "right" }}>
          <AllPostsLink />
        </div>
      )}
    </Stack>
  );
}
