import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Notification from "@/models/Notification.model";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(req) {
  try {
    await dbConnect();

    const session = await getServerSession(authOptions);
    if (!session || session.user.memberType !== "Admin") {
      return NextResponse.json(
        { message: "Unauthorized access" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);

    const userId = searchParams.get("userId");
    const type = searchParams.get("type");
    const isRead = searchParams.get("isRead");
    const search = searchParams.get("search");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    const query = {};
    if (userId && userId !== "all") query.user = userId;
    if (type && type !== "all") query.type = type;
    if (isRead && isRead !== "all") query.isRead = isRead === "true";

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { message: { $regex: search, $options: "i" } },
      ];
    }

    // Execute query with pagination
    const totalCount = await Notification.countDocuments(query);
    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("user", "name email");

    return NextResponse.json(
      {
        notifications,
        pagination: {
          total: totalCount,
          page,
          limit,
          pages: Math.ceil(totalCount / limit),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Admin Get Notifications Error:", error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await dbConnect();

    const session = await getServerSession(authOptions);
    if (!session || session.user.memberType !== "Admin") {
      return NextResponse.json(
        { message: "Unauthorized access" },
        { status: 403 }
      );
    }

    const body = await req.json();

    // Handle bulk creation or single
    if (body.bulk) {
      const { userIds, title, message, type = "info", link = null } = body;

      if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
        return NextResponse.json(
          { message: "User IDs required" },
          { status: 400 }
        );
      }

      const notifications = userIds.map((userId) => ({
        user: userId,
        title,
        message,
        type,
        link,
        isRead: false,
      }));

      await Notification.insertMany(notifications);
      return NextResponse.json(
        { message: `${userIds.length} notifications created` },
        { status: 201 }
      );
    } else {
      const { userId, title, message, type = "info", link = null } = body;

      if (!userId) {
        return NextResponse.json(
          { message: "User ID required" },
          { status: 400 }
        );
      }

      const notification = new Notification({
        user: userId,
        title,
        message,
        type,
        link,
        isRead: false,
      });

      await notification.save();
      return NextResponse.json({ notification }, { status: 201 });
    }
  } catch (error) {
    console.error("Admin Create Notification Error:", error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}
