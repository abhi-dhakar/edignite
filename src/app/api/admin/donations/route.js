import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Donation from "@/models/Donation.model";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import mongoose from "mongoose";

async function isAdmin(req) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.memberType !== "Admin") {
    return false;
  }
  return true;
}

export async function GET() {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json(
        { message: "Unauthorized - Admin access required" },
        { status: 401 }
      );
    }

    await dbConnect();

    const donations = await Donation.find({})
      .populate("donor", "name email image")
      .sort({ createdAt: -1 });

    return NextResponse.json(donations);
  } catch (error) {
    console.error("Error fetching donations:", error);
    return NextResponse.json(
      { message: "Failed to fetch donations" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json(
        { message: "Unauthorized - Admin access required" },
        { status: 401 }
      );
    }

    await dbConnect();
    const data = await request.json();

    if (!data.donor || !data.amount) {
      return NextResponse.json(
        { message: "Donor and amount are required fields" },
        { status: 400 }
      );
    }

    const newDonation = await Donation.create(data);
    await mongoose.models.User.findByIdAndUpdate(data.donor, {
      $push: { donations: newDonation._id },
    });

    return NextResponse.json(newDonation, { status: 201 });
  } catch (error) {
    console.error("Error creating donation:", error);
    return NextResponse.json(
      { message: "Failed to create donation", error: error.message },
      { status: 500 }
    );
  }
}
