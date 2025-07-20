import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import OTP from "@/models/OTP.model";
import User from "@/models/User.model";
import { signupSchema } from "@/lib/validations/signupSchema";
import { OTPVerificationEmail } from "@/emails";
import { sendEmail } from "@/lib/resend";

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(req) {
  try {
    await dbConnect();

    const body = await req.json();
    const result = signupSchema.safeParse(body);

    if(!result.success){
      const errors = result.error.format();
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed",
          errors: errors,
        },
        { status: 400 }
      );
    }

    const { email, name, password, phone, address, memberType } = result.data;

    if (!email || !name || !password) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

        const allowedRoles = ["Donor", "Volunteer", "Sponsor", "Beneficiary"];

        if (!allowedRoles.includes(memberType)) {
          return NextResponse.json(
            { message: "Invalid member type" },
            { status: 400 }
          );
        }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "Email already registered" },
        { status: 400 }
      );
    }

    const otp = generateOTP();

    await OTP.findOneAndUpdate(
      { email },
      {
        email,
        otp,
        userData: {
          email,
          name,
          password,
          phone: phone || "",
          address: address || "",
          memberType: memberType || "Volunteer",
        },
      },
      { upsert: true, new: true }
    );

    await sendEmail({
      to: email,
      subject: "Verify Your Email",
      react: OTPVerificationEmail({ name, otp }),
    });

    return NextResponse.json(
      { success: true, message: "Verification code sent to your email" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Send OTP Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to send verification code" },
      { status: 500 }
    );
  }
}
