import Testimonial from "../model/Testimonials.js";
import express from "express"

const router = express.Router();

// Create a new testimonial
router.post("/", async (req, res) => {
    try {
        const { name, content, rating } = req.body;
        const newTestimonial = new Testimonial({ name, content, rating });
        await newTestimonial.save();
        res.status(201).json(newTestimonial);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get all testimonials
router.get("/", async (req, res) => {
    try {
        const testimonials = await Testimonial.find();
        res.status(200).json(testimonials);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

//edit testimonial
router.put("/:id", async (req, res) => {
    try {
        const { name, content, rating } = req.body;
        const updatedTestimonial = await Testimonial.findByIdAndUpdate(
            req.params.id,
            { name, content, rating },
            { new: true }
        );
        res.status(200).json(updatedTestimonial);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// delete testimonial
router.delete("/:id", async (req, res) => {
    try {
        await Testimonial.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Testimonial deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;