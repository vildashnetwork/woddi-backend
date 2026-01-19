import Donation from "../model/Donation.js";
import express from 'express';
const router = express.Router();

// Create a new donation entry
router.post('/', async (req, res) => {
    const newDonation = new Donation(req.body);
    try {
        const savedDonation = await newDonation.save();
        res.status(201).json(savedDonation);
    } catch (err) {
        res.status(500).json(err);
    }
});

// Get all donation entries
router.get('/', async (req, res) => {
    try {
        const donations = await Donation.find();
        res.status(200).json(donations);
    } catch (err) {
        res.status(500).json(err);
    }
});
//update donation entry
router.put('/:id', async (req, res) => {
    try {
        const updatedDonation = await Donation.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );
        res.status(200).json(updatedDonation);
    } catch (err) {
        res.status(500).json(err);
    }
});
//delete donation entry
// router.delete('/:id', async (req, res) => {
//     try {
//         await Donation.findByIdAndDelete(req.params.id);
//         res.status(200).json("Donation entry has been deleted...");
//     } catch (err) {
//         res.status(500).json(err);
//     }
// });


export default router;