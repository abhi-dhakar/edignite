import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // your NextAuth config
import dbConnect from "@/lib/dbConnect";
import Donation from "@/models/Donation.model";
import User from "@/models/User.model";

export async function GET(req) {
  await dbConnect();
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response(
      JSON.stringify({ success: false, message: "Unauthorized" }),
      {
        status: 401,
      }
    );
  }

  const isAdmin = session.user.role === "admin";
  const query = isAdmin ? {} : { donor: session.user.id };

  const donations = await Donation.find(query)
    .populate("donor", "name email")
    .sort({ createdAt: -1 });

  return new Response(JSON.stringify({ success: true, data: donations }), {
    status: 200,
  });
}

export async function POST(req) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  const body = await req.json();
  const {
    amount,
    currency = "INR",
    anonymous = false,
    name,
    email,
    phone,
  } = body;

  if (!amount || amount < 10) {
    return new Response(
      JSON.stringify({
        success: false,
        message: "Donation amount must be at least ₹10",
      }),
      { status: 400 }
    );
  }

  try {
    if (session) {
      const donation = await Donation.create({
        donor: session.user.id,
        amount,
        currency,
        paymentStatus: "Pending",
        transactionId: `txn_${Date.now()}`, 
      });

      return new Response(JSON.stringify({ success: true, data: donation }), {
        status: 201,
      });
    } else {
      if (!name || !email || !phone) {
        return new Response(
          JSON.stringify({
            success: false,
            message: "Name, email, and phone are required for guest donations",
          }),
          { status: 400 }
        );
      }

      let user = await User.findOne({ email });
      if (!user) {
        user = await User.create({ name, email, phone, isGuest: true });
      }

      const donation = await Donation.create({
        donor: user._id,
        amount,
        currency,
        paymentStatus: "Pending",
        transactionId: `txn_${Date.now()}`,
      });

      return new Response(JSON.stringify({ success: true, data: donation }), {
        status: 201,
      });
    }
  } catch (error) {
    console.error("Error creating donation:", error);
    return new Response(
      JSON.stringify({ success: false, message: "Server error" }),
      {
        status: 500,
      }
    );
  }
}
