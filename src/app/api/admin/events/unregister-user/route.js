import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/route";
import dbConnect from "@/lib/dbConnect";
import Event from "@/models/Event.model";
import User from "@/models/User.model";

export async function POST(req) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.memberType !== "Admin") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    await dbConnect();

    const { eventId, userId } = await req.json();

    if (!eventId || !userId) {
      return NextResponse.json(
        { message: "Event ID and User ID required" },
        { status: 400 }
      );
    }

    const event = await Event.findById(eventId);
    const user = await User.findById(userId);

    if (!event || !user) {
      return NextResponse.json(
        { message: "User or Event not found" },
        { status: 404 }
      );
    }

    event.registeredUsers = event.registeredUsers.filter(
      (id) => id.toString() !== userId
    );
    await event.save();

    user.eventRegistrations = user.eventRegistrations.filter(
      (id) => id.toString() !== eventId
    );
    await user.save();

    return NextResponse.json({
      message: "User successfully unregistered from event",
    });
  } catch (error) {
    console.error("Admin Unregister Error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
