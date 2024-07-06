import SavePost from "../models/savePost.model.js"; // Import model savePost
import { errorHandler } from "../utils/error.js";

export const savePost = async (req, res, next) => {
    const { postId, userId } = req.body;

    if (!postId || !userId) {
        return next(errorHandler(400, "Missing postId or userId"));
    }

    try {
        const newSavePost = new SavePost({
            postId,
            userId,
        });

        const savedPost = await newSavePost.save();
        res.status(201).json(savedPost);
    } catch (error) {
        next(error);
    }
};

export const getSavedPosts = async (req, res, next) => {
    const { userId } = req.params;

    if (!userId) {
        return next(errorHandler(400, "Missing userId"));
    }

    try {
        const savedPosts = await SavePost.find({ userId }).populate({
            path: 'postId',
            populate: {
                path: 'topicID',
                model: 'Topic',
                select: 'nameOfTopic'
            }
        });
        res.status(200).json(savedPosts);
    } catch (error) {
        next(error);
    }
};

export const getAllSavePost = async (req, res, next) => {
    try {
        const allSavedPosts = await SavePost.find().populate({
            path: 'postId userId',
            populate: {
                path: 'topicID',
                model: 'Topic',
                select: 'nameOfTopic'
            }
        });
        res.status(200).json(allSavedPosts);
    } catch (error) {
        next(error);
    }
};

export const removeSavedPost = async (req, res, next) => {
    try {
      await SavePost.findByIdAndDelete(req.params.savePostId);
      res.status(200).json("The saved post has been deleted");
    } catch (error) {
      next(error);
    }
};
