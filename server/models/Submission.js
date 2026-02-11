import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    examId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exam",
      required: true
    },

    studentAnswersText: {
      type: String,
      required: true
    },

    status: {
      type: String,
      enum: ["pending", "graded"],
      default: "pending"
    },

 
    totalMarks: {
      type: Number,
      default: 0
    },


    maxMarks: {
      type: Number,
      default: 0
    },

 
    breakdown: [
      {
        questionNo: {
          type: String
        },
        marks: {
          type: Number
        },
        maxMarks: {
          type: Number
        },
        feedback: {
          type: String
        }
      }
    ],

    feedback: {
      type: String,
      default: ""
    },

    gradedAt: {
      type: Date
    },

    submittedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

const Submission = mongoose.model("Submission", submissionSchema);

export default Submission;
