import { NextResponse } from "next/server";
import mongoose from "mongoose";
import dbConnect from "@/lib/dbConnect";
import Donation from "@/models/Donation.model";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

async function isAdmin() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.memberType !== "Admin") {
    return false;
  }
  return true;
}

// GET a specific donation
export async function GET(request, { params }) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json(
        { message: "Unauthorized - Admin access required" },
        { status: 401 }
      );
    }

    await dbConnect();
    const { id } = params;

    const donation = await Donation.findById(id).populate(
      "donor",
      "name email image"
    );

    if (!donation) {
      return NextResponse.json(
        { message: "Donation not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(donation);
  } catch (error) {
    console.error("Error fetching donation:", error);
    return NextResponse.json(
      { message: "Failed to fetch donation" },
      { status: 500 }
    );
  }
}

//update a donation
export async function PATCH(request, { params }) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json(
        { message: "Unauthorized - Admin access required" },
        { status: 401 }
      );
    }

    await dbConnect();
    const { id } = params;
    const data = await request.json();

    const allowedUpdates = [
      "paymentStatus",
      "amount",
      "transactionId",
      "receiptUrl",
    ];
    const updates = {};

    Object.keys(data).forEach((key) => {
      if (allowedUpdates.includes(key) && data[key] !== undefined) {
        updates[key] = data[key];
      }
    });

    const updatedDonation = await Donation.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    }).populate("donor", "name email image");

    if (!updatedDonation) {
      return NextResponse.json(
        { message: "Donation not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedDonation);
  } catch (error) {
    console.error("Error updating donation:", error);
    return NextResponse.json(
      { message: "Failed to update donation", error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json(
        { message: "Unauthorized - Admin access required" },
        { status: 401 }
      );
    }

    await dbConnect();
    const { id } = params;

    const donation = await Donation.findById(id);

    if (!donation) {
      return NextResponse.json(
        { message: "Donation not found" },
        { status: 404 }
      );
    }

    await mongoose.models.User.findByIdAndUpdate(donation.donor, {
      $pull: { donations: id },
    });

    await Donation.findByIdAndDelete(id);

    return NextResponse.json(
      { message: "Donation deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting donation:", error);
    return NextResponse.json(
      { message: "Failed to delete donation", error: error.message },
      { status: 500 }
    );
  }
}
