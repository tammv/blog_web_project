import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    referenceId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "referenceType", // Dynamic reference based on type field
    },
    referenceType: {
      type: String,
      required: true,
      enum: ["Post", "Video"], // Allowed types
    },
    content: {
      type: String,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Report = mongoose.model("Report", reportSchema);

export default Report;
