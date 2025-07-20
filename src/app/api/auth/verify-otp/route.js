import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import OTP from "@/models/OTP.model";
import User from "@/models/User.model";
import bcryptjs from "bcryptjs";

import { sendEmail } from "@/lib/resend";
import { UserRegistrationEmail } from "@/emails";
import { signupSchema } from "@/lib/validations/signupSchema";

export async function POST(req) {
  try {
    await dbConnect();

    const body = await req.json();
    const { email, otp } = body;

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

    const validationResult = signupSchema.safeParse(otpRecord.userData);
    if (!validationResult.success) {
      return NextResponse.json(
        { success: false, message: "Invalid user data stored with OTP" },
        { status: 400 }
      );
    }


    if (otpRecord.otp !== otp) {
      return NextResponse.json(
        { success: false, message: "Invalid verification code" },
        { status: 400 }
      );
    }

    const userData = otpRecord.userData;

     const allowedRoles = ["Donor", "Volunteer", "Sponsor", "Beneficiary"];
     if (!allowedRoles.includes(userData.memberType)) {
       return NextResponse.json(
         { success: false, message: "Invalid member type" },
         { status: 400 }
       );
     }

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(userData.password, salt);

    const newUser = new User({
      name: userData.name,
      email: userData.email,
      password: hashedPassword,
      phone: userData.phone || "",
      address: userData.address || "",
      memberType: userData.memberType || "Volunteer",
      image: "", 
      imagePublicId: "",
    });

    await newUser.save();

    await OTP.deleteOne({ email });

    await sendEmail({
      to: email,
      subject: "Welcome to Our NGO!",
      react: UserRegistrationEmail({ name: userData.name }),
    });

    return NextResponse.json(
      {
        success: true,
        message: "Email verified and registration completed",
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Verify OTP Error:", error);
    return NextResponse.json(
      { success: false, message: "Registration failed" },
      { status: 500 }
    );
  }
}
