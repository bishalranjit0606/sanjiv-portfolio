import { getCollection, type CollectionEntry } from "astro:content";

/** Published and draft posts. An empty blog folder returns an empty list. */
export async function getBlogPosts(
  filter?: (entry: CollectionEntry<"blog">) => boolean
) {
  try {
    const posts = (await getCollection("blog")) ?? [];
    return filter ? posts.filter(filter) : posts;
  } catch {
    return [];
  }
}
