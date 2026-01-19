import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["volunteer", "partner", "intern"],
      required: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
    },
    phone: String,
    locationOrOrganization: String,
    message: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Application", applicationSchema);
