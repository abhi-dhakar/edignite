import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { unlink } from "fs/promises";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("image");
    const previousFilePath = formData.get("previousFilePath");

    if (!file) {
      return NextResponse.json(
        { success: false, message: "No image provided" },
        { status: 400 }
      );
    }

    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { success: false, message: "Image is too large (maximum 5MB)" },
        { status: 400 }
      );
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        {
          success: false,
          message: "Only JPG, PNG, GIF and WebP images are allowed",
        },
        { status: 400 }
      );
    }

    const fileExtension = path.extname(file.name);
    const uniqueFilename = `${uuidv4()}${fileExtension}`;

    const tempDir = path.join(process.cwd(), "public", "temp");
    await mkdir(tempDir, { recursive: true });

    const filePath = path.join(tempDir, uniqueFilename);

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    await writeFile(filePath, buffer);

    if (previousFilePath) {
      try {
        const fullPreviousPath = path.join(
          process.cwd(),
          "public",
          previousFilePath.replace(/^\//, "")
        );
        await unlink(fullPreviousPath);
        console.log(`Deleted previous temp file: ${previousFilePath}`);
      } catch (err) {
        console.error("Failed to delete previous temp file:", err);
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: "Image uploaded to temporary storage",
        tempFile: {
          name: uniqueFilename,
          path: `/temp/${uniqueFilename}`,
          size: file.size,
          type: file.type,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Temp Upload Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to upload image" },
      { status: 500 }
    );
  }
}

export const config = {
  api: {
    bodyParser: false,
    responseLimit: false,
  },
};
