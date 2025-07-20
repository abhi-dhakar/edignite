import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/dbConnect";
import Event from "@/models/Event.model";
import { uploadToCloudinary , deleteFromCloudinary } from "@/lib/cloudinary";

// GET Fetch all events or a specific event
export async function GET(request) {
  try {
     const session = await getServerSession(authOptions);
     if (!session) {
       return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
     }

     if (session.user.memberType !== "Admin") {
       return NextResponse.json(
         { message: "Forbidden need admin" },
         { status: 403 }
       );
     }

    await dbConnect();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (id) {
      const event = await Event.findById(id) 
      if (!event) {
        return NextResponse.json(
          { message: "Event not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({ event }, { status: 200 });
    }

   
    const events = await Event.find()
      .populate("registeredUsers", "name email")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ events }, { status: 200 });
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json(
      { message: "Failed to fetch events" },
      { status: 500 }
    );
  }
}

// POST Create a new event
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (session.user.memberType !== "Admin") {
      return NextResponse.json({ message: "Forbidden need admin" }, { status: 403 });
    }

    const formData = await request.formData();
    const title = formData.get("title");
    const description = formData.get("description") || "";
    const date = formData.get("date");
    const location = formData.get("location") || "";
    const status = formData.get("status") || "Upcoming";
    const file = formData.get("image"); 

    if (!title || !date) {
      return NextResponse.json(
        { message: "Title and date are required." },
        { status: 400 }
      );
    }

    await dbConnect();

    let imageUrl = "";
    let imagePublicId = "";

    if (file && typeof file === "object") {
      const uploadResult = await uploadToCloudinary(file, "events");
      imageUrl = uploadResult?.url || "";
      imagePublicId = uploadResult?.publicId || "";
    }

    const newEvent = await Event.create({
      title,
      description,
      date: new Date(date),
      location,
      status,
      image: imageUrl,
      imagePublicId,
      registeredUsers: [],
    });

    return NextResponse.json(
      { message: "Event created successfully", event: newEvent },
      { status: 201 }
    );
  } catch (err) {
    console.error("Error creating event:", err);
    return NextResponse.json(
      { message: "Failed to create event", error: err.message },
      { status: 500 }
    );
  }
}

//PUT Update an event
export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.memberType !== "Admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    await dbConnect();

    const formData = await request.formData();

    const eventId = formData.get("eventId");
    const title = formData.get("title");
    const description = formData.get("description");
    const date = formData.get("date");
    const location = formData.get("location");
    const status = formData.get("status");
    const file = formData.get("image"); 

    if (!eventId || !title || !date) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return NextResponse.json({ message: "Event not found" }, { status: 404 });
    }

    let imageUrl = event.image;
    let imagePublicId = event.imagePublicId;

    if (file && typeof file === "object" && file.name) {

        if (imagePublicId) {
          await deleteFromCloudinary(imagePublicId);
        }

      const cloudinaryRes = await uploadToCloudinary(file, "ngo-events");
      imageUrl = cloudinaryRes.url;
      imagePublicId = cloudinaryRes.publicId
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      eventId,
      {
        title,
        description,
        location,
        date: new Date(date),
        status,
        image: imageUrl,
        imagePublicId: imagePublicId,
      },
      { new: true }
    );

    return NextResponse.json(
      { message: "Event updated", event: updatedEvent },
      { status: 200 }
    );
  } catch (error) {
    console.error("PUT /api/events error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

//DELETE  Remove an event
export async function DELETE(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.memberType !== "Admin") {
      return NextResponse.json(
        { message: "Unauthorized - Admin access required" },
        { status: 403 }
      );
    }

    await dbConnect();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { message: "Event ID is required" },
        { status: 400 }
      );
    }

      const event = await Event.findById(id);
      if (!event) {
        return NextResponse.json(
          { message: "Event not found" },
          { status: 404 }
        );
      }

      if (event.imagePublicId) {
        await deleteFromCloudinary(event.imagePublicId);
      }

    const deletedEvent = await Event.findByIdAndDelete(id);

    if (!deletedEvent) {
      return NextResponse.json({ message: "Event not found" }, { status: 404 });
    }

    return NextResponse.json(
      {
        message: "Event deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting event:", error);
    return NextResponse.json(
      { message: "Failed to delete event" },
      { status: 500 }
    );
  }
}