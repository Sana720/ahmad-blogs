import { NextResponse } from "next/server";
import { createHindiPost, HindiPostInput } from "@/utils/createHindiPost";

function slugify(text: string): string {
  return text
    .toString()
    .normalize('NFKD')
    .replace(/[\u0300-\u036F]/g, '') // Remove accents
    .replace(/[^\w\s-]/g, '') // Remove non-word chars
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/-+/g, '-') // Remove multiple -
    .toLowerCase();
}

export async function POST(req: Request) {
  const data: HindiPostInput = await req.json();
  // Auto-generate slug if missing or blank
  if (!data.slug || !data.slug.trim()) {
    data.slug = slugify(data.title || '');
  }
  // TODO: Add validation and admin check
  const id = await createHindiPost(data);
  return NextResponse.json({ id });
}
