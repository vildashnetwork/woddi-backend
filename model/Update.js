import mongoose from "mongoose";

const ReplySchema = new mongoose.Schema(
    {
        reply: {
            type: String,
            required: true,
            trim: true
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    },
    { _id: true }
);

const CommentSchema = new mongoose.Schema(
    {
        comment: {
            type: String,
            required: true,
            trim: true
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        replies: {
            type: [ReplySchema],
            default: []
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    },
    { _id: true }
);

const newUpdate = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    tags: {
        type: [String],
        required: true
    },
    type: {
        type: String,
        enum: ["video", "image"],
        default: "image"
    },
    imageUrl: {
        type: String,
        default: ""
    },
    videoUrl: {
        type: String,
        default: ""
    },
    category: {
        type: String,
        enum: ["published", "draft"],
        default: "published"
    },

    likes: {
        type: Array,
        default: []
    },

    comments: {
        type: [CommentSchema],
        default: []
    }


}, { timestamps: true })

const Update = mongoose.model("Update", newUpdate);

export default Update