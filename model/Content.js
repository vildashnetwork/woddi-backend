import mongoose from "mongoose";

const contentSchema = new mongoose.Schema(
    {
        icon: {
            type: String,
            default: ""
        },
        title: {
            type: String,
            default: ""
        },
        body: {
            type: String,
            default: ""
        },
        imageUrl: {
            type: String,
            default: ""
        },
        remark: {
            type: String,
            default: ""
        },
        amenities: {
            type: [String],
            default: []
        },
        category: {
            type: String,
            enum: ["news", "events"],
            default: "news",
        },
        type: {
            type: String,
            enum: ["program", "health", "partnership", "story", "report"],
            default: "program",
        },
        date: {
            type: String,
            default: ""
        },
        pushas: {
            type: String,
            enum: ["published", "draft"],
            default: "published"
        },
    },
    { timestamps: true }
);


const Content = mongoose.model("Content", contentSchema);

export default Content;