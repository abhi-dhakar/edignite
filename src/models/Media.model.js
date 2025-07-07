import mongoose from "mongoose";

const MediaSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["Photo", "Video"],
      required: true,
    },

    url: {
      type: String,
      required: true,
    },

    caption: {
      type: String,
    },

    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", 
    },
  },
  { timestamps: true }
);

export default mongoose.models.Media || mongoose.model("Media", MediaSchema);
