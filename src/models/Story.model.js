import mongoose from "mongoose";

const StorySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    content: {
      type: String,
      required: true,
    },

    image: {
      type: String,
    },
    
    imagePublicId: {
      type: String,
    },

    authorName: {
      type: String,
    },

    date: {
      type: Date,
      default: Date.now,
    },

    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export default mongoose.models.Story || mongoose.model("Story", StorySchema);
