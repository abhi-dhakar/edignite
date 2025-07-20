import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import OTP from "@/models/OTP.model";

export async function POST(req) {
  try {
    await dbConnect();

    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json(
        { success: false, message: "Email and verification code are required" },
        { status: 400 }
      );
    }

    const otpRecord = await OTP.findOne({ email });

    if (!otpRecord) {
      return NextResponse.json(
        { success: false, message: "Verification code expired or not found" },
        { status: 400 }
      );
    }

    otpRecord.attempts += 1;
    if (otpRecord.attempts >= 4) {
      await OTP.deleteOne({ email });
      return NextResponse.json(
        {
          success: false,
          message: "Too many failed attempts. Please request a new otp.",
        },
        { status: 400 }
      );
    }
    await otpRecord.save();



    if (otpRecord.otp !== otp) {
      return NextResponse.json(
        { success: false, message: "Invalid verification code" },
        { status: 400 }
      );
    }

    if (!otpRecord.userData?.passwordReset) {
      return NextResponse.json(
        { success: false, message: "Invalid reset request" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Verification code is valid" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Verify OTP Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to verify code" },
      { status: 500 }
    );
  }
}
