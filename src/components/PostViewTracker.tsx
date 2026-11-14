"use client";

import { useEffect } from "react";
import { doc, updateDoc, increment } from "firebase/firestore";
import { db } from "@/utils/firebase";

interface PostViewTrackerProps {
  postId?: string;
  slug?: string;
  collectionName?: "posts" | "posts_hindi";
}

export default function PostViewTracker({
  postId,
  slug,
  collectionName = "posts",
}: PostViewTrackerProps) {
  useEffect(() => {
    const targetKey = postId || slug;
    if (!targetKey) return;

    const storageKey = `pv_${collectionName}_${targetKey}`;
    try {
      if (sessionStorage.getItem(storageKey)) {
        return; // Already counted this view in this session
      }
      sessionStorage.setItem(storageKey, "1");
    } catch {
      // Ignore sessionStorage exceptions (e.g. private browsing restrictions)
    }

    // 1. Try server-side admin API first (bypasses ad blockers and security rule edge cases)
    fetch("/api/posts/view", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ postId, slug, collection: collectionName }),
      keepalive: true,
    })
      .then((res) => {
        if (!res.ok && postId) {
          // Fallback to client-side Firestore if API fails
          updateDoc(doc(db, collectionName, postId), { views: increment(1) }).catch(() => {});
        }
      })
      .catch(() => {
        if (postId) {
          updateDoc(doc(db, collectionName, postId), { views: increment(1) }).catch(() => {});
        }
      });
  }, [postId, slug, collectionName]);

  return null;
}

