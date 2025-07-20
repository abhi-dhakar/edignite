import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import OTP from "@/models/OTP.model";

import { OTPVerificationEmail } from "@/emails";
import { sendEmail } from "@/lib/resend";

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(req) {
  try {
    await dbConnect();

    const body = await req.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email is required" },
        { status: 400 }
      );
    }

    const otpRecord = await OTP.findOne({ email });
    if (!otpRecord) {
      return NextResponse.json(
        { success: false, message: "No pending registration found" },
        { status: 400 }
      );
    }

    const otp = generateOTP();

    otpRecord.otp = otp;
    otpRecord.createdAt = new Date();
    await otpRecord.save();

    await sendEmail({
      to: email,
      subject: "Verify Your Email",
      react: OTPVerificationEmail({
        name: otpRecord.userData.name,
        otp,
      }),
    });

    return NextResponse.json(
      { success: true, message: "New verification code sent to your email" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Resend OTP Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to resend verification code" },
      { status: 500 }
    );
  }
}
