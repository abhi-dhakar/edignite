import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Volunteer from "@/models/Volunteer.model";
import User from "@/models/User.model";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { sendNotification } from "@/utils/admin/sendNotification";

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.memberType !== "Admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    await dbConnect();

    const volunteers = await Volunteer.find({})
      .populate("user", "name email phone address image")
      .sort({ createdAt: -1 });

    return NextResponse.json(volunteers);
  } catch (error) {
    console.error("Error fetching volunteers:", error);
    return NextResponse.json(
      { message: "Failed to fetch volunteers" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.memberType !== "Admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    await dbConnect();

    const data = await request.json();

    if (!data.user) {
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 400 }
      );
    }

    const userExists = await User.findById(data.user);
    if (!userExists) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const existingVolunteer = await Volunteer.findOne({ user: data.user });
    if (existingVolunteer) {
      return NextResponse.json(
        { message: "Volunteer profile already exists for this user" },
        { status: 409 }
      );
    }

    const newVolunteer = await Volunteer.create(data);

    await User.findByIdAndUpdate(data.user, {
      volunteerProfile: newVolunteer._id,
      memberType: "Volunteer",
    });

    await sendNotification({
      userId: userExists._id,
      title: "You're Now a Volunteer!",
      message: `Hi ${userExists.name}, your volunteer profile has been created by an admin. Welcome to Edignite! We’re excited to have you on board.`,
      type: "info",
      link: "/volunteer",
    });

    if (data.status === "Approved") {
      await sendNotification({
        userId: userExists._id,
        title: "Volunteer Application Approved!",
        message: `Congratulations ${userExists.name}! Your volunteer profile has been approved. You can now actively participate in our programs and make a difference.`,
        type: "success",
        link: "/volunteer",
      });
    }

    return NextResponse.json(newVolunteer, { status: 201 });
  } catch (error) {
    console.error("Error creating volunteer:", error);
    return NextResponse.json(
      { message: "Failed to create volunteer", error: error.message },
      { status: 500 }
    );
  }
}

export async function PATCH(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.memberType !== "Admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    await dbConnect();

    const data = await request.json();

    if (!data.id) {
      return NextResponse.json(
        { message: "Volunteer ID is required" },
        { status: 400 }
      );
    }

    // Update volunteer
    const updatedVolunteer = await Volunteer.findByIdAndUpdate(
      data.id,
      { $set: data },
      { new: true }
    );

    if (!updatedVolunteer) {
      return NextResponse.json(
        { message: "Volunteer not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedVolunteer);
  } catch (error) {
    console.error("Error updating volunteer:", error);
    return NextResponse.json(
      { message: "Failed to update volunteer", error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.memberType !== "Admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { message: "Volunteer ID is required" },
        { status: 400 }
      );
    }

    await dbConnect();

    const volunteer = await Volunteer.findById(id);

    if (!volunteer) {
      return NextResponse.json(
        { message: "Volunteer not found" },
        { status: 404 }
      );
    }

    await User.findByIdAndUpdate(volunteer.user, {
      $unset: { volunteerProfile: 1 },
      $set: {
        memberType:
          volunteer.user.memberType === "Volunteer"
            ? "Donor"
            : volunteer.user.memberType,
      },
    });

    await Volunteer.findByIdAndDelete(id);

    return NextResponse.json({ message: "Volunteer deleted successfully" });
  } catch (error) {
    console.error("Error deleting volunteer:", error);
    return NextResponse.json(
      { message: "Failed to delete volunteer", error: error.message },
      { status: 500 }
    );
  }
}
