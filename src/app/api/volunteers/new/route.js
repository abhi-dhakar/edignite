import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Volunteer from "@/models/Volunteer.model";

export async function GET() {
  try {
    await dbConnect();

    const volunteers = await Volunteer.find({ status: "Approved" })
      .sort({ createdAt: -1 })
      .limit(4)
      .populate("user", "name image");

   
    const data = volunteers.map((v) => ({
      _id: v._id,
      name: v.user?.name || "Anonymous",
      image: v.user?.image || null,
      joinedAt: v.createdAt,
      skills: v.skills,
      availability: v.availability,
      preferredLocation: v.preferredLocation,
    }));

    return NextResponse.json({ volunteers: data }, { status: 200 });
  } catch (error) {
    console.error("Fetch Volunteers Error:", error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}
