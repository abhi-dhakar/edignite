import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Notification from "@/models/Notification.model";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function PUT(req, { params }) {
  try {
    await dbConnect();

    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const notification = await Notification.findOneAndUpdate(
      { _id: params.id, user: session.user.id },
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return NextResponse.json(
        { message: "Notification not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ notification }, { status: 200 });
  } catch (error) {
    console.error("Mark Read Error:", error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}
