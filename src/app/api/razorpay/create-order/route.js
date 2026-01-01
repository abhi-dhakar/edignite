import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import dbConnect from "@/lib/dbConnect";
import Donation from "@/models/Donation.model";
import User from "@/models/User.model";

export async function POST(req) {
    try {
        await dbConnect();
        const { amount, currency = "INR", donorName, donorEmail, user } = await req.json();

        if (!amount) {
            return NextResponse.json(
                { error: "Amount is required" },
                { status: 400 }
            );
        }

        if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
            console.error("Razorpay keys are missing in environment variables.");
            return NextResponse.json(
                { error: "Configuration Error: Razorpay Keys Missing" },
                { status: 500 }
            );
        }

        const razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET,
        });

        const options = {
            amount: Math.round(amount * 100), // Convert to paise
            currency,
            receipt: `receipt_${Date.now()}`,
        };

        const order = await razorpay.orders.create(options);

        // Create pending donation record
        const donation = await Donation.create({
            donor: user || null,
            donorName,
            donorEmail,
            amount, // Store in major unit (INR) for display
            currency,
            orderId: order.id,
            transactionId: order.id, // Placeholder until payment is complete
            paymentStatus: "Pending",
        });

        // Link donation to user if logged in
        if (user) {
            await User.findByIdAndUpdate(user, {
                $push: { donations: donation._id }
            });
        }

        return NextResponse.json({
            orderId: order.id,
            donationId: donation._id,
            amount: options.amount,
            currency: options.currency,
            keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // Send key to frontend
        });
    } catch (error) {
        console.error("Error creating Razorpay order:", error);
        return NextResponse.json(
            { error: error.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}
