import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Media from "@/models/Media.model";

//GET Fetch all media
export async function GET(request) {

  try {
    await dbConnect();

    // Get query parameters for filtering
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");

    // Build query
    const query = {};
    if (type && ["Photo", "Video"].includes(type)) {
      query.type = type;
    }

    // Fetch media items, newest first
    const media = await Media.find(query).sort({ createdAt: -1 });

    return NextResponse.json({ media }, { status: 200 });

  } catch (error) {
    console.error("Error fetching media:", error);

    return NextResponse.json(
      { message: "Failed to fetch media" },
      { status: 500 }
    );
    
  }
}
