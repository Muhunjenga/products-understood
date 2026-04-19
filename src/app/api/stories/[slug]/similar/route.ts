import { getSimilarStories, getStoryBySlug } from "@/lib/queries";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const story = await getStoryBySlug(slug);
  if (!story) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const similar = await getSimilarStories(slug, story.categories, 3);
  return NextResponse.json(similar);
}
