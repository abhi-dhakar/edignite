import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User.model";
import OTP from "@/models/OTP.model";

import { sendEmail } from "@/lib/resend";
import { PasswordResetEmail } from "@/emails";

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(req) {
  try {
    await dbConnect();

    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email is required" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email });

    if (user) {
      const otp = generateOTP();
      await OTP.findOneAndUpdate(
        { email },
        {
          email,
          otp,
          userData: { email, name: user.name, passwordReset: true },
          createdAt: new Date(),
        },
        { upsert: true, new: true }
      );

      await sendEmail({
        to: email,
        subject: "Reset Your Password",
        react: PasswordResetEmail({ name: user.name, otp }), // Adapt your OTP template
      });
    }

    return NextResponse.json(
      {
        success: true,
        message:
          "If your email is registered, you will receive a verification code.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Password Reset Request Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong. Please try again later.",
      },
      { status: 500 }
    );
  }
}
