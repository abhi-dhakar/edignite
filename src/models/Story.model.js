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
      type: String, // Optional: story-related image URL
    },

    authorName: {
      type: String, // Optional: person whose story it is
    },

    date: {
      type: Date,
      default: Date.now,
    },

    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Optional: Admin or volunteer who submitted the story
    },
  },
  { timestamps: true }
);

export default mongoose.models.Story || mongoose.model("Story", StorySchema);
