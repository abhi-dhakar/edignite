import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User.model";
import { v2 as cloudinary } from "cloudinary"; // Import directly here
import { deleteFromCloudinary } from "@/lib/cloudinary"; // We can still use this function
import fs from "fs/promises";
import path from "path";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  timeout: 60000,
});

export async function POST(req) {
  try {
    await dbConnect();

    const body = await req.json();
    const { userId, tempFilePath, folder = "user-profiles" } = body;

    if (!userId || !tempFilePath) {
      return NextResponse.json(
        { success: false, message: "User ID and temp file path are required" },
        { status: 400 }
      );
    }

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    const fullPath = path.join(
      process.cwd(),
      "public",
      tempFilePath.replace(/^\//, "")
    );

    try {
      await fs.access(fullPath);

      if (user.imagePublicId) {
        try {
          await deleteFromCloudinary(user.imagePublicId);
        } catch (deleteError) {
          console.error("Error deleting old image:", deleteError);
        }
      }

      try {
        const result = await cloudinary.uploader.upload(fullPath, {
          folder: folder,
          resource_type: "auto",
          timeout: 60000,
          transformation: [{ width: 500, height: 500, crop: "limit" }],
        });

        await User.findByIdAndUpdate(userId, {
          image: result.secure_url,
          imagePublicId: result.public_id,
        });

        await fs.unlink(fullPath).catch((err) => {
          console.error("Failed to delete temp file:", err);
        });

        return NextResponse.json(
          {
            success: true,
            message: "Profile image uploaded successfully",
            imageUrl: result.secure_url,
          },
          { status: 200 }
        );
      } catch (cloudinaryError) {
        console.error("Cloudinary upload failed:", cloudinaryError);

        await User.findByIdAndUpdate(
          userId,
          { image: "", imagePublicId: "" },
          { upsert: true }
        );

        await fs.unlink(fullPath).catch((err) => {
          console.error("Failed to delete temp file:", err);
        });

        return NextResponse.json(
          {
            success: false,
            message: "Profile image couldn't be uploaded to Cloudinary",
          },
          { status: 500 }
        );
      }
    } catch (error) {
      console.error("File access error:", error);

      await User.findByIdAndUpdate(
        userId,
        { image: "", imagePublicId: "" },
        { upsert: true }
      );

      if (error.code === "ENOENT") {
        return NextResponse.json(
          { success: false, message: "Temporary file not found" },
          { status: 404 }
        );
      }
      throw error;
    }
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to upload image to Cloudinary" },
      { status: 500 }
    );
  }
}
