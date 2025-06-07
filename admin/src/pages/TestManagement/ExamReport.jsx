import { motion } from 'framer-motion'
import {
  AlertCircle,
  BookOpen,
  Calendar,
  CheckCircle,
  Clock,
  Download,
  Share2,
  Timer,
  User,
  XCircle,
} from 'lucide-react'
import React from 'react'
import DashboardLayout from '../Layout/DashboardLayout'

// Reusable Card Component
const Card = ({ children, className = '', ...props }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    className={`bg-white rounded-lg border border-gray-200 ${className}`}
    {...props}
  >
    {children}
  </motion.div>
)

// Student Info Header Component
const StudentInfoHeader = ({ student, exam }) => (
  <Card className='p-6 mb-6'>
    <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4'>
      <div className='flex items-start gap-4'>
        <div>
          <h2 className='text-xl font-semibold text-gray-900'>
            {student.name}
          </h2>
          <p className='text-gray-600'>{student.email}</p>
          <div className='flex items-center gap-4 mt-2 text-sm text-gray-500'>
            <span className='flex items-center gap-1'>
              <Calendar className='w-4 h-4' />
              {exam.submittedAt}
            </span>
            <span className='flex items-center gap-1'>
              <Timer className='w-4 h-4' />
              {exam.timeSpent}
            </span>
          </div>
        </div>
      </div>

      <div className='flex flex-col sm:flex-row gap-3'>
        <button className='flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium min-w-[120px]'>
          <Share2 className='w-4 h-4' />
          Share Report
        </button>
        <button className='flex items-center justify-center gap-2 px-4 py-2.5 border border-transparent bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium min-w-[120px]'>
          <Download className='w-4 h-4' />
          Download PDF
        </button>
      </div>
    </div>
  </Card>
)

// Score Overview Component
const ScoreOverview = ({
  score,
  totalQuestions,
  correctAnswers,
  incorrectAnswers,
  skippedAnswers,
}) => (
  <div className='grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6'>
    <Card className='p-4 sm:p-6 text-center'>
      <div className='text-2xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2'>
        {score}%
      </div>
      <div className='text-gray-600 text-xs sm:text-sm'>Overall Score</div>
    </Card>

    <Card className='p-4 sm:p-6 text-center'>
      <div className='flex items-center justify-center mb-1 sm:mb-2'>
        <span className='text-2xl sm:text-3xl font-bold text-gray-900'>
          {correctAnswers}
        </span>
      </div>
      <div className='text-gray-600 text-xs sm:text-sm'>Correct Answers</div>
    </Card>

    <Card className='p-4 sm:p-6 text-center'>
      <div className='flex items-center justify-center mb-1 sm:mb-2'>
        <span className='text-2xl sm:text-3xl font-bold text-gray-900'>
          {incorrectAnswers}
        </span>
      </div>
      <div className='text-gray-600 text-xs sm:text-sm'>Incorrect Answers</div>
    </Card>

    <Card className='p-4 sm:p-6 text-center'>
      <div className='flex items-center justify-center mb-1 sm:mb-2'>
        <span className='text-2xl sm:text-3xl font-bold text-gray-900'>
          {skippedAnswers}
        </span>
      </div>
      <div className='text-gray-600 text-xs sm:text-sm'>Skipped Questions</div>
    </Card>
  </div>
)

// Question Answer Component
const QuestionAnswer = ({ question, index }) => {
  const getStatusIcon = (isCorrect, wasSkipped) => {
    if (wasSkipped) return <AlertCircle className='w-5 h-5 text-gray-400' />
    return isCorrect ? (
      <CheckCircle className='w-5 h-5 text-green-500' />
    ) : (
      <XCircle className='w-5 h-5 text-red-500' />
    )
  }

  const getBorderColor = (isCorrect, wasSkipped) => {
    if (wasSkipped) return 'border-gray-200'
    return isCorrect ? 'border-green-200' : 'border-red-200'
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <Card
        className={`p-6 mb-4 ${getBorderColor(
          question.isCorrect,
          question.wasSkipped
        )}`}
      >
        <div>
          <div className='flex items-center justify-between mb-3'>
            <div className='flex items-center gap-2'>
              <h3 className='font-medium text-gray-900'>
                Question {index + 1}
              </h3>
              <span className='text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded'>
                {question.type}
              </span>
            </div>
            <div className='flex-shrink-0'>
              {getStatusIcon(question.isCorrect, question.wasSkipped)}
            </div>
          </div>

          <div className='mb-4'>
            <p className='text-gray-800 mb-3'>{question.text}</p>

            {question.type === 'multiple-choice' && (
              <div className='space-y-2'>
                {question.options.map((option, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded border ${
                      option.isCorrect
                        ? 'bg-green-50 border-green-200 text-green-800'
                        : option.isSelected
                        ? 'bg-red-50 border-red-200 text-red-800'
                        : 'bg-gray-50 border-gray-200 text-gray-700'
                    }`}
                  >
                    <div className='flex items-center gap-2'>
                      <span className='font-medium text-sm'>
                        {String.fromCharCode(65 + idx)}.
                      </span>
                      <span>{option.text}</span>
                      {option.isCorrect && (
                        <CheckCircle className='w-4 h-4 text-green-500 ml-auto' />
                      )}
                      {option.isSelected && !option.isCorrect && (
                        <XCircle className='w-4 h-4 text-red-500 ml-auto' />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {question.type === 'short-answer' && (
              <div className='space-y-3'>
                <div>
                  <label className='text-sm font-medium text-gray-700 block mb-1'>
                    Student's Answer:
                  </label>
                  <div
                    className={`p-3 rounded border ${
                      question.isCorrect
                        ? 'bg-green-50 border-green-200'
                        : question.wasSkipped
                        ? 'bg-gray-50 border-gray-200'
                        : 'bg-red-50 border-red-200'
                    }`}
                  >
                    {question.studentAnswer || 'No answer provided'}
                  </div>
                </div>
                <div>
                  <label className='text-sm font-medium text-gray-700 block mb-1'>
                    Correct Answer:
                  </label>
                  <div className='p-3 rounded border bg-green-50 border-green-200'>
                    {question.correctAnswer}
                  </div>
                </div>
              </div>
            )}
          </div>

          {question.explanation && (
            <div className='bg-blue-50 border border-blue-200 rounded p-3 mt-4'>
              <h4 className='text-sm font-medium text-blue-900 mb-1'>
                Explanation:
              </h4>
              <p className='text-sm text-blue-800'>{question.explanation}</p>
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  )
}

// Minimal Table Style Exam Info Component
const ExamInfo = ({ exam }) => (
  <div className='mb-6'>
    <div className='bg-black rounded-t-lg text-white text-xs font-bold px-3 py-2 uppercase tracking-wide'>
      Exam Information
    </div>
    <div className='border border-black rounded-b-lg border-t-0'>
      <div className='grid grid-cols-3'>
        <div className='border-r border-black p-3 text-center'>
          <div className='text-xs text-gray-500 mb-1'>TITLE</div>
          <div className='text-sm font-medium text-black'>{exam.title}</div>
        </div>
        <div className='border-r border-black p-3 text-center'>
          <div className='text-xs text-gray-500 mb-1'>SUBJECT</div>
          <div className='text-sm font-medium text-black'>{exam.subject}</div>
        </div>
        <div className='p-3 text-center'>
          <div className='text-xs text-gray-500 mb-1'>DURATION</div>
          <div className='text-sm font-medium text-black'>{exam.duration}</div>
        </div>
      </div>
    </div>
  </div>
)

// Main Exam Report Component
const ExamReport = () => {
  // Mock data - in real app this would come from props or API
  const examData = {
    student: {
      name: 'Sarah Johnson',
      email: 'sarah.johnson@university.edu',
    },
    exam: {
      title: ' Math Quiz-1',
      subject: 'Mathematics',
      duration: '60 minutes',
      submittedAt: 'Dec 15, 2024 · 3:45 PM',
      timeSpent: '45 minutes',
    },
    score: 85,
    totalQuestions: 10,
    correctAnswers: 8,
    incorrectAnswers: 1,
    skippedAnswers: 1,
    questions: [
      {
        type: 'multiple-choice',
        text: 'What is the derivative of f(x) = x² + 3x - 2?',
        options: [
          { text: '2x + 3', isCorrect: true, isSelected: true },
          { text: 'x² + 3', isCorrect: false, isSelected: false },
          { text: '2x - 2', isCorrect: false, isSelected: false },
          { text: 'x + 3x', isCorrect: false, isSelected: false },
        ],
        isCorrect: true,
        wasSkipped: false,
        explanation:
          'The derivative of x² is 2x, the derivative of 3x is 3, and the derivative of a constant is 0.',
      },
      {
        type: 'short-answer',
        text: 'Solve for x: 2x + 5 = 13',
        studentAnswer: 'x = 4',
        correctAnswer: 'x = 4',
        isCorrect: true,
        wasSkipped: false,
        explanation:
          'Subtract 5 from both sides: 2x = 8, then divide by 2: x = 4',
      },
      {
        type: 'multiple-choice',
        text: 'What is the area of a circle with radius 5?',
        options: [
          { text: '25π', isCorrect: true, isSelected: false },
          { text: '10π', isCorrect: false, isSelected: true },
          { text: '5π', isCorrect: false, isSelected: false },
          { text: 'π', isCorrect: false, isSelected: false },
        ],
        isCorrect: false,
        wasSkipped: false,
        explanation: 'Area of a circle = πr². With r = 5, area = π(5)² = 25π',
      },
      {
        type: 'short-answer',
        text: 'What is the slope of the line y = 3x + 7?',
        studentAnswer: '',
        correctAnswer: '3',
        isCorrect: false,
        wasSkipped: true,
        explanation:
          'In the equation y = mx + b, m represents the slope. Here, m = 3.',
      },
    ],
  }

  return (
    <DashboardLayout>
      <div className='w-full'>
        {/* Student Info Header */}
        <StudentInfoHeader student={examData.student} exam={examData.exam} />

        {/* Exam Information */}
        <ExamInfo exam={examData.exam} />

        {/* Score Overview */}
        <ScoreOverview
          score={examData.score}
          totalQuestions={examData.totalQuestions}
          correctAnswers={examData.correctAnswers}
          incorrectAnswers={examData.incorrectAnswers}
          skippedAnswers={examData.skippedAnswers}
        />

        {/* Questions and Answers */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className='space-y-4'>
            {examData.questions.map((question, index) => (
              <QuestionAnswer key={index} question={question} index={index} />
            ))}
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  )
}

export default ExamReport
