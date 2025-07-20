import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Story from "@/models/Story.model";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { deleteFromCloudinary } from "@/lib/cloudinary";

export async function GET(request, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.memberType !== "Admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const { id } = params;

    await dbConnect();

    const story = await Story.findById(id).populate("postedBy", "name email");

    if (!story) {
      return NextResponse.json({ message: "Story not found" }, { status: 404 });
    }

    return NextResponse.json(story);
  } catch (error) {
    console.error("Error fetching story:", error);
    return NextResponse.json(
      { message: "Failed to fetch story", error: error.message },
      { status: 500 }
    );
  }
}

export async function PATCH(request, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.memberType !== "Admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const { id } = params;
    const data = await request.json();

    await dbConnect();

    const existingStory = await Story.findById(id);

    if (!existingStory) {
      return NextResponse.json({ message: "Story not found" }, { status: 404 });
    }

    if (
      data.image &&
      data.imagePublicId &&
      existingStory.imagePublicId &&
      data.imagePublicId !== existingStory.imagePublicId
    ) {
      try {
        const { deleteFromCloudinary } = await import("@/lib/cloudinary");
        await deleteFromCloudinary(existingStory.imagePublicId);
      } catch (cloudinaryError) {
        console.error(
          "Error deleting old image from Cloudinary:",
          cloudinaryError
        );
      }
    }

    const updatedStory = await Story.findByIdAndUpdate(
      id,
      {
        title: data.title,
        content: data.content,
        authorName: data.authorName,
        image: data.image,
        imagePublicId: data.imagePublicId,
        postedBy: session.user.id,
      },
      { new: true }
    ).populate("postedBy", "name email");

    if (!updatedStory) {
      return NextResponse.json({ message: "Story not found" }, { status: 404 });
    }

    return NextResponse.json(updatedStory);
  } catch (error) {
    console.error("Error updating story:", error);
    return NextResponse.json(
      { message: "Failed to update story", error: error.message },
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

    const id = params?.id;

    await dbConnect();

    const story = await Story.findById(id);

    if (!story) {
      return NextResponse.json({ message: "Story not found" }, { status: 404 });
    }

    if (story.imagePublicId) {
      try {
        await deleteFromCloudinary(story.imagePublicId);
      } catch (cloudinaryError) {
        console.error("Error deleting image from Cloudinary:", cloudinaryError);
      }
    }

    await Story.findByIdAndDelete(id);

    return NextResponse.json({ message: "Story deleted successfully" });
  } catch (error) {
    console.error("Error deleting story:", error);
    return NextResponse.json(
      { message: "Failed to delete story", error: error.message },
      { status: 500 }
    );
  }
}
