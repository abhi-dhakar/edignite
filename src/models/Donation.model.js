import mongoose from "mongoose";

const DonationSchema = new mongoose.Schema(
  {
    donor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    currency: {
      type: String,
      default: "INR",
    },

    paymentStatus: {
      type: String,
      enum: ["Pending", "Completed", "Failed"],
      default: "Pending",
    },

    transactionId: {
      type: String,
    },

    receiptUrl: {
      type: String, // Optional: store download link for donation receipt (PDF/Image)
    },
  },
  { timestamps: true }
);

export default mongoose.models.Donation ||
  mongoose.model("Donation", DonationSchema);
