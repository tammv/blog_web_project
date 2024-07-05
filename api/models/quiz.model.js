import mongoose from "mongoose";

const quizScheme = new mongoose.Schema(
    {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: false,
        },
        topicID: {
          type: String,
          ref: "Topic",
          required: true,
          validate: {
            validator: function (v) {
              return mongoose.Types.ObjectId.isValid(v);
            },
            message: (props) => `${props.value} is not a valid topic ID!`,
          },
        },
        title:{
            type: String,
            required: true
        },
        description:{
            type: String,
            default: ""
        },
        questions:[{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Question",
            default: []
        }],
    }, { timestamps: true }
);

const Quiz = mongoose.model("Quiz", quizScheme);

export default Quiz;