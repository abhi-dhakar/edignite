import mongoose from "mongoose";

const DonationSchema = new mongoose.Schema(
  {
    donor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },

    donorName: {
      type: String,
    },

    donorEmail: {
      type: String,
    },

    amount: {
      type: Number,
      required: true,
    },

    currency: {
      type: String,
      default: "INR",
    },

    orderId: {
      type: String,
      required: true,
    },

    transactionId: {
      type: String,
      required: true,
    },

    paymentStatus: {
      type: String,
      enum: ["Pending", "Completed", "Failed"],
      default: "Pending",
    },
  },
  { timestamps: true } // Updated schema with donor field
);

export default mongoose.models.Donation ||
  mongoose.model("Donation", DonationSchema);
