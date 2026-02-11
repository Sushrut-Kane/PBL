import mongoose from 'mongoose';

const examSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  answerKeyText: {
    type: String,
    required: true
  },
  section: {
    type: String,
    required: true,
    trim: true
  },
  maxMarks: {
    type: Number,
    default: 100
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

const Exam = mongoose.model('Exam', examSchema);

export default Exam;
