import React, { useEffect, useMemo, useState } from "react";
import { PostConnectionQuery } from "../../../tina/__generated__/types";
import client from "../../../tina/__generated__/client";
import PostCard from "@/components/molecules/PostCard";
import Link from "next/link";
import { DEEP, TEAL } from "@/theme";

function AllPostsLink() {
  return (
    <Link
      href={"/writing"}
      style={{
        color: DEEP,
        fontSize: "0.9em",
        display: "inline-block",
        marginTop: "8px",
        borderBottom: `1px solid ${TEAL}`,
        paddingBottom: "2px",
      }}
    >
      All Posts →
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
    <div>
      {postList.length > 0
        ? postList.map((post) => (
            <PostCard post={post!.node!} key={post?.node?.id} />
          ))
        : "loading..."}
      {truncateTo !== undefined && <AllPostsLink />}
    </div>
  );
}
