import mongoose from "mongoose";

const questionScheme = new mongoose.Schema(
  {
    text:{
      type: String,
      required: true
    },
    options: [{
      type: String,
      required: true
    }],
    level:{
      type: String,
      require: false,
      default: "easy"
    },
    correctAnswerIndex: {
      type: [Number],
      required: true,
      validate: {
        validator: (value) => {
          const uniqueSet = new Set(value);
          return uniqueSet.size === value.length;
        },
        message: "correctAnswerIndex must contain unique values",
      },
    },
  },
  { timestamps: true }
);

const Question = mongoose.model("Question", questionScheme);

export default Question;