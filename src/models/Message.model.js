import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
    },

    message: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      enum: ["Contact", "Suggestion", "Feedback"],
      default: "Contact",
    },

    submittedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Optional: if a logged-in user submits the message
    },
  },
  { timestamps: true }
);

export default mongoose.models.Message ||
  mongoose.model("Message", MessageSchema);
