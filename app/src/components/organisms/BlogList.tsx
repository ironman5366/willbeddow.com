import React, { useEffect, useState } from "react";
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
  });

  const postList =
    (posts &&
      posts.postConnection &&
      posts.postConnection.edges &&
      posts.postConnection.edges.reverse()) ||
    [];

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
              marginLeft: "80%",
            }}
          />
        ))}
    </Stack>
  );
}
