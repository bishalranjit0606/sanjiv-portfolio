import type { APIRoute } from "astro";
import type { CollectionEntry } from "astro:content";
import { generateOgImageForPost } from "@utils/generateOgImages";
import { getBlogPosts } from "@utils/getBlogPosts";
import { slugifyStr } from "@utils/slugify";

export async function getStaticPaths() {
  const posts = await getBlogPosts(({ data }) => !data.draft && !data.ogImage);

  return posts.map(post => ({
    params: { slug: slugifyStr(post.data.title) },
    props: post,
  }));
}

export const GET: APIRoute = async ({ props }) =>
  new Response(await generateOgImageForPost(props as CollectionEntry<"blog">), {
    headers: { "Content-Type": "image/png" },
  });
