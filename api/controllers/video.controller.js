import Video from "../models/video.model.js";
import { errorHandler } from "../utils/error.js";

// Create a new video
export const createVideo = async (req, res, next) => {
  if (!req.user) {
    return next(errorHandler(403, "You are not allowed to create a video"));
  }
  if (!req.body.title || !req.body.content) {
    return next(errorHandler(400, "Please provide all required fields"));
  }
  const newVideo = new Video({
    ...req.body,
    userId: req.user.id,
  });
  try {
    const savedVideo = await newVideo.save();
    res.status(201).json(savedVideo);
  } catch (error) {
    next(error);
  }
};

// Get videos
export const getVideos = async (req, res, next) => {
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.order === "asc" ? 1 : -1;

    const queryOptions = {};

    if (req.query.userId) {
      queryOptions.userId = req.query.userId;
    }
    if (req.query.searchTerm) {
      queryOptions.$or = [
        { title: { $regex: req.query.searchTerm, $options: "i" } },
        { content: { $regex: req.query.searchTerm, $options: "i" } },
      ];
    }
    const videosQuery = Video.find(queryOptions)
      .populate("userId", "username email") // Populate the 'userId' field with 'username' and 'email'
      .sort({ updatedAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const totalVideosQuery = Video.countDocuments(queryOptions);

    const [videos, totalVideos] = await Promise.all([
      videosQuery.exec(),
      totalVideosQuery.exec(),
    ]);

    res.status(200).json({
      videos,
      totalVideos,
    });
  } catch (error) {
    next(error);
  }
};

export const getVideoById = async (req, res, next) => {
  try {
    const video = await Video.findById(req.params.videoId).populate("userId", "username email");
    console.log(video);
    if (!video) {
      return next(errorHandler(404, "Video not found"));
    }
    res.status(200).json(video);
  } catch (error) {
    next(error);
  }
};

// Delete a video
export const deleteVideo = async (req, res, next) => {
  if (req.user.id !== req.params.userId) {
    return next(errorHandler(403, "You are not allowed to delete this video"));
  }
  try {
    await Video.findByIdAndDelete(req.params.videoId);
    res.status(200).json("The video has been deleted");
  } catch (error) {
    next(error);
  }
};

// Update a video
export const updateVideo = async (req, res, next) => {
  if (req.user.id !== req.params.userId) {
    return next(errorHandler(403, "You are not allowed to update this video"));
  }
  console.log(req.body);
  try {
    const updatedVideo = await Video.findByIdAndUpdate(
      req.params.videoId,
      {
        $set: {
          title: req.body.title,
          content: req.body.content,
          url: req.body.url,
          img: req.body.img,
        },
      },
      { new: true }
    );
    res.status(200).json(updatedVideo);
  } catch (error) {
    next(error);
  }
};
