import mongoose from 'mongoose';

const topicSchema = new mongoose.Schema(
  {
    nameOfTopic: {
      type: String,
      required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
  }, { timestamps: true }
);

const Topic = mongoose.model('Topic', topicSchema);

export default Topic;