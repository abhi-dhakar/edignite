import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Volunteer from "@/models/Volunteer.model";
import User from "@/models/User.model";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { sendNotification } from "@/utils/admin/sendNotification";

import { sendEmail } from "@/lib/resend";
import { VolunteerApprovedEmail } from "@/emails";
import { VolunteerRejectedEmail } from "@/emails";

export async function GET(request, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.memberType !== "Admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const { id } = params;

    await dbConnect();

    const volunteer = await Volunteer.findById(id).populate(
      "user",
      "name email phone address image"
    );

    if (!volunteer) {
      return NextResponse.json(
        { message: "Volunteer not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(volunteer);
  } catch (error) {
    console.error("Error fetching volunteer:", error);
    return NextResponse.json(
      { message: "Failed to fetch volunteer", error: error.message },
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

    const { id } = params;
    const data = await request.json();

    await dbConnect();

    if (
      data.status &&
      !["Pending", "Approved", "Rejected"].includes(data.status)
    ) {
      return NextResponse.json(
        { message: "Invalid status value" },
        { status: 400 }
      );
    }

    const updatedVolunteer = await Volunteer.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true }
    ).populate("user", "name email phone address image");

    if (!updatedVolunteer) {
      return NextResponse.json(
        { message: "Volunteer not found" },
        { status: 404 }
      );
    }

    if (updatedVolunteer.status === "Approved") {
      await sendNotification({
        userId: updatedVolunteer.user._id,
        title: "Volunteer Application Approved!",
        message: `Congratulations ${updatedVolunteer.user.name}! Your volunteer application has been approved. You can now participate in our activities and make a difference.`,
        type: "success",
        link: "/volunteer",
      });

      await sendEmail({
        to: updatedVolunteer.user.email,
        subject: "Volunteer Application Approved!",
        react: VolunteerApprovedEmail({ name: updatedVolunteer.user.name }),
      });
    }

    if (updatedVolunteer.status === "Rejected") {
      await sendNotification({
        userId: updatedVolunteer.user._id,
        title: "Volunteer Application Rejected",
        message: `Dear ${updatedVolunteer.user.name}, we appreciate your interest in joining Edignite. Unfortunately, your volunteer application was not approved at this time. Please feel free to apply again in the future or explore other ways to support our mission.`,
        type: "error",
        link: "/volunteer",
      });
      await sendEmail({
        to: updatedVolunteer.user.email,
        subject: "Volunteer Application rejected",
        react: VolunteerRejectedEmail({ name: updatedVolunteer.user.name }),
      });
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

export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.memberType !== "Admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const { id } = params;

    await dbConnect();

    const volunteer = await Volunteer.findById(id);

    if (!volunteer) {
      return NextResponse.json(
        { message: "Volunteer not found" },
        { status: 404 }
      );
    }

    if (volunteer.user) {
      const user = await User.findById(volunteer.user);

      if (user) {
        const updates = {
          $unset: { volunteerProfile: 1 },
        };

        if (user.memberType === "Volunteer") {
          updates.$set = { memberType: "Donor" };
        }

        await User.findByIdAndUpdate(volunteer.user, updates);
      }
    }

    const deletedVolunteer = await Volunteer.findByIdAndDelete(id).populate(
      "user",
      "name"
    );

    await sendNotification({
      userId: deletedVolunteer.user._id,
      title: "Volunteer Profile Removed",
      message: `Hello ${deletedVolunteer.user.name}, your volunteer profile has been removed from Edignite. If this was unexpected or you have questions, please contact our support team. We appreciate your time and interest.`,
      type: "warning",
      link: "/contact",
    });

    return NextResponse.json({ message: "Volunteer deleted successfully" });
  } catch (error) {
    console.error("Error deleting volunteer:", error);
    return NextResponse.json(
      { message: "Failed to delete volunteer", error: error.message },
      { status: 500 }
    );
  }
}
