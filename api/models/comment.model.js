import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema(
  {
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Post'
    },
    numberOfLike: {
        type: Number,
        default: 0,
    },
    content: {
      type: String,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
  }, { timestamps: true }
);

const Comment = mongoose.model('Comment', commentSchema);

export default Comment;