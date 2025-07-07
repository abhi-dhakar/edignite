import mongoose from "mongoose";

const VolunteerSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // One user → one volunteer profile
    },

    skills: [
      {
        type: String,
      },
    ],

    availability: {
      type: String, // Example: "Weekends", "Weekdays", "Full-time"
    },

    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },

    experience: {
      type: String, 
    },

    preferredLocation: {
      type: String, 
    },
  },
  { timestamps: true }
);

export default mongoose.models.Volunteer ||
  mongoose.model("Volunteer", VolunteerSchema);
