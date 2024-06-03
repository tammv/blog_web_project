import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema(
  {
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Post'
    },
    content: {
        type: String,
      }
  }, { timestamps: true }
);

const Report = mongoose.model('Report', reportSchema);

export default Report;