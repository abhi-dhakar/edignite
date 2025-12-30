import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Blog from "@/models/Blog.model";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// GET Fetch all blogs (PUBLIC ACCESS)
export async function GET(request) {
    try {
        await dbConnect();

        const { searchParams } = new URL(request.url);
        const search = searchParams.get("search");
        const category = searchParams.get("category");

        const query = {};

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: "i" } },
                { excerpt: { $regex: search, $options: "i" } },
                { content: { $regex: search, $options: "i" } },
                { "author.name": { $regex: search, $options: "i" } },
            ];
        }

        if (category && category !== 'all') {
            query.category = category;
        }

        const blogs = await Blog.find(query)
            .sort({ date: -1 });

        return NextResponse.json({ blogs }, { status: 200 });
    } catch (error) {
        console.error("Error fetching blogs:", error);
        return NextResponse.json(
            { message: "Failed to fetch blogs" },
            { status: 500 }
        );
    }
}

// POST Create new blog (ADMIN ONLY)
export async function POST(request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.memberType !== 'Admin') {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        await dbConnect();
        const data = await request.json();

        const newBlog = await Blog.create({
            ...data,
            postedBy: session.user.id
        });

        return NextResponse.json({ blog: newBlog }, { status: 201 });
    } catch (error) {
        console.error("Error creating blog:", error);
        return NextResponse.json(
            { message: "Failed to create blog" },
            { status: 500 }
        );
    }
}

// PUT Update existing blog (ADMIN ONLY)
export async function PUT(request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.memberType !== 'Admin') {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        await dbConnect();
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");
        const data = await request.json();

        const updatedBlog = await Blog.findByIdAndUpdate(
            id,
            data,
            { new: true, runValidators: true }
        );

        if (!updatedBlog) {
            return NextResponse.json(
                { message: "Blog not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ blog: updatedBlog }, { status: 200 });
    } catch (error) {
        console.error("Error updating blog:", error);
        return NextResponse.json(
            { message: "Failed to update blog" },
            { status: 500 }
        );
    }
}

// DELETE Remove blog (ADMIN ONLY)
export async function DELETE(request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.memberType !== 'Admin') {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        await dbConnect();
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");

        const deletedBlog = await Blog.findByIdAndDelete(id);

        if (!deletedBlog) {
            return NextResponse.json(
                { message: "Blog not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ message: "Blog deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error deleting blog:", error);
        return NextResponse.json(
            { message: "Failed to delete blog" },
            { status: 500 }
        );
    }
}
