import mongoose from "mongoose";

const ProgramSchema = new mongoose.Schema(
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
        status: {
            type: String,
            enum: ["active", "completed", "upcoming", "planned"],
            default: "active"
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
        beneficiaries: {
            type: Number,
            default: 0
        }
    },
    { timestamps: true }
);


const Program = mongoose.model("Program", ProgramSchema);

export default Program;