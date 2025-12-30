
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/dbConnect";
import Volunteer from "@/models/Volunteer.model";
import User from "@/models/User.model";
import { NextResponse } from "next/server";
import { sendNotification } from "@/utils/admin/sendNotification";

// Fetch volunteer profile
export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    await dbConnect();

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    const volunteer = await Volunteer.findOne({ user: user._id });

    return NextResponse.json({ volunteer }, { status: 200 });
  } catch (error) {
    console.error("Error fetching volunteer profile:", error);
    return NextResponse.json(
      { message: "Failed to fetch volunteer profile" },
      { status: 500 }
    );
  }
}

// POST Create new volunteer profile
export async function POST(request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    await dbConnect();

    const body = await request.json();

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const existingVolunteer = await Volunteer.findOne({ user: user._id });
    if (existingVolunteer) {
      return NextResponse.json(
        { message: "Volunteer profile already exists" },
        { status: 400 }
      );
    }

    const volunteer = await Volunteer.create({
      user: user._id,
      fullName: body.fullName,
      emailAddress: body.emailAddress,
      mobileNumber: body.mobileNumber,
      enrollmentNumber: body.enrollmentNumber,
      branch: body.branch,
      division: body.division,
      year: body.year,
      skills: body.skills || [],
      availability: body.availability || "",
      experience: body.experience || "",
      preferredLocation: body.preferredLocation || "",
      status: "Pending",
    });

    user.volunteerProfile = volunteer._id;
    await user.save();

    await sendNotification({
      userId: user._id,
      title: "Volunteer Application Submitted",
      message: `Thank you ${user.name} for applying as a volunteer. Your application is now under review.`,
      type: "info",
      link: "/volunteer",
    });

    return NextResponse.json(
      { message: "Volunteer profile created", volunteer },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating volunteer profile:", error);
    return NextResponse.json(
      { message: "Failed to create volunteer profile" },
      { status: 500 }
    );
  }
}

// PUT Update existing volunteer profile
export async function PUT(request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    await dbConnect();

    const body = await request.json();
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const volunteer = await Volunteer.findOneAndUpdate(
      { user: user._id },
      {
        fullName: body.fullName,
        emailAddress: body.emailAddress,
        mobileNumber: body.mobileNumber,
        enrollmentNumber: body.enrollmentNumber,
        branch: body.branch,
        division: body.division,
        year: body.year,
        skills: body.skills,
        availability: body.availability,
        experience: body.experience,
        preferredLocation: body.preferredLocation,
      },
      { new: true, runValidators: true }
    );

    if (!volunteer) {
      return NextResponse.json(
        { message: "Volunteer profile not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Volunteer profile updated", volunteer },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating volunteer profile:", error);
    return NextResponse.json(
      { message: "Failed to update volunteer profile" },
      { status: 500 }
    );
  }
}
