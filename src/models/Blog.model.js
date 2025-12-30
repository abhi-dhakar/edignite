import mongoose from "mongoose";

const BlogSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        excerpt: {
            type: String,
            required: true,
            trim: true,
        },
        content: {
            type: String,
            required: true,
        },
        image: {
            type: String,
            required: true,
        },
        imagePublicId: {
            type: String,
        },
        category: {
            type: String,
            required: true,
            enum: ["Sustainability", "Education", "Community", "News", "Impact"],
            default: "Community",
        },
        author: {
            name: { type: String, required: true },
            image: { type: String },
        },
        readTime: {
            type: String,
            default: "5 min read",
        },
        tags: [{
            type: String,
        }],
        date: {
            type: Date,
            default: Date.now,
        },
        isFeatured: {
            type: Boolean,
            default: false,
        },
        postedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    },
    { timestamps: true }
);

export default mongoose.models.Blog || mongoose.model("Blog", BlogSchema);
