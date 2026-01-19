import User from "../model/User.js";
import express from "express";

const router = express.Router();

// post user email
router.post("/user/email", async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }
        let user = await User.findOne({ email });
        if (!user) {
            user = new User({ email });
            await user.save();
        }
        res.status(200).json({ message: "User email saved", user });
    } catch (error) {
        console.error("Error saving user email:", error);
        res.status(500).json({ message: "Server error" });
    }
});

export default router;

