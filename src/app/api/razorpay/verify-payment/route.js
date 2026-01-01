import { NextResponse } from "next/server";
import crypto from "crypto";
import dbConnect from "@/lib/dbConnect";
import Donation from "@/models/Donation.model";

export async function POST(req) {
    try {
        await dbConnect();
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
        } = await req.json();

        const body = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest("hex");

        if (expectedSignature === razorpay_signature) {
            // Payment verification successful
            const updatedDonation = await Donation.findOneAndUpdate(
                { orderId: razorpay_order_id },
                {
                    transactionId: razorpay_payment_id,
                    paymentStatus: "Completed",
                },
                { new: true }
            );

            return NextResponse.json({
                success: true,
                message: "Payment verified successfully",
                donation: updatedDonation,
            });
        } else {
            // Payment verification failed
            await Donation.findOneAndUpdate(
                { orderId: razorpay_order_id },
                { paymentStatus: "Failed" }
            );

            return NextResponse.json(
                { success: false, message: "Invalid signature" },
                { status: 400 }
            );
        }
    } catch (error) {
        console.error("Error verifying payment:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
