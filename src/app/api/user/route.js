import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User.model";

//GET USER PROFILE
export async function GET(req) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json(
      {
        message: "Unauthorized",
      },
      { status: 401 }
    );
  }

  try {
    await dbConnect();

    const user = await User.findById(session.user.id).select("-password");

    if (!user) {
      return NextResponse.json(
        {
          message: "User not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.error("User GET error:", error);
    return NextResponse.json(
      {
        message: "Server Error",
      },
      { status: 500 }
    );
  }
}

//UPDATE USER PROFILE
export async function PUT(req) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json(
      {
        message: "Unauthorized",
      },
      { status: 401 }
    );
  }

  try {
    await dbConnect();

    const body = await req.json();

    const allowedRoles = ["Donor", "Volunteer", "Sponsor", "Beneficiary"];

    if (!allowedRoles.includes(body.memberType)) {
      return NextResponse.json(
        { message: "Invalid member type" },
        { status: 400 }
      );
    }

    const updatedUser = await User.findByIdAndUpdate(
      session.user.id,
      {
        $set: {
          name: body.name,
          phone: body.phone,
          address: body.address,
          memberType: body.memberType,
        },
      },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return NextResponse.json(
        {
          message: "User not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        user: updatedUser,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("User update error :", error);
    return NextResponse.json(
      {
        message: "Server Error",
      },
      { status: 500 }
    );
  }
}
