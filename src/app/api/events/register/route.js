import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import dbConnect from "@/lib/dbConnect";
import Event from "@/models/Event.model";
import User from "@/models/User.model";
import { sendNotification } from "@/utils/admin/sendNotification";

export async function POST(req) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    await dbConnect();

    const { eventId } = await req.json();

    if (!eventId) {
      return NextResponse.json(
        { message: "Event ID required" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return NextResponse.json({ message: "Event not found" }, { status: 404 });
    }

    if (event.status !== "Upcoming") {
      return NextResponse.json(
        { message: "Registration is closed for this event" },
        { status: 400 }
      );
    }

    const alreadyRegistered = event.registeredUsers.some((id) =>
      id.equals(user._id)
    );

    if (alreadyRegistered) {
      return NextResponse.json(
        { message: "Already registered for this event" },
        { status: 400 }
      );
    }

    event.registeredUsers.push(user._id);
    await event.save();

    user.eventRegistrations.push(event._id);
    await user.save(); 

    await sendNotification({
      userId: user._id,
      title: "Event Registration Confirmed!",
      message: `Hi ${user.name}, your registration for the event "${event.title}" has been successfully received. We look forward to your participation!`,
      type: "success",
      link: "/events", 
    });


    return NextResponse.json(
      {
        message: "Successfully registered",
        event: {
          id: event._id,
          title: event.title,
          registeredCount: event.registeredUsers.length,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Register Event Error:", error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}
