import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/dbConnect";
import Media from "@/models/Media.model";
import User from "@/models/User.model";
import { uploadToCloudinary, deleteFromCloudinary } from "@/lib/cloudinary";

// Fetch all media
export async function GET(request) {
  try {
    
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (session.user.memberType !== "Admin") {
      return NextResponse.json(
        { message: "Only administrators can upload media" },
        { status: 403 }
      );
    }
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");

   
    const query = {};
    if (type && ["Photo", "Video"].includes(type)) {
      query.type = type;
    }

    const media = await Media.find(query)
      .sort({ createdAt: -1 })
      .populate("uploadedBy", "name");

    return NextResponse.json({ media }, { status: 200 });
  } catch (error) {
    console.error("Error fetching media:", error);
    return NextResponse.json(
      { message: "Failed to fetch media" },
      { status: 500 }
    );
  }
}

//Upload new media
export async function POST(request) {
  try {
   
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (session.user.memberType !== "Admin") {
      return NextResponse.json(
        { message: "Only administrators can upload media" },
        { status: 403 }
      );
    }

    await dbConnect();

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Parse form data
    const formData = await request.formData();
    const file = formData.get("file");
    const type = formData.get("type");
    const caption = formData.get("caption") || "";


    if (!file || !type || !["Photo", "Video"].includes(type)) {
      return NextResponse.json(
        { message: "Invalid file or media type" },
        { status: 400 }
      );
    }

    const folder = type === "Photo" ? "photos" : "videos";

    const result = await uploadToCloudinary(file, folder);
    if (!result) {
      return NextResponse.json(
        { message: "Failed to upload media to Cloudinary" },
        { status: 500 }
      );
    }

    const media = await Media.create({
      type,
      url: result.url,
      caption,
      uploadedBy: user._id,
    });

    await media.populate("uploadedBy", "name");

    return NextResponse.json(
      {
        message: "Media uploaded successfully",
        media,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error uploading media:", error);
    return NextResponse.json(
      { message: error.message || "Failed to upload media" },
      { status: 500 }
    );
  }
}

//DELETE Remove media
export async function DELETE(request) {
  try {
    
    const session = await getServerSession(authOptions);

    if (!session || session.user.memberType !== "Admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { message: "Media ID is required" },
        { status: 400 }
      );
    }

    const media = await Media.findById(id);
    if (!media) {
      return NextResponse.json({ message: "Media not found" }, { status: 404 });
    }

    const urlParts = media.url.split("/");
    const folderAndPublicId = urlParts.slice(-2).join("/"); // Get "folder/filename.ext"
    const publicId = folderAndPublicId.split(".")[0]; // Remove extension

    const resourceType = media.type === "Video" ? "video" : "image";
   
    await deleteFromCloudinary(publicId ,resourceType);

    await Media.findByIdAndDelete(id);

    return NextResponse.json(
      {
        message: "Media deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting media:", error);
    return NextResponse.json(
      { message: error.message || "Failed to delete media" },
      { status: 500 }
    );
  }
}
