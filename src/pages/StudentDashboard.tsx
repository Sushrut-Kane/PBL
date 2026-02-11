import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { LogOut, Upload } from "lucide-react";

interface Exam {
  _id: string;
  title: string;
  section: string;
  maxMarks: number;
  createdAt: string;
}

interface BreakdownItem {
  questionNo: string;
  marks: number;
  maxMarks: number;
  feedback: string;
}

interface Submission {
  _id: string;
  examId: {
    title: string;
    section: string;
    maxMarks: number;
  };
  status: string;
  totalMarks: number;
  submittedAt: string;
  breakdown?: BreakdownItem[];
}

const StudentDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [exams, setExams] = useState<Exam[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"exams" | "submissions">("exams");
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);

  useEffect(() => {
    if (!user || user.role !== "student") {
      navigate("/student/login");
      return;
    }
    fetchData();
  }, [user, navigate]);

  const fetchData = async () => {
    try {
      setLoading(true);

      const examsData = await api.exams.getStudentExams(user!.sections ?? []);
      setExams(examsData.exams || []);

      try {
        const submissionsData = await api.submissions.getStudentSubmissions(
          user!.id
        );
        setSubmissions(submissionsData.submissions || []);
      } catch {
        setSubmissions([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-blue-50">
      <nav className="bg-white shadow">
        <div className="container mx-auto px-6 py-4 flex justify-between">
          <h1 className="text-2xl font-bold text-blue-600">GradeMate</h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-8">
        <h2 className="text-3xl font-bold mb-4">Hi {user?.name}!</h2>

        <div className="mb-6 flex gap-4">
          <button
            onClick={() => setActiveTab("exams")}
            className={`px-5 py-2 rounded ${
              activeTab === "exams"
                ? "bg-blue-600 text-white"
                : "bg-white"
            }`}
          >
            Available Exams
          </button>

          <button
            onClick={() => setActiveTab("submissions")}
            className={`px-5 py-2 rounded ${
              activeTab === "submissions"
                ? "bg-blue-600 text-white"
                : "bg-white"
            }`}
          >
            My Submissions
          </button>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : activeTab === "exams" ? (
          exams.length === 0 ? (
            <p>No exams available</p>
          ) : (
            exams.map((exam) => (
              <div
                key={exam._id}
                className="bg-white p-6 rounded shadow mb-4 flex justify-between"
              >
                <div>
                  <h3 className="text-xl font-bold">{exam.title}</h3>
                  <p className="text-sm text-gray-600">
                    Section: {exam.section} | Max Marks: {exam.maxMarks}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedExam(exam)}
                  className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2"
                >
                  <Upload size={16} />
                  Submit
                </button>
              </div>
            ))
          )
        ) : submissions.length === 0 ? (
          <p>No submissions yet</p>
        ) : (
          submissions.map((submission) => (
            <div
              key={submission._id}
              className="bg-white p-6 rounded shadow mb-6"
            >
              <h3 className="text-xl font-bold">
                {submission.examId.title}
              </h3>
              <p className="text-sm text-gray-600">
                Submitted:{" "}
                {new Date(submission.submittedAt).toLocaleString()}
              </p>

              <p className="mt-2 font-semibold text-green-600">
                Score: {submission.totalMarks} /{" "}
                {submission.examId.maxMarks}
              </p>

              {/* ✅ QUESTION-WISE FEEDBACK */}
              {submission.breakdown && (
                <div className="mt-4 border-t pt-4">
                  <h4 className="font-semibold mb-2">
                    Question-wise Feedback
                  </h4>

                  {submission.breakdown.map((q, idx) => (
                    <div
                      key={idx}
                      className="bg-gray-50 p-3 rounded mb-2"
                    >
                      <div className="flex justify-between font-medium">
                        <span>{q.questionNo}</span>
                        <span>
                          {q.marks} / {q.maxMarks}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {q.feedback}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {selectedExam && (
        <SubmitAnswerModal
          exam={selectedExam}
          studentId={user!.id}
          onClose={() => setSelectedExam(null)}
          onSuccess={() => {
            setSelectedExam(null);
            fetchData();
          }}
        />
      )}
    </div>
  );
};

interface SubmitAnswerModalProps {
  exam: Exam;
  studentId: string;
  onClose: () => void;
  onSuccess: () => void;
}

const SubmitAnswerModal = ({
  exam,
  studentId,
  onClose,
  onSuccess,
}: SubmitAnswerModalProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("studentId", studentId);
    formData.append("examId", exam._id);
    formData.append("answerSheetPdf", file);

    await api.submissions.submit(formData);
    onSuccess();
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded w-96">
        <h3 className="text-lg font-bold mb-4">{exam.title}</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="file"
            accept=".pdf"
            required
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
          <div className="mt-4 flex justify-end gap-2">
            <button type="button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" disabled={loading}>
              {loading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentDashboard;
