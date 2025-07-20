import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Story from "@/models/Story.model";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.memberType !== "Admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    await dbConnect();

    const stories = await Story.find({})
      .populate("postedBy", "name email")
      .sort({ createdAt: -1 });

    return NextResponse.json(stories);
  } catch (error) {
    console.error("Error fetching stories:", error);
    return NextResponse.json(
      { message: "Failed to fetch stories", error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.memberType !== "Admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    await dbConnect();

    const data = await request.json();

    if (!data.title || !data.content) {
      return NextResponse.json(
        { message: "Title and content are required" },
        { status: 400 }
      );
    }

    const newStory = await Story.create({
      title: data.title,
      content: data.content,
      authorName: data.authorName,
      image: data.image,
      imagePublicId: data.imagePublicId,
      postedBy: session.user.id,
    });

    await newStory.populate("postedBy", "name email");

    return NextResponse.json(newStory, { status: 201 });
  } catch (error) {
    console.error("Error creating story:", error);
    return NextResponse.json(
      { message: "Failed to create story", error: error.message },
      { status: 500 }
    );
  }
}
