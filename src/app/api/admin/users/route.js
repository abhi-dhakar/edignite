import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User.model";
import bcryptjs from "bcryptjs";
import { uploadToCloudinary } from "@/lib/cloudinary";

// fetch all users
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.memberType !== "Admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    await dbConnect();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const memberType = searchParams.get("memberType");
    const search = searchParams.get("search");
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";

    // Build query
    const query = {};
    if (memberType) {
      query.memberType = memberType;
    }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (page - 1) * limit;

    const sort = {};
    sort[sortBy] = sortOrder === "asc" ? 1 : -1;

    const users = await User.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .select("-password")
      .lean();
    const total = await User.countDocuments(query);

    return NextResponse.json({
      users,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { message: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

// create a new user
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.memberType !== "Admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    await dbConnect();

    const formData = await request.formData();

    const name = formData.get("name");
    const email = formData.get("email");
    const password = formData.get("password");
    const phone = formData.get("phone") || "";
    const address = formData.get("address") || "";
    const memberType = formData.get("memberType") || "Volunteer";
    const profileImage = formData.get("image");

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "Name, email and password are required" },
        { status: 400 }
      );
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "Email already in use" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcryptjs.hash(password, 10);

    let imageUrl = "";
    let imagePublicId = "";

    if (profileImage && typeof profileImage === "object") {
      const uploadResult = await uploadToCloudinary(
        profileImage,
        "user-profiles"
      );
      imageUrl = uploadResult.url;
      imagePublicId = uploadResult.publicId;
    }

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      address,
      memberType,
      image: imageUrl,
      imagePublicId,
    });

    const userResponse = newUser.toObject();
    delete userResponse.password;

    return NextResponse.json(
      {
        message: "User created successfully",
        user: userResponse,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { message: "Failed to create user" },
      { status: 500 }
    );
  }
}
