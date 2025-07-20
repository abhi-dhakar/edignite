import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User.model";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { signupSchema } from "@/lib/validations/signupSchema";
import { sendEmail } from "@/lib/resend";
import { UserRegistrationEmail } from "@/emails";

export async function POST(request) {
  try {
    const formData = await request.formData();

    const rawData = {
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
      phone: formData.get("phone") || "",
      address: formData.get("address") || "",
      memberType: formData.get("memberType") || "Volunteer",
    };

    // Validate with Zod
    const result = signupSchema.safeParse(rawData);
    if (!result.success) {
      return NextResponse.json(
        {
          message: "Validation failed",
          errors: result.error.flatten(),
        },
        { status: 400 }
      );
    }

    const { name, email, password, phone, address, memberType } = result.data;

    const allowedRoles = ["Donor", "Volunteer", "Sponsor", "Beneficiary"];

    if (!allowedRoles.includes(memberType)) {
      return NextResponse.json(
        { message: "Invalid member type" },
        { status: 400 }
      );
    }

    const imageFile = formData.get("image");

    await dbConnect();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "User with this email already exists" },
        { status: 400 }
      );
    }

    let imageData = null;
    if (imageFile && typeof imageFile === "object" && imageFile.name) {
      try {
        imageData = await uploadToCloudinary(imageFile);
        if (!imageData) {
          return NextResponse.json(
            { message: "Failed to upload profile image" },
            { status: 500 }
          );
        }
      } catch (error) {
        console.error("Image upload error:", error);
        return NextResponse.json(
          { message: "Failed to upload profile image" },
          { status: 500 }
        );
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      address,
      memberType,
      image: imageData?.url || null,
      imagePublicId: imageData?.publicId || null,
    });

    const user = {
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone,
      address: newUser.address,
      memberType: newUser.memberType,
      image: newUser.image,
    };

    await sendEmail({
      to: user.email,
      subject: "Welcome to Edignite!",
      react: UserRegistrationEmail({ name: user.name }),
    });

    return NextResponse.json(
      { message: "User created successfully", user },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { message: "Failed to create user", error: error.message },
      { status: 500 }
    );
  }
}
