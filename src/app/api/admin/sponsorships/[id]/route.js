import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Sponsorship from "@/models/Sponsorship.model";
import User from "@/models/User.model";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(request, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.memberType !== "Admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const id = params?.id;

    await dbConnect();

    const sponsorship = await Sponsorship.findById(id).populate(
      "sponsor",
      "name email phone image"
    );

    if (!sponsorship) {
      return NextResponse.json(
        { message: "Sponsorship not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(sponsorship);
  } catch (error) {
    console.error("Error fetching sponsorship:", error);
    return NextResponse.json(
      { message: "Failed to fetch sponsorship", error: error.message },
      { status: 500 }
    );
  }
}

export async function PATCH(request, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.memberType !== "Admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const id = params?.id;

    const data = await request.json();

    await dbConnect();

    const existingSponsorship = await Sponsorship.findById(id);

    if (!existingSponsorship) {
      return NextResponse.json(
        { message: "Sponsorship not found" },
        { status: 404 }
      );
    }

    if (data.amount !== undefined) {
      if (isNaN(data.amount) || data.amount <= 0) {
        return NextResponse.json(
          { message: "Amount must be a positive number" },
          { status: 400 }
        );
      }
    }

    if (
      data.frequency &&
      !["One-Time", "Monthly", "Yearly"].includes(data.frequency)
    ) {
      return NextResponse.json(
        { message: "Frequency must be One-Time, Monthly, or Yearly" },
        { status: 400 }
      );
    }

    if (
      data.status &&
      !["Active", "Completed", "Cancelled"].includes(data.status)
    ) {
      return NextResponse.json(
        { message: "Status must be Active, Completed, or Cancelled" },
        { status: 400 }
      );
    }

    const updatedSponsorship = await Sponsorship.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true }
    ).populate("sponsor", "name email phone image");

    if (
      data.status &&
      (data.status === "Cancelled" || data.status === "Completed")
    ) {
      // we want to update the user's sponsorships array
      // or handle this differently based on our application's requirements
    }

    return NextResponse.json(updatedSponsorship);
  } catch (error) {
    console.error("Error updating sponsorship:", error);
    return NextResponse.json(
      { message: "Failed to update sponsorship", error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.memberType !== "Admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const id = params?.id;

    await dbConnect();

    const sponsorship = await Sponsorship.findById(id);

    if (!sponsorship) {
      return NextResponse.json(
        { message: "Sponsorship not found" },
        { status: 404 }
      );
    }

    if (sponsorship.sponsor) {
      await User.findByIdAndUpdate(sponsorship.sponsor, {
        $pull: { sponsorships: id },
      });
    }

    await Sponsorship.findByIdAndDelete(id);

    return NextResponse.json({ message: "Sponsorship deleted successfully" });
  } catch (error) {
    console.error("Error deleting sponsorship:", error);
    return NextResponse.json(
      { message: "Failed to delete sponsorship", error: error.message },
      { status: 500 }
    );
  }
}
