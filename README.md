# AI Grader - Full Stack Application

A full-stack MERN application for AI-powered evaluation of handwritten answer sheets using OCR and the Gemini API.

## Features

- **Teacher Portal**: Create exams, upload answer keys, and review student submissions
- **Student Portal**: Submit answer sheets and receive AI-powered grading and feedback
- **OCR Processing**: Extract text from PDF answer sheets using Python OCR
- **AI Grading**: Automatic grading using Google's Gemini API
- **Real-time Updates**: Instant grading results and feedback

## Tech Stack

### Frontend
- React 18 with TypeScript
- React Router for navigation
- Tailwind CSS for styling
- Context API for state management
- Lucide React for icons

### Backend
- Node.js with Express
- MongoDB with Mongoose
- Multer for file uploads
- Python OCR script for text extraction

### AI & OCR
- Google Gemini API for grading
- Python with pytesseract for OCR
- pdf2image for PDF processing

## Project Structure

```
project/
├── src/                      # React frontend
│   ├── contexts/            # React Context (Auth)
│   ├── pages/               # Page components
│   ├── services/            # API services
│   └── App.tsx              # Main app component
├── server/                   # Node.js backend
│   ├── models/              # MongoDB schemas
│   ├── routes/              # API routes
│   ├── middleware/          # Express middleware
│   ├── scripts/             # Python OCR script
│   ├── utils/               # Utility functions
│   └── server.js            # Express server
└── README.md
```


## License

This project is created for educational purposes.
