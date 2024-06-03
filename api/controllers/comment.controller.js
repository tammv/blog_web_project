import Comment from '../models/comment.model.js';

// Create a new comment
export const createComment = async (req, res) => {
  try {
    const newComment = new Comment(req.body);
    const savedComment = await newComment.save();
    res.status(201).json(savedComment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all comments
export const getAllComments = async (req, res) => {
  try {
    const comments = await Comment.find();
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a comment by ID
export const getCommentById = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    res.status(200).json(comment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a comment by ID
export const updateCommentById = async (req, res) => {
  try {
    const updatedComment = await Comment.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updatedComment) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    res.status(200).json(updatedComment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a comment by ID
export const deleteCommentById = async (req, res) => {
  try {
    const deletedComment = await Comment.findByIdAndDelete(req.params.id);
    if (!deletedComment) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
