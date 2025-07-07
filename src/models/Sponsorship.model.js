import mongoose from "mongoose";

const SponsorshipSchema = new mongoose.Schema(
  {
    sponsor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    childName: {
      type: String, // Name of the child (if child sponsorship)
    },

    projectName: {
      type: String, // Name of the project (if project sponsorship)
    },

    amount: {
      type: Number,
      required: true,
    },

    frequency: {
      type: String,
      enum: ["One-Time", "Monthly", "Yearly"],
      default: "Monthly",
    },

    startDate: {
      type: Date,
      default: Date.now,
    },

    status: {
      type: String,
      enum: ["Active", "Completed", "Cancelled"],
      default: "Active",
    },
  },
  { timestamps: true }
);

export default mongoose.models.Sponsorship ||
  mongoose.model("Sponsorship", SponsorshipSchema);
