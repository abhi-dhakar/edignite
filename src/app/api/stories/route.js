import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Story from "@/models/Story.model";
import User from "@/models/User.model";

// GET Fetch all stories (PUBLIC ACCESS)
export async function GET(request) {
  try {

    await dbConnect();

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");

    const query = {};
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
        { authorName: { $regex: search, $options: "i" } },
      ];
    }

    const stories = await Story.find(query)
      .sort({ date: -1 })
      .populate("postedBy", "name");

    return NextResponse.json({ stories }, { status: 200 });
  } catch (error) {
    console.error("Error fetching stories:", error);
    return NextResponse.json(
      { message: "Failed to fetch stories" },
      { status: 500 }
    );
  }
}
