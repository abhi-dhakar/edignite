import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import dbConnect from "@/lib/dbConnect";
import Message from "@/models/Message.model";
import User from "@/models/User.model";

export async function POST(request) {
  try {
    await dbConnect();

    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        {
          message: "Unauthorized",
        },
        { status: 401 }
      );
    }

    const body = await request.json();

    if (!body.name || !body.email || !body.message) {
      return NextResponse.json(
        { message: "Name, email and message are required" },
        { status: 400 }
      );
    }

    if (
      body.type &&
      !["Contact", "Suggestion", "Feedback"].includes(body.type)
    ) {
      return NextResponse.json(
        { message: "Invalid message type" },
        { status: 400 }
      );
    }

    const messageData = {
      name: body.name,
      email: body.email,
      message: body.message,
      type: body.type || "Contact",
    };

    if (session?.user) {
      const user = await User.findOne({ email: session.user.email });
      if (user) {
        messageData.submittedBy = user._id;
      }
    }

    const message = await Message.create(messageData);

    return NextResponse.json(
      { message: "Message sent successfully", id: message._id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error sending message:", error);
    return NextResponse.json(
      { message: "Failed to send message" },
      { status: 500 }
    );
  }
}
