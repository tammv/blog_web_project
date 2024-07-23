import Comment from "../models/comment.model.js";

export const createComment = async (req, res, next) => {
  try {
    const { content, postId, userId } = req.body;

    if (userId !== req.user.id) {
      return next(errorHandler(403, "You are not allowed to create this comment"));
    }

    const newComment = new Comment({
      content,
      postId,
      userId,
    });
    await newComment.save();

    res.status(200).json(newComment);
  } catch (error) {
    next(error);
  }
};

export const getPostComments = async (req, res, next) => {
  try {
    const comments = await Comment.find({ postId: req.params.postId }).sort({
      createdAt: -1,
    });
    res.status(200).json(comments);
  } catch (error) {
    next(error);
  }
};

export const likeComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return next(errorHandler(404, "Comment not found"));
    }
    const userIndex = comment.likes.indexOf(req.user.id);
    if (userIndex === -1) {
      comment.numberOfLikes += 1;
      comment.likes.push(req.user.id);
    } else {
      comment.numberOfLikes -= 1;
      comment.likes.splice(userIndex, 1);
    }
    await comment.save();
    res.status(200).json(comment);
  } catch (error) {
    next(error);
  }
};

export const editComment = async (req, res, next) => {
  try {
    // Find the comment by ID
    const comment = await Comment.findById(req.params.commentId);

    // Check if comment exists
    if (!comment) {
      return next(errorHandler(404, "Comment not found"));
    }

    // Check if the user is the owner of the comment
    if (comment.userId.toString() !== req.user.id.toString()) {
      return next(errorHandler(403, "You are not allowed to edit this comment"));
    }

    // Update the comment's content
    comment.content = req.body.content;
    const updatedComment = await comment.save();

    // Send the updated comment back to the client
    res.status(200).json(updatedComment);
  } catch (error) {
    next(error);
  }
};
export const deleteComment = async (req, res, next) => {
  try {
    // Validate the comment ID to ensure it's a valid MongoDB ObjectId
    if (!req.params.commentId.match(/^[0-9a-fA-F]{24}$/)) {
      // return next(errorHandler(400, "Invalid comment ID"));
      return res.status(400).json({ message: "Invalid comment ID" });
    }

    // Find the comment by ID
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      // return next(errorHandler(404, "Comment not found"));
      return res.status(404).json({ message: "Comment not found" });
    }

    // Check if the user is authorized to delete this comment
    // if (comment.userId.toString() !== req.user.id.toString()) {
    //   // return next(errorHandler(403, "You are not allowed to delete this comment"));
    //   return res.status(403).json({ message: "You are not allowed to delete this comment" });
    // }

    // Delete the comment using deleteOne
    await Comment.deleteOne({ _id: req.params.commentId });

    // Respond with a success message
    res.status(200).json({ message: "Comment has been deleted" });
  } catch (error) {
    // Handle any errors
    next(error);
  }
};

export const getcomments = async (req, res, next) => {
  if (!req.user.isAdmin) return next(errorHandler(403, "You are not allowed to get all comments"));
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.sort === "desc" ? -1 : 1;
    const comments = await Comment.find().sort({ createdAt: sortDirection }).skip(startIndex).limit(limit);
    const totalComments = await Comment.countDocuments();
    const now = new Date();
    const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    const lastMonthComments = await Comment.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });
    res.status(200).json({ comments, totalComments, lastMonthComments });
  } catch (error) {
    next(error);
  }
};
