import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Story from "@/models/Story.model";


export async function GET(request) {
  try {
    
    await dbConnect();
    const stories = await Story.find({})
      .sort({ date: -1 })
      .limit(3)
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
