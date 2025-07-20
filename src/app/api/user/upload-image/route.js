import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User.model";
import { uploadToCloudinary } from "@/lib/cloudinary";

export async function POST(request) {
  try {
   
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    await dbConnect();

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

  
    const formData = await request.formData();
    const imageFile = formData.get("image");

    if (!imageFile) {
      return NextResponse.json(
        { message: "No image provided" },
        { status: 400 }
      );
    }

    if (user.imagePublicId) {
      try {
        const { deleteFromCloudinary } = await import("@/lib/cloudinary");
        await deleteFromCloudinary(user.imagePublicId);
      } catch (error) {
        console.error("Failed to delete previous image:", error);
       
      }
    }

    const imageData = await uploadToCloudinary(imageFile);
    if (!imageData) {
      return NextResponse.json(
        { message: "Failed to upload image" },
        { status: 500 }
      );
    }

    user.image = imageData.url;
    user.imagePublicId = imageData.publicId;
    await user.save();

    return NextResponse.json({
      message: "Image uploaded successfully",
      imageUrl: imageData.url,
    });
  } catch (error) {
    console.error("Image upload error:", error);
    return NextResponse.json(
      { message: "Failed to process image upload" },
      { status: 500 }
    );
  }
}
