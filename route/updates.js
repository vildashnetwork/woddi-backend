import Update from "../model/Update.js";
import express from "express";


const router = express.Router();

//create an update
router.post("/", async (req, res) => {
    try {
        const newUpdate = new Update(req.body);
        const savedUpdate = await newUpdate.save();
        res.status(201).json(savedUpdate);
    } catch (err) {
        console.error("Error creating update:", err);
        res.status(500).json({ message: "Internal server error" });
    }
});

//get all updates
router.get("/", async (req, res) => {
    try {
        const updates = await Update.find().sort({ createdAt: -1 });
        res.status(200).json(updates);
    } catch (err) {
        console.error("Error fetching updates:", err);
        res.status(500).json({ message: "Internal server error" });
    }
});

//update updates

router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const updatedData = req.body;

        const updatedUpdate = await Update.findByIdAndUpdate(id, updatedData, { new: true });
        if (!updatedUpdate) {
            return res.status(404).json({ message: "Update not found" });
        }
        res.status(200).json(updatedUpdate);
    } catch (err) {
        console.error("Error updating update:", err);
        res.status(500).json({ message: "Internal server error" });
    }
});
//delete an update
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const deletedUpdate = await Update.findByIdAndDelete(id);
        if (!deletedUpdate) {
            return res.status(404).json({ message: "Update not found" });
        }
        res.status(200).json({ message: "Update deleted successfully" });
    } catch (err) {
        console.error("Error deleting update:", err);
        res.status(500).json({ message: "Internal server error" });
    }
});
//get by id
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const update = await Update.findById(id);
        if (!update) {
            return res.status(404).json({ message: "Update not found" });
        }
        res.status(200).json(update);
    } catch (err) {
        console.error("Error fetching update:", err);
        res.status(500).json({ message: "Internal server error" });
    }

});






//comments on updates
router.post("/:id/comments", async (req, res) => {
    try {
        const { id } = req.params;
        const { comment, userId } = req.body;

        const update = await Update.findById(id);
        if (!update) {
            return res.status(404).json({ message: "Update not found" });
        }

        update.comments.push({ comment, userId });

        await update.save();

        res.status(200).json({ message: "Comment added successfully", comments: update.comments });
    } catch (err) {
        console.error("Error adding comment:", err);
        res.status(500).json({ message: "Internal server error" });
    }
});

// reply comment using user Id
router.post("/:id/comments/reply", async (req, res) => {
    try {
        const { id } = req.params;
        const { commentId, reply, userId } = req.body;
        const update = await Update.findById(id);
        if (!update) {
            return res.status(404).json({ message: "Update not found" });
        }
        const comment = update.comments.id(commentId);
        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }
        comment.replies.push({ reply, userId });
        await update.save();
        res.status(200).json({ message: "Reply added successfully", comment });
    } catch (err) {
        console.error("Error adding reply:", err);
        res.status(500).json({ message: "Internal server error" });
    }
});


//puhs likes on updates only one like per person to unlike and like do it here on this route at once

router.post("/:id/likes", async (req, res) => {
    try {
        const { id } = req.params;
        const { userId } = req.body;
        const update = await Update.findById(id);
        if (!update) {
            return res.status(404).json({ message: "Update not found" });
        }
        const likeIndex = update.likes.indexOf(userId);
        if (likeIndex === -1) {
            update.likes.push(userId);
        } else {
            update.likes.splice(likeIndex, 1);
        }
        await update.save();
        res.status(200).json({ message: "Like status updated successfully", likes: update.likes });
    } catch (err) {
        console.error("Error updating like status:", err);
        res.status(500).json({ message: "Internal server error" });
    }
});

export default router;