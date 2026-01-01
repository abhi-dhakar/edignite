import { NextResponse } from "next/server";
import crypto from "crypto";
import dbConnect from "@/lib/dbConnect";
import Donation from "@/models/Donation.model";

export async function POST(req) {
    try {
        const body = await req.text();
        const signature = req.headers.get("x-razorpay-signature");

        if (!process.env.RAZORPAY_WEBHOOK_SECRET) {
            console.error("RAZORPAY_WEBHOOK_SECRET is not set");
            return NextResponse.json({ error: "Configuration Error" }, { status: 500 });
        }

        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET)
            .update(body)
            .digest("hex");

        if (expectedSignature !== signature) {
            return NextResponse.json(
                { error: "Invalid signature" },
                { status: 400 }
            );
        }

        const event = JSON.parse(body);
        await dbConnect();

        const payment = event.payload.payment.entity;
        const orderId = payment.order_id;

        if (event.event === "payment.captured") {
            await Donation.findOneAndUpdate(
                { orderId: orderId },
                { paymentStatus: "Completed", transactionId: payment.id }
            );
        } else if (event.event === "payment.failed") {
            await Donation.findOneAndUpdate(
                { orderId: orderId },
                { paymentStatus: "Failed" }
            );
        }

        return NextResponse.json({ status: "ok" });
    } catch (error) {
        console.error("Webhook Error:", error);
        return NextResponse.json(
            { error: "Webhook Error" },
            { status: 500 }
        );
    }
}
