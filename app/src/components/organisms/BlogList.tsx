import React, { useEffect, useMemo, useState } from "react";
import { Stack, Text } from "@mantine/core";
import { PostConnectionQuery } from "../../../tina/__generated__/types";
import client from "../../../tina/__generated__/client";
import PostCard from "@/components/molecules/PostCard";
import Link from "next/link";
import { PRIMARY_COLOR, SECONDARY_COLOR } from "@/theme";

function AllPostsLink() {
  return (
    <Link
      href={"/writing"}
      style={{
        color: PRIMARY_COLOR,
        fontWeight: 500,
        fontSize: "0.9em",
        marginTop: "8px",
        display: "inline-block",
      }}
    >
      View all posts →
    </Link>
  );
}

interface Props {
  truncateTo?: number;
}

export default function BlogList({ truncateTo }: Props) {
  const [posts, setPosts] = useState<PostConnectionQuery | undefined>();

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
    <Stack gap={0}>
      {postList.length > 0 ? (
        postList.map((post) => (
          <PostCard post={post!.node!} key={post?.node?.id} />
        ))
      ) : (
        <Text size="sm" style={{ color: SECONDARY_COLOR }}>
          Loading...
        </Text>
      )}
      {truncateTo !== undefined && <AllPostsLink />}
    </Stack>
  );
}
