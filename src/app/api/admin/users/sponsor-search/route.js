import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User.model";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.memberType !== "Admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    await dbConnect();

    const url = new URL(request.url);
    const searchQuery = url.searchParams.get("q");

    if (!searchQuery) {
      return NextResponse.json(
        { message: "Search query is required" },
        { status: 400 }
      );
    }

    const users = await User.find({
      $or: [
        { name: { $regex: searchQuery, $options: "i" } },
        { email: { $regex: searchQuery, $options: "i" } },
      ],
    })
      .select("_id name email image phone")
      .limit(10);

    return NextResponse.json(users);
  } catch (error) {
    console.error("Error searching users:", error);
    return NextResponse.json(
      { message: "Failed to search users", error: error.message },
      { status: 500 }
    );
  }
}
