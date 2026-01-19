import mongoose from "mongoose"

const mediaGallerySchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },
        mediaType: {
            type: String,
            enum: ["image", "video"],
            default: "image"
        },
        imageUrl: {
            type: String,
            default: ""
        },
        videoUrl: {
            type: String,
            default: ""
        }
    }, { timestamps: true });


const MediaGallery = mongoose.model("MediaGallery", mediaGallerySchema);

export default MediaGallery;