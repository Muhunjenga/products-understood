import { getAllStories } from "@/lib/queries";
import { NextResponse } from "next/server";

export async function GET() {
  const stories = await getAllStories();
  return NextResponse.json(stories);
}
