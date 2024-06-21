import mongoose from "mongoose";

const topicSchema = new mongoose.Schema(
  {
    nameOfTopic: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
      ref: "User",
    },
    followers: {
      type: [mongoose.Schema.Types.ObjectId], // Mảng chứa nhiều ObjectId của những người dùng đã follow
      ref: "User",
      default: []
    },
  },
  { timestamps: true }
);

const Topic = mongoose.model("Topic", topicSchema);

export default Topic;
