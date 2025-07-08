import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import dbConnect from "@/lib/dbConnect";
import Event from "@/models/Event.model";

// GET: Public — List All Events
export async function GET(req) {
  try {
    await dbConnect();

    const events = await Event.find().sort({ date: 1 });

    return NextResponse.json({ events }, { status: 200 });
  } catch (error) {
    console.error("Get Events Error:", error);
    return NextResponse.json(
      {
        message: "Server Error",
      },
      { status: 500 }
    );
  }
}

// POST: Admin — Create New Event
export async function POST(req) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.memberType !== "Admin") {
    return NextResponse.json(
      {
        message: "Unauthorized",
      },
      { status: 401 }
    );
  }

  try {
    await dbConnect();

    const { title, description, date, location, image } = await req.json();

    if (!title || !date) {
      return NextResponse.json(
        {
          message: "Title and Date are required",
        },
        { status: 400 }
      );
    }

    const newEvent = await Event.create({
      title,
      description,
      date,
      location,
      image,
      participants: [],
    });

    return NextResponse.json(
      { message: "Event created", event: newEvent },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create Event Error:", error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}

// PUT: Register for Event (User)
export async function PUT(req) {
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

    const event = await Event.findById(eventId);

    if (!event) {
      return NextResponse.json({ message: "Event not found" }, { status: 404 });
    }

    // Check if user already registered
    if (event.participants.includes(session.user.id)) {
      return NextResponse.json(
        { message: "Already registered for this event" },
        { status: 400 }
      );
    }

    event.participants.push(session.user.id);
    await event.save();

    return NextResponse.json(
      { message: "Successfully registered", event },
      { status: 200 }
    );
  } catch (error) {
    console.error("Register Event Error:", error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}
