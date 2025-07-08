import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import dbConnect from "@/lib/dbConnect";
import Media from "@/models/Media.model";

// GET: Public — Fetch All Media (Photos/Videos)
export async function GET(req) {
  try {
    await dbConnect();

    const mediaItems = await Media.find().sort({ createdAt: -1 });

    return NextResponse.json({ media: mediaItems }, { status: 200 });
  } catch (error) {
    console.error("Fetch Media Error:", error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}

// POST: Admin — Upload New Media Item
export async function POST(req) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.memberType !== "Admin") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    await dbConnect();

    const { type, url, title, description } = await req.json();

    if (!type || !url || !title) {
      return NextResponse.json(
        { message: "Type, URL, and Title are required" },
        { status: 400 }
      );
    }

    const newMedia = await Media.create({
      type, // 'photo' | 'video'
      url,
      title,
      description,
    });

    return NextResponse.json(
      { message: "Media uploaded successfully", media: newMedia },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create Media Error:", error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}
