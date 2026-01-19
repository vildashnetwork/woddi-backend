import MediaGallery from '../model/Mediagelary.js';
import express from "express";

const router = express.Router();

//post media
router.post("/", async (req, res) => {
    try {
        const newMedia = new MediaGallery(req.body);
        const savedMedia = await newMedia.save();
        res.status(200).json(savedMedia);
    }
    catch (err) {
        res.status(500).json(err);
    }
});

//update media by id
router.put("/:id", async (req, res) => {
    try {
        const updatedMedia = await MediaGallery.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );
        res.status(200).json(updatedMedia);
    } catch (err) {
        res.status(500).json(err);
    }
});

//delete media by id
router.delete("/:id", async (req, res) => {
    try {
        await MediaGallery.findByIdAndDelete(req.params.id);
        res.status(200).json("Media has been deleted...");
    } catch (err) {
        res.status(500).json(err);
    }
});

//get all media
router.get("/", async (req, res) => {
    try {
        const medias = await MediaGallery.find().sort(createdAt: -1);
        res.status(200).json(medias);
    } catch (err) {
        res.status(500).json(err);
    }
});

//get media by id
router.get("/:id", async (req, res) => {
    try {
        const media = await MediaGallery.findById(req.params.id);
        res.status(200).json(media);
    }
    catch (err) {
        res.status(500).json(err);
    }
});

export default router;