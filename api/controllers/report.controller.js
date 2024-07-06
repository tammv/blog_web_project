import Report from "../models/report.model.js";
import Post from "../models/post.model.js"; // Import Post model
import Video from "../models/video.model.js";
import asyncHandler from "express-async-handler";

// Create a new report
export const createReport = asyncHandler(async (req, res) => {
  const { referenceId, referenceType, content } = req.body;

  // Validate referenceType
  if (!["Post", "Video"].includes(referenceType)) {
    return res.status(400).json({ message: "referenceType must be either 'Post' or 'Video'" });
  }

  // Validate referenceId
  if (!referenceId) {
    return res.status(400).json({ message: "referenceId is required" });
  }

  // Create new report
  const newReport = new Report({
    referenceId,
    referenceType,
    content,
    userId: req.user.id,
  });

  // Save the report to the database
  const savedReport = await newReport.save();

  // Respond with the saved report
  res.status(201).json(savedReport);
});

export const getAllReports = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  try {
    // Fetch reports with user information
    const reports = await Report.find()
      .populate("userId", "username email")
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .lean(); // Convert to plain JavaScript objects

    // Fetch reference information for each report
    const populatedReports = await Promise.all(
      reports.map(async (report) => {
        if (report.referenceType === "Post") {
          const post = await Post.findById(report.referenceId).select("title content slug").lean();
          if (post) {
            report.referenceId = post; // Attach the post details
          }
        } else if (report.referenceType === "Video") {
          const video = await Video.findById(report.referenceId).select("title content url slug").lean();
          if (video) {
            report.referenceId = video; // Attach the video details
          }
        }
        return report;
      })
    );

    const totalReports = await Report.countDocuments();
    res.status(200).json({
      reports: populatedReports,
      totalPages: Math.ceil(totalReports / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error("Error fetching reports:", error.message);
    res.status(500).json({ message: "Failed to fetch reports" });
  }
});
// Get reports by user ID
export const getReportById = asyncHandler(async (req, res) => {
  const reportId = req.params.id;

  try {
    const report = await Report.findById(reportId)
      .populate({
        path: "referenceId",
        select: "title content url", // Adjust fields based on your schema
        model: "Post", // Specify the model name for referenceId
      })
      .populate("userId", "username email");

    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    res.status(200).json(report);
  } catch (error) {
    console.error("Error fetching report:", error.message);
    res.status(500).json({ message: "Failed to fetch report" });
  }
});

// Update a report by ID
export const updateReportById = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const report = await Report.findById(req.params.id);

  if (!report) {
    return res.status(404).json({ message: "Report not found" });
  }

  if (report.userId.toString() !== userId) {
    return res.status(403).json({ message: "You are not authorized to update this report" });
  }

  const updatedReport = await Report.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

  res.status(200).json(updatedReport);
});

// Backend endpoint to delete a report by ID
// Assuming you are using asyncHandler for error handling
export const deleteReportById = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  try {
    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    // // Check if the user is authorized to delete the report
    // if (report.userId && report.userId.toString() !== userId) {
    //   return res.status(403).json({ message: "You are not authorized to delete this report" });
    // }

    // Delete the report
    await report.deleteOne(); // Using deleteOne() to delete the document

    res.status(200).json({ message: "Report deleted successfully" });
  } catch (error) {
    console.error("Error deleting report:", error.message);
    res.status(500).json({ message: "Failed to delete report" });
  }
});
