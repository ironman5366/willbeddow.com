import React, { useEffect, useState } from "react";
import { Stack } from "@mantine/core";
import { PostConnectionQuery } from "../../../tina/__generated__/types";
import client from "../../../tina/__generated__/client";
import { useRouter } from "next/navigation";
import PostCard from "@/components/molecules/PostCard";

interface Props {
  truncateTo?: number;
}

export default function BlogList({ truncateTo }: Props) {
  const [posts, setPosts] = useState<PostConnectionQuery | undefined>();
  const router = useRouter();

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
    (posts && posts.postConnection && posts.postConnection.edges) || [];

  return (
    <Stack>
      {postList.length > 0
        ? postList.map((post) => (
            <PostCard post={post!.node!} key={post?.node?.id} />
          ))
        : "No Posts"}
    </Stack>
  );
}
