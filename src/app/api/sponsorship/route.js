import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import dbConnect from "@/lib/dbConnect";
import Sponsorship from "@/models/Sponsorship.model";
import { sendEmail } from "@/lib/email";


// POST Create Sponsorship (Sponsor a Child/Project)
export async function POST(req) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    await dbConnect();

    const { childName, projectName, amount, startDate, endDate, status } =
      await req.json();

    if (!amount || (!childName && !projectName)) {
      return NextResponse.json(
        { message: "Please provide required sponsorship details" },
        { status: 400 }
      );
    }

    const sponsorship = await Sponsorship.create({
      sponsor: session.user.id,
      childName,
      projectName,
      amount,
      startDate: startDate || new Date(),
      endDate,
      status: status || "Active",
    });


    await sendEmail({
      to: session.user.email,
      subject: "Sponsorship Confirmation",
      html: `
        <p>Dear ${session.user.name || "Sponsor"},</p>
        <p>Thank you for sponsoring ${
          childName
            ? `child: <strong>${childName}</strong>`
            : `project: <strong>${projectName}</strong>`
        } with a contribution of ₹${amount}.</p>
        <p>Your sponsorship helps transform lives by providing opportunities to those in need.</p>
        <p>We will keep you updated on the progress.</p>
        <p>With gratitude,<br/>Edignite Team</p>
      `,
    });

    return NextResponse.json(
      { message: "Sponsorship created successfully", sponsorship },
      { status: 201 }
    );
  } catch (error) {
    console.error("Sponsorship Error:", error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}

// GET Fetch My Sponsorships
export async function GET(req) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    await dbConnect();

    const sponsorships = await Sponsorship.find({
      sponsor: session.user.id,
    }).sort({ createdAt: -1 });

    return NextResponse.json({ sponsorships }, { status: 200 });
  } catch (error) {
    console.error("Fetch Sponsorships Error:", error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}
