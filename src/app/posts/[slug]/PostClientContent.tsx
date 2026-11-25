"use client";
import dynamic from "next/dynamic";
import SocialShare from "./SocialShare";
import Comments from "./Comments";

export default function PostClientContent({ post }: { post: any }) {
  return (
    <>
      <div className="flex-shrink-0">
        <SocialShare post={post} />
      </div>
      <Comments postId={post.slug} />
    </>
  );
}
