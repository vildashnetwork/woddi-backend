import express from "express";
import {
  volunteerApplication,
  partnerApplication,
  internApplication,
  getAllApplications,
} from "./application.controller.js";
import Application from "../model/Application.js";

const router = express.Router();

// Volunteer
router.post("/volunteer", volunteerApplication);

// Partner
router.post("/partner", partnerApplication);

// Internship
router.post("/intern", internApplication);

// Admin: get all applications
router.get("/", getAllApplications);


router.delete('/', async (req, res) => {
  try {
    await Application.deleteMany()
    res.status(200).json({ message: "deleted" });
  } catch (error) {
    console.log(error);

  }
});

export default router;
