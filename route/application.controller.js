import Application from "../model/Application.js";

const createApplication = async (req, res, type) => {
  try {
    const { fullName, email, phone, locationOrOrganization, message } = req.body;

    if (!fullName || !email || !message) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const application = await Application.create({
      type,
      fullName,
      email,
      phone,
      locationOrOrganization,
      message,
    });

    res.status(201).json({
      message: "Application submitted successfully",
      application,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const volunteerApplication = (req, res) =>
  createApplication(req, res, "volunteer");

export const partnerApplication = (req, res) =>
  createApplication(req, res, "partner");

export const internApplication = (req, res) =>
  createApplication(req, res, "intern");

export const getAllApplications = async (req, res) => {
  try {
    const applications = await Application.find().sort({ createdAt: -1 });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
