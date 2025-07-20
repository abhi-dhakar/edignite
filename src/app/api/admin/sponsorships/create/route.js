import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Sponsorship from "@/models/Sponsorship.model";
import User from "@/models/User.model";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.memberType !== "Admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    await dbConnect();

    const data = await request.json();

    if (!data.sponsor || !data.amount) {
      return NextResponse.json(
        { message: "Sponsor and amount are required" },
        { status: 400 }
      );
    }

    if (isNaN(data.amount) || data.amount <= 0) {
      return NextResponse.json(
        { message: "Amount must be a positive number" },
        { status: 400 }
      );
    }

    const sponsor = await User.findById(data.sponsor);
    if (!sponsor) {
      return NextResponse.json(
        { message: "Sponsor not found" },
        { status: 404 }
      );
    }

    const newSponsorship = await Sponsorship.create({
      sponsor: data.sponsor,
      childName: data.childName,
      projectName: data.projectName,
      amount: data.amount,
      frequency: data.frequency || "One-Time",
      startDate: data.startDate || new Date(),
      status: data.status || "Active",
    });

    await User.findByIdAndUpdate(data.sponsor, {
      $push: { sponsorships: newSponsorship._id },
      $set: { memberType: "Sponsor" },
    });

    await newSponsorship.populate("sponsor", "name email phone image");

    return NextResponse.json(newSponsorship, { status: 201 });
  } catch (error) {
    console.error("Error creating sponsorship:", error);
    return NextResponse.json(
      { message: "Failed to create sponsorship", error: error.message },
      { status: 500 }
    );
  }
}
