import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import dbConnect from "@/lib/dbConnect";
import Story from "@/models/Story.model";

// GET Public — List All Success Stories
export async function GET(req) {
  try {
    await dbConnect();

    const stories = await Story.find().sort({ createdAt: -1 });

    return NextResponse.json({ stories }, { status: 200 });
  } catch (error) {
    console.error("Get Stories Error:", error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}

// POST Admin — Create New Success Story
export async function POST(req) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.memberType !== "Admin") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    await dbConnect();

    const { title, content, image, category } = await req.json();

    if (!title || !content) {
      return NextResponse.json(
        { message: "Title and Content are required" },
        { status: 400 }
      );
    }

    const newStory = await Story.create({
      title,
      content,
      image,
      category,
    });

    return NextResponse.json(
      { message: "Story created successfully", story: newStory },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create Story Error:", error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}
