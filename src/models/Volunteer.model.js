import mongoose from "mongoose";

const VolunteerSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // One user → one volunteer profile
    },

    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
    },

    emailAddress: {
      type: String,
      required: [true, "Email address is required"],
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please fill a valid email address",
      ],
      trim: true,
    },

    mobileNumber: {
      type: String,
      required: [true, "Mobile number is required"],
      match: [/^[0-9]{10}$/, "Please fill a valid 10-digit mobile number"],
    },

    enrollmentNumber: {
      type: String,
      required: [true, "Enrollment/Registration number is required"],
      trim: true,
    },

    branch: {
      type: String,
      required: [true, "Branch/Department is required"],
      trim: true,
    },

    division: {
      type: String,
      required: [true, "Division is required"],
      trim: true,
    },

    year: {
      type: String,
      required: [true, "Year is required"],
      trim: true,
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
