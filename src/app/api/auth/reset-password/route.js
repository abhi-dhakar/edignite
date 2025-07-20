import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User.model";
import OTP from "@/models/OTP.model";
import bcryptjs from "bcryptjs";
import { z } from "zod";

const resetSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email" }),
  otp: z.string().length(6, { message: "Verification code must be 6 digits" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .max(100, { message: "Password cannot exceed 100 characters" })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/, {
      message:
        "Password must contain at least one uppercase letter, one lowercase letter, and one number",
    }),
  confirmPassword: z.string(),
});

export async function POST(req) {
  try {
    await dbConnect();

    const body = await req.json();

    if (!body.email || !body.otp || !body.password || !body.confirmPassword) {
      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 400 }
      );
    }

    const validationResult = resetSchema
      .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
      })
      .safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed",
          errors: validationResult.error.format(),
        },
        { status: 400 }
      );
    }

    const { email, otp, password } = validationResult.data;

    const otpRecord = await OTP.findOne({ email });

    if (!otpRecord || otpRecord.otp !== otp) {
      return NextResponse.json(
        { success: false, message: "Invalid or expired verification code" },
        { status: 400 }
      );
    }

    if (!otpRecord.userData?.passwordReset) {
      return NextResponse.json(
        { success: false, message: "Invalid reset request" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    user.password = hashedPassword;
    await user.save();

    await OTP.deleteOne({ email });

    return NextResponse.json(
      { success: true, message: "Password has been reset successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Reset Password Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to reset password" },
      { status: 500 }
    );
  }
}
