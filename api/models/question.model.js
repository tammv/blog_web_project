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
    correctAnswerIndex: [{
        type: Number,
        required: true,
        min: 0,
        validate: {
          validator: (value) => {
            const uniqueSet = new Set(value); // Create a Set for unique values
            return uniqueSet.size === value.length; // Check if set size matches array length
          },
          message: "correctAnswerIndex must contain unique values",
        },
    }]
  },
  { timestamps: true }
);

const Question = mongoose.model("Question", questionScheme);

export default Question;
