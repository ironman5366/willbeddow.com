import React, { useEffect, useMemo, useState } from "react";
import { Button, Center, Stack } from "@mantine/core";
import { PostConnectionQuery } from "../../../tina/__generated__/types";
import client from "../../../tina/__generated__/client";
import PostCard from "@/components/molecules/PostCard";
import Link from "next/link";
import useIsMobile from "@/hooks/useIsMobile";

function AllPostsButton({ style }: { style?: React.CSSProperties }) {
  return (
    <Button
      component={Link}
      href={"/writing"}
      style={{
        ...style,
      }}
    >
      All Posts →
    </Button>
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
      // Sort by created_at descending
      return posts.postConnection.edges.sort(
        (a, b) =>
          new Date(b!.node!.created_at!).getTime() -
          new Date(a!.node!.created_at!).getTime()
      );
    }
    return [];
  }, [posts]);

  return (
    <Stack>
      {postList.length > 0
        ? postList.map((post) => (
            <PostCard post={post!.node!} key={post?.node?.id} />
          ))
        : "Loading posts..."}
      {truncateTo !== undefined &&
        (isMobile ? (
          <Center>
            <AllPostsButton />
          </Center>
        ) : (
          <AllPostsButton
            style={{
              marginLeft: "60%",
            }}
          />
        ))}
    </Stack>
  );
}
