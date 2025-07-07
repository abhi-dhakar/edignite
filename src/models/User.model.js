import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
    }, 

    image: {
      type: String,
    }, 

    phone: {
      type: String,
    },

    address: {
      type: String,
    },

    memberType: {
      type: String,
      enum: ["Donor", "Volunteer", "Sponsor", "Beneficiary", "Admin"],
      default: "Donor",
    },

    donations: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Donation",
      },
    ],

    sponsorships: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Sponsorship",
      },
    ],

    volunteerProfile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Volunteer",
    },

    eventRegistrations: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event",
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);
