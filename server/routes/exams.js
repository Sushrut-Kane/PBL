import express from "express";
import Exam from "../models/Exam.js";
import Submission from "../models/Submission.js";
import upload from "../middleware/upload.js";
import { processOCR } from "../utils/ocrProcessor.js";

const router = express.Router();


router.post("/create", upload.single("answerKeyPdf"), async (req, res) => {
  try {
    const { title, teacherId, section, maxMarks } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Answer key PDF is required" });
    }

    const answerKeyText = await processOCR(req.file.path);

    const exam = new Exam({
      title,
      teacherId,
      section,
      answerKeyText,
      maxMarks: maxMarks || 100
    });

    await exam.save();

    res.status(201).json({
      message: "Exam created successfully",
      exam: {
        id: exam._id,
        title: exam.title,
        section: exam.section,
        maxMarks: exam.maxMarks,
        createdAt: exam.createdAt
      }
    });
  } catch (error) {
    console.error("Exam creation error:", error);
    res.status(500).json({
      message: "Failed to create exam",
      error: error.message
    });
  }
});


router.post("/teacher-exams", async (req, res) => {
  try {
    const { teacherId } = req.body;

    const exams = await Exam.find({ teacherId }).sort({ createdAt: -1 });

    res.json({ exams });
  } catch (error) {
    console.error("Fetch teacher exams error:", error);
    res.status(500).json({ message: "Failed to fetch exams" });
  }
});


router.post("/student-exams", async (req, res) => {
  try {
    let { sections } = req.body;

    console.log("Student exams request body:", req.body);


    if (!sections) {
      console.warn("No sections provided. Returning all exams (demo mode).");
      const exams = await Exam.find({}).sort({ createdAt: -1 });
      return res.json({ exams });
    }


    if (!Array.isArray(sections)) {
      sections = [sections];
    }

    const exams = await Exam.find({
      section: { $in: sections }
    }).sort({ createdAt: -1 });

    console.log("Exams found for student:", exams.length);


    if (exams.length === 0) {
      console.warn("No exams matched section. Returning all exams (demo mode).");
      const allExams = await Exam.find({}).sort({ createdAt: -1 });
      return res.json({ exams: allExams });
    }

    res.json({ exams });
  } catch (error) {
    console.error("Fetch student exams error:", error);
    res.status(500).json({ message: "Failed to fetch exams" });
  }
});


router.get("/:examId", async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.examId);

    if (!exam) {
      return res.status(404).json({ message: "Exam not found" });
    }

    res.json({ exam });
  } catch (error) {
    console.error("Fetch exam error:", error);
    res.status(500).json({ message: "Failed to fetch exam" });
  }
});


router.delete("/:examId", async (req, res) => {
  try {
    const exam = await Exam.findByIdAndDelete(req.params.examId);

    if (!exam) {
      return res.status(404).json({ message: "Exam not found" });
    }

    await Submission.deleteMany({ examId: req.params.examId });

    res.json({ message: "Exam deleted successfully" });
  } catch (error) {
    console.error("Delete exam error:", error);
    res.status(500).json({ message: "Failed to delete exam" });
  }
});

export default router;
