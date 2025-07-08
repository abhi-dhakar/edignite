import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import dbConnect from "@/lib/dbConnect";
import Donation from "@/models/Donation.model";
import User from "@/models/User.model";
import { sendEmail } from "@/lib/email";


// POST: Make a Donation
export async function POST(req) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    await dbConnect();

    const { amount, cause, transactionId, status, method } = await req.json();

    if (!amount || !transactionId) {
      return NextResponse.json(
        { message: "All required fields must be filled" },
        { status: 400 }
      );
    }

    const donation = await Donation.create({
      donor: session.user.id,
      amount,
      cause,
      transactionId,
      status: status || "Completed",
      method: method || "Online",
    });

    await sendEmail({
      to: session.user.email,
      subject: "Thank You for Your Donation!",
      html: `
        <p>Dear ${session.user.name || "Supporter"},</p>
        <p>Thank you for your generous donation of ₹${amount} towards Edignite's mission.</p>
        <p>Your contribution will help bring education, healthcare, and hope to those who need it most.</p>
        <p>We deeply appreciate your support!</p>
        <p>Warm regards,<br/>Edignite Team</p>
      `,
    });

    return NextResponse.json(
      { message: "Donation successful", donation },
      { status: 201 }
    );
  } catch (error) {
    console.error("Donation Error:", error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}

//GET: Fetch My Donations
export async function GET(req) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    await dbConnect();

    const donations = await Donation.find({ donor: session.user.id }).sort({
      createdAt: -1,
    });

    return NextResponse.json({ donations }, { status: 200 });
  } catch (error) {
    console.error("Fetch Donations Error:", error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}
