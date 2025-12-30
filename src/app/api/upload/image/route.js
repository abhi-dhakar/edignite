import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { writeFile } from "fs/promises";
import path from "path";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request) {
    try {
        const formData = await request.formData();
        const file = formData.get("file");

        if (!file) {
            return NextResponse.json(
                { error: "No file uploaded" },
                { status: 400 }
            );
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Create temp file
        const tempDir = path.join(process.cwd(), "public", "temp");
        const tempFilePath = path.join(tempDir, `${Date.now()}-${file.name}`);

        await writeFile(tempFilePath, buffer);

        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(tempFilePath, {
            folder: "blog-images",
            resource_type: "auto",
        });

        // Clean up temp file
        const fs = require("fs");
        fs.unlinkSync(tempFilePath);

        return NextResponse.json({
            url: result.secure_url,
            publicId: result.public_id,
        });
    } catch (error) {
        console.error("Image upload error:", error);
        return NextResponse.json(
            { error: "Failed to upload image" },
            { status: 500 }
        );
    }
}
