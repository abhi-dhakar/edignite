import "@/models/Donation.model";
import "@/models/Sponsorship.model";
import "@/models/Event.model";
import "@/models/Volunteer.model";

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User.model";
import { deleteFromCloudinary, uploadToCloudinary } from "@/lib/cloudinary";

export async function GET(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.memberType !== "Admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const { id } = await params;
    if (!id) {
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 400 }
      );
    }

    await dbConnect();

    const user = await User.findById(id)
      .select("-password")
      .populate("donations")
      .populate("sponsorships")
      .populate("volunteerProfile")
      .populate("eventRegistrations", "title date location");

    // console.log(user);

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { message: "Failed to fetch user details" },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.memberType !== "Admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const { id } = params;
    if (!id) {
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 400 }
      );
    }

    await dbConnect();

    const user = await User.findById(id);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const formData = await request.formData();

    const name = formData.get("name");
    const email = formData.get("email");
    const phone = formData.get("phone");
    const address = formData.get("address");
    const memberType = formData.get("memberType");
    const profileImage = formData.get("image");

    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return NextResponse.json(
          { message: "Email already in use" },
          { status: 400 }
        );
      }
    }

    let imageUrl = user.image;
    let imagePublicId = user.imagePublicId;

    if (profileImage && typeof profileImage === "object") {
      if (user.imagePublicId) {
        await deleteFromCloudinary(user.imagePublicId);
      }

      const uploadResult = await uploadToCloudinary(
        profileImage,
        "user-profiles"
      );
      imageUrl = uploadResult.url;
      imagePublicId = uploadResult.publicId;
    }

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        name: name || user.name,
        email: email || user.email,
        phone: phone || user.phone,
        address: address || user.address,
        memberType: memberType || user.memberType,
        image: imageUrl,
        imagePublicId: imagePublicId,
      },
      { new: true }
    ).select("-password");

    return NextResponse.json({
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { message: "Failed to update user" },
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
    if (!id) {
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 400 }
      );
    }

    await dbConnect();
    const user = await User.findById(id);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    if (user.imagePublicId) {
      await deleteFromCloudinary(user.imagePublicId);
    }

    await User.findByIdAndDelete(id);

    return NextResponse.json({
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { message: "Failed to delete user" },
      { status: 500 }
    );
  }
}
