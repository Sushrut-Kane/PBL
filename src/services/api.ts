const API_BASE_URL = 'http://localhost:5000/api';

export const api = {
  auth: {
    teacherLogin: async (email: string, password: string) => {
      const response = await fetch(`${API_BASE_URL}/auth/teacher/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!response.ok) throw new Error('Login failed');
      return response.json();
    },

    teacherRegister: async (
      name: string,
      email: string,
      password: string,
      sections: string[]
    ) => {
      const response = await fetch(`${API_BASE_URL}/auth/teacher/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, sections }),
      });
      if (!response.ok) throw new Error('Registration failed');
      return response.json();
    },

    studentLogin: async (email: string, password: string) => {
      const response = await fetch(`${API_BASE_URL}/auth/student/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!response.ok) throw new Error('Login failed');
      return response.json();
    },

    studentRegister: async (
      name: string,
      email: string,
      password: string,
      sections: string[]
    ) => {
      const response = await fetch(`${API_BASE_URL}/auth/student/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, sections }),
      });
      if (!response.ok) throw new Error('Registration failed');
      return response.json();
    },
  },

  exams: {
    create: async (formData: FormData) => {
      const response = await fetch(`${API_BASE_URL}/exams/create`, {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) throw new Error('Failed to create exam');
      return response.json();
    },

    getTeacherExams: async (teacherId: string) => {
      const response = await fetch(`${API_BASE_URL}/exams/teacher-exams`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teacherId }),
      });
      if (!response.ok) throw new Error('Failed to fetch exams');
      return response.json();
    },

    getStudentExams: async (sections: string[]) => {
      const response = await fetch(`${API_BASE_URL}/exams/student-exams`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sections }),
      });
      if (!response.ok) throw new Error('Failed to fetch exams');
      return response.json();
    },

    getExam: async (examId: string) => {
      const response = await fetch(`${API_BASE_URL}/exams/${examId}`);
      if (!response.ok) throw new Error('Failed to fetch exam');
      return response.json();
    },

    deleteExam: async (examId: string) => {
      const response = await fetch(`${API_BASE_URL}/exams/${examId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete exam');
      return response.json();
    },
  },

  submissions: {
    submit: async (formData: FormData) => {
      const response = await fetch(`${API_BASE_URL}/submissions/submit`, {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) throw new Error('Failed to submit answer sheet');
      return response.json();
    },

    getStudentSubmissions: async (studentId: string) => {
      const response = await fetch(
        `${API_BASE_URL}/submissions/student-submissions`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ studentId }),
        }
      );
      if (!response.ok) throw new Error('Failed to fetch submissions');
      return response.json();
    },

    getExamSubmissions: async (examId: string) => {
      const response = await fetch(
        `${API_BASE_URL}/submissions/exam-submissions`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ examId }),
        }
      );
      if (!response.ok) throw new Error('Failed to fetch submissions');
      return response.json();
    },

    getSubmission: async (submissionId: string) => {
      const response = await fetch(
        `${API_BASE_URL}/submissions/${submissionId}`
      );
      if (!response.ok) throw new Error('Failed to fetch submission');
      return response.json();
    },
  },
};
