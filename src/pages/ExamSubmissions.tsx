import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { ArrowLeft, User, CheckCircle, Clock } from 'lucide-react';

interface Submission {
  _id: string;
  studentId: {
    name: string;
    email: string;
  };
  status: string;
  totalMarks: number;
  feedback: string;
  submittedAt: string;
}

const ExamSubmissions = () => {
  const { examId } = useParams<{ examId: string }>();
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubmissions();
  }, [examId]);

  const fetchSubmissions = async () => {
    try {
      const data = await api.submissions.getExamSubmissions(examId!);
      setSubmissions(data.submissions);
    } catch (error) {
      console.error('Failed to fetch submissions:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <nav className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex items-center space-x-4">
          <button
            onClick={() => navigate('/teacher/dashboard')}
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Dashboard</span>
          </button>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Exam Submissions</h2>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : submissions.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-500 text-lg">No submissions yet</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {submissions.map((submission) => (
              <div key={submission._id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <User className="w-5 h-5 text-blue-600" />
                      <h3 className="text-xl font-bold text-gray-800">{submission.studentId.name}</h3>
                    </div>
                    <p className="text-gray-600 mb-2">{submission.studentId.email}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span>Submitted: {new Date(submission.submittedAt).toLocaleString()}</span>
                      {submission.status === 'graded' ? (
                        <>
                          <span className="flex items-center space-x-1 text-green-600">
                            <CheckCircle className="w-4 h-4" />
                            <span>Graded</span>
                          </span>
                          <span className="font-bold text-blue-600">Score: {submission.totalMarks}</span>
                        </>
                      ) : (
                        <span className="flex items-center space-x-1 text-yellow-600">
                          <Clock className="w-4 h-4" />
                          <span>Pending</span>
                        </span>
                      )}
                    </div>
                    {submission.status === 'graded' && submission.feedback && (
                      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                        <h4 className="font-semibold text-gray-700 mb-2">Feedback:</h4>
                        <p className="text-gray-600 whitespace-pre-wrap">{submission.feedback}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExamSubmissions;
