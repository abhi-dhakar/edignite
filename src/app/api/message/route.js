import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import dbConnect from "@/lib/dbConnect";
import Message from "@/models/Message.model";
import { sendEmail } from "@/lib/email";


//POST: Submit a Contact Message / Suggestion (Public)
export async function POST(req) {
  try {
    await dbConnect();

    const { name, email, phone, message, category } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { message: "Name, Email, and Message are required" },
        { status: 400 }
      );
    }

    const newMessage = await Message.create({
      name,
      email,
      phone,
      message,
      category: category || "General",
    });

    await sendEmail({
      to: "admin@edignite.org",
      subject: "New Message Received on Edignite",
      html: `
        <p><strong>From:</strong> ${name} (${email})</p>
        <p><strong>Phone:</strong> ${phone || "Not Provided"}</p>
        <p><strong>Category:</strong> ${category || "General"}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    });

    return NextResponse.json(
      { message: "Thank you for reaching out!", data: newMessage },
      { status: 201 }
    );
  } catch (error) {
    console.error("Message Submission Error:", error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}

//GET: Admin — View All Messages
export async function GET(req) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.memberType !== "Admin") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    await dbConnect();

    const messages = await Message.find().sort({ createdAt: -1 });

    return NextResponse.json({ messages }, { status: 200 });
  } catch (error) {
    console.error("Fetch Messages Error:", error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}
