import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import dbConnect from "@/lib/dbConnect";
import Volunteer from "@/models/Volunteer.model";
import { sendEmail } from "@/lib/email";

// POST Apply as Volunteer
export async function POST(req) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    await dbConnect();

    const { fullName, age, phone, address, skills, availability } =
      await req.json();

    if (!fullName || !phone || !address) {
      return NextResponse.json(
        {
             message: "All required fields must be provided"
             },
        { status: 400 }
      );
    }

    const existingApplication = await Volunteer.findOne({
      applicant: session.user.id,
    });

    if (existingApplication) {
      return NextResponse.json(
        {
             message: "You have already applied as a volunteer" 
            },
        { status: 400 }
      );
    }

    const newVolunteer = await Volunteer.create({
      applicant: session.user.id,
      fullName,
      age,
      phone,
      address,
      skills,
      availability,
      status: "Pending",
    });

    await sendEmail({
      to: session.user.email,
      subject: "Thank you for applying as Volunteer!",
      html: `<p>Dear ${fullName},<br/>Thank you for applying to volunteer with Edignite. We will review your application and get back to you shortly.</p>`,
    });

    await sendEmail({
      to: "admin@edignite.org", 
      subject: "New Volunteer Application Submitted",
      html: `<p>A new volunteer application has been received from ${fullName} (${session.user.email}).</p>`,
    });


    return NextResponse.json(
      {
         message: "Volunteer application submitted", volunteer: newVolunteer 
        },
      { status: 201 }
    );
  } catch (error) {
    console.error("Volunteer Apply Error:", error);
    return NextResponse.json({ 
        message: "Server Error"
     }, { status: 500 });
  }
}

// GET: Admin — View All Volunteer Applications
export async function GET(req) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.memberType !== "Admin") {
    return NextResponse.json(
        {
             message: "Unauthorized"
             }, { status: 401 });
  }

  try {
    await dbConnect();

    const volunteers = await Volunteer.find()
      .populate("applicant", "name email memberType")
      .sort({ createdAt: -1 });

    return NextResponse.json(
        { volunteers }, { status: 200 }
    );
  } catch (error) {
    console.error("Volunteer Fetch Error:", error);
    return NextResponse.json(
        {
             message: "Server Error" 
            }, { status: 500 });
  }
}

// PUT: Admin — Approve or Reject Volunteer Application
export async function PUT(req) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.memberType !== "Admin") {
    return NextResponse.json(
        { 
            message: "Unauthorized"
         }, { status: 401 });
  }

  try {
    await dbConnect();

    const { volunteerId, newStatus } = await req.json();

    if (!volunteerId || !newStatus) {
      return NextResponse.json(
        { message: "Volunteer ID and new status are required" },
        { status: 400 }
      );
    }

    const updatedVolunteer = await Volunteer.findByIdAndUpdate(
      volunteerId,
      { status: newStatus },
      { new: true }
    ).populate("applicant", "name email");

    if (!updatedVolunteer) {
      return NextResponse.json(
        { message: "Volunteer not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Volunteer status updated", volunteer: updatedVolunteer },
      { status: 200 }
    );
  } catch (error) {
    console.error("Volunteer Update Error:", error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}
