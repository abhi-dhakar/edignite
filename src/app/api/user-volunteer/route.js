import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Volunteer from "@/models/Volunteer.model";

export async function GET(req) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("id");

    if (!userId) {
      return NextResponse.json({ message: "User ID missing" }, { status: 400 });
    }

    const volunteer = await Volunteer.findOne({ user: userId });

    if (!volunteer) {
      return NextResponse.json({ status: "Not Applied" }, { status: 200 });
    }

    return NextResponse.json({ status: volunteer.status }, { status: 200 });
  } catch (error) {
    console.error("Volunteer Status Fetch Error:", error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}
