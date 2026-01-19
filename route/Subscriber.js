import express from "express";
import Subscriber from "../model/Subscribe.js";

const router = express.Router();

/**
 * SUBSCRIBE USER
 */
router.post("/", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // Check if email already exists
    const check = await Subscriber.findOne({ email });
    if (check) {
      return res
        .status(400)
        .json({ message: "You have already subscribed before" });
    }

    // Create new subscriber
    const user = new Subscriber({ email });
    const saving = await user.save();

    return res.status(201).json({
      message: "You have subscribed successfully",
      data: saving,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

/**
 * GET ALL SUBSCRIBERS
 */
router.get("/", async (req, res) => {
  try {
    const users = await Subscriber.find().sort({ createdAt: -1 });

    return res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching subscribers" });
  }
});

router.delete('/', async(req, res) => {
try {
 await Subscriber.deleteMany()
 res.status(200).json({message: "deleted"});
} catch (error) {
  console.log(error);
  
}
});

export default router;
