import Program from "../model/Program.js";
import express from "express"

const router = express.Router();

// Create a new program
router.post("/", async (req, res) => {
    const newProgram = new Program(req.body);
    try {
        const savedProgram = await newProgram.save();
        res.status(201).json(savedProgram);
    } catch (err) {
        res.status(500).json(err);
    }
});
// Get all programs
router.get("/", async (req, res) => {
    try {
        const programs = await Program.find().sort({createdAt: -1});
        res.status(200).json(programs);
    } catch (err) {
        res.status(500).json(err);
    }
});
//edit program by id
router.put("/:id", async (req, res) => {
    try {
        const updatedProgram = await Program.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );
        res.status(200).json(updatedProgram);
    } catch (err) {
        res.status(500).json(err);
    }
});
//delete program by id
router.delete("/:id", async (req, res) => {
    try {
        await Program.findByIdAndDelete(req.params.id);
        res.status(200).json("Program has been deleted");
    } catch (err) {
        res.status(500).json(err);
    }
});

export default router;