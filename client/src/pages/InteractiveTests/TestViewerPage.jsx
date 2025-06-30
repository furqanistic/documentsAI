import { AnimatePresence, motion } from 'framer-motion'
import {
  AlertCircle,
  BookOpen,
  Calendar,
  CheckCircle,
  Clock,
  FileText,
  Play,
  Shield,
  Target,
  Timer,
  Trophy,
  Users,
  Zap,
} from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import { useParams } from 'react-router-dom'
import { axiosInstance } from '../../../config'

const TestViewerPage = () => {
  const params = useParams()
  const testId = params.id
  const [test, setTest] = useState(null)
  const [questions, setQuestions] = useState([])
  const [answers, setAnswers] = useState({})
  const [timeLeft, setTimeLeft] = useState(0)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [testStarted, setTestStarted] = useState(false)
  const [score, setScore] = useState(null)
  const [loading, setLoading] = useState(true)
  const [answeredCount, setAnsweredCount] = useState(0)

  useEffect(() => {
    loadTest()
  }, [testId])

  useEffect(() => {
    if (
      test &&
      test.interactiveSettings?.timeLimit &&
      !isSubmitted &&
      testStarted
    ) {
      setTimeLeft(test.interactiveSettings.timeLimit * 60)

      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer)
            handleSubmit(true)
            return 0
          }
          return prev - 1
        })
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [test, isSubmitted, testStarted])

  const loadTest = async () => {
    try {
      setLoading(true)
      console.log('Loading test with ID:', testId)

      const response = await axiosInstance.get(`/documents/${testId}`)
      console.log('API Response:', response.data)

      if (response.data.success && response.data.document) {
        const testData = response.data.document
        setTest(testData)

        let cleanContent = testData.content
        cleanContent = cleanContent.replace(/<think>[\s\S]*?<\/think>/g, '')

        const firstQuestionMatch = cleanContent.match(/^(\d+)\./m)
        if (firstQuestionMatch) {
          const firstQuestionIndex = cleanContent.indexOf(firstQuestionMatch[0])
          cleanContent = cleanContent.substring(firstQuestionIndex)
        }

        const parsedQuestions = parseTestContent(cleanContent)
        console.log('Parsed questions:', parsedQuestions)
        setQuestions(parsedQuestions)

        const initialAnswers = {}
        parsedQuestions.forEach((_, index) => {
          initialAnswers[index] = ''
        })
        setAnswers(initialAnswers)
      } else {
        console.error('API returned success=false or no document')
        toast.error('Test not found or inaccessible')
      }
    } catch (error) {
      console.error('Error loading test:', error)

      if (error.response?.status === 404) {
        toast.error('Test not found')
      } else if (error.response?.status === 401) {
        toast.error('You need to be logged in to view this test')
      } else if (error.response?.status === 403) {
        toast.error('You do not have permission to view this test')
      } else {
        toast.error('Failed to load test. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  const parseTestContent = (content) => {
    const lines = content.split('\n').filter((line) => line.trim())
    let questions = []
    let currentQuestion = null
    let questionNumber = 0

    lines.forEach((line) => {
      line = line.trim()

      if (
        line.startsWith('#') ||
        line.startsWith('**') ||
        line.startsWith('---') ||
        line.includes('Organization:') ||
        line.includes('Date:') ||
        line.toLowerCase().includes('quiz') ||
        line.toLowerCase().includes('end of')
      ) {
        return
      }

      const questionMatch = line.match(/^(\d+)\.\s*(.+)/)
      if (questionMatch) {
        if (currentQuestion) {
          questions.push(currentQuestion)
        }
        questionNumber = parseInt(questionMatch[1])
        currentQuestion = {
          number: questionNumber,
          text: questionMatch[2],
          options: [],
          type: 'multiple-choice',
        }
      } else if (line.match(/^[A-D]\.\s*/) && currentQuestion) {
        const optionMatch = line.match(/^([A-D])\.\s*(.+?)(\s*\[CORRECT\])?$/)
        if (optionMatch) {
          currentQuestion.options.push({
            letter: optionMatch[1],
            text: optionMatch[2].trim(),
            isCorrect: !!optionMatch[3],
          })
        }
      } else if (
        currentQuestion &&
        currentQuestion.options.length === 0 &&
        !line.match(/^[A-D]\./) &&
        line.length > 10
      ) {
        currentQuestion.type = 'essay'
        if (
          line.includes('word') ||
          line.includes('paragraph') ||
          line.includes('explain') ||
          line.includes('describe')
        ) {
          currentQuestion.instructions = line
        }
      }
    })

    if (currentQuestion) {
      questions.push(currentQuestion)
    }

    questions = questions.filter(
      (q) =>
        q.text &&
        q.text.length > 5 &&
        (q.type === 'essay' || q.options.length >= 2)
    )

    return questions
  }

  const handleStartTest = () => {
    setTestStarted(true)
  }

  const handleAnswerChange = (questionIndex, answer) => {
    const newAnswers = { ...answers, [questionIndex]: answer }
    setAnswers(newAnswers)

    const answered = Object.values(newAnswers).filter(
      (answer) => answer.trim() !== ''
    ).length
    setAnsweredCount(answered)
  }

  const calculateScore = () => {
    let correct = 0
    let totalMCQ = 0

    questions.forEach((question, index) => {
      if (question.type === 'multiple-choice' && question.options.length > 0) {
        totalMCQ++
        const selectedOption = question.options.find(
          (opt) => opt.letter === answers[index]
        )
        if (selectedOption && selectedOption.isCorrect) {
          correct++
        }
      }
    })

    return totalMCQ > 0 ? Math.round((correct / totalMCQ) * 100) : 0
  }

  const handleSubmit = (autoSubmit = false) => {
    if (!autoSubmit && answeredCount < questions.length) {
      const confirmSubmit = window.confirm(
        `You have not answered all questions (${answeredCount}/${questions.length} completed). Are you sure you want to submit?`
      )
      if (!confirmSubmit) return
    }

    const calculatedScore = calculateScore()
    setScore(calculatedScore)
    setIsSubmitted(true)

    if (autoSubmit) {
      toast.error('Time is up! Test submitted automatically.')
    } else {
      toast.success('Test submitted successfully!')
    }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getTimerColor = () => {
    if (timeLeft <= 300) return 'bg-red-500 text-white'
    if (timeLeft <= 600) return 'bg-orange-500 text-white'
    return 'bg-green-500 text-white'
  }

  if (loading) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='text-center'>
          <div className='w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4'></div>
          <h2 className='text-lg font-semibold text-gray-700 mb-2'>
            Loading Test
          </h2>
          <p className='text-gray-500 text-sm'>
            Please wait while we prepare your assessment...
          </p>
        </div>
      </div>
    )
  }

  if (!test) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center p-4'>
        <div className='text-center bg-white rounded-lg shadow-lg p-8 max-w-md mx-auto border'>
          <FileText className='w-16 h-16 text-gray-400 mx-auto mb-4' />
          <h2 className='text-xl font-bold text-gray-800 mb-3'>
            Test Not Found
          </h2>
          <p className='text-gray-600 text-sm'>
            The test you're looking for doesn't exist or has been removed.
            Please check the link and try again.
          </p>
        </div>
      </div>
    )
  }

  if (!testStarted) {
    return (
      <div className='min-h-screen bg-gray-50'>
        <div className='max-w-4xl mx-auto p-4'>
          <div className='bg-white rounded-lg shadow-lg border p-6 mt-8'>
            {/* Header */}
            <div className='text-center border-b border-gray-200 pb-6 mb-6'>
              <div className='inline-flex items-center bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium mb-3'>
                <BookOpen className='w-4 h-4 mr-2' />
                Assessment Ready
              </div>

              <h1 className='text-2xl font-bold text-gray-800 mb-3'>
                {test.title}
              </h1>

              <p className='text-gray-600 text-sm max-w-2xl mx-auto'>
                {test.metadata?.additionalInfo ||
                  'Complete this assessment to test your knowledge and understanding.'}
              </p>
            </div>

            <div className='grid md:grid-cols-2 gap-6 mb-6'>
              {/* Test Information */}
              <div className='bg-gray-50 rounded-lg p-4'>
                <h3 className='font-semibold text-gray-800 mb-3 flex items-center'>
                  <Target className='w-4 h-4 mr-2 text-blue-600' />
                  Test Information
                </h3>
                <div className='space-y-2 text-sm'>
                  <div className='flex justify-between'>
                    <span className='text-gray-600'>Questions:</span>
                    <span className='text-gray-800 font-medium'>
                      {questions.length}
                    </span>
                  </div>
                  {test.interactiveSettings?.timeLimit && (
                    <div className='flex justify-between'>
                      <span className='text-gray-600'>Time Limit:</span>
                      <span className='text-gray-800 font-medium'>
                        {test.interactiveSettings.timeLimit} minutes
                      </span>
                    </div>
                  )}
                  <div className='flex justify-between'>
                    <span className='text-gray-600'>Passing Score:</span>
                    <span className='text-gray-800 font-medium'>70%</span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-gray-600'>Attempts:</span>
                    <span className='text-gray-800 font-medium'>
                      {test.interactiveSettings?.allowRetry
                        ? 'Multiple'
                        : 'Single'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Guidelines */}
              <div className='bg-gray-50 rounded-lg p-4'>
                <h3 className='font-semibold text-gray-800 mb-3 flex items-center'>
                  <Shield className='w-4 h-4 mr-2 text-green-600' />
                  Guidelines
                </h3>
                <div className='space-y-2 text-sm text-gray-600'>
                  <div className='flex items-start'>
                    <div className='w-1.5 h-1.5 bg-green-500 rounded-full mt-2 mr-2 flex-shrink-0'></div>
                    <span>
                      Read each question carefully before selecting your answer
                    </span>
                  </div>
                  <div className='flex items-start'>
                    <div className='w-1.5 h-1.5 bg-green-500 rounded-full mt-2 mr-2 flex-shrink-0'></div>
                    <span>You can navigate between questions freely</span>
                  </div>
                  <div className='flex items-start'>
                    <div className='w-1.5 h-1.5 bg-green-500 rounded-full mt-2 mr-2 flex-shrink-0'></div>
                    <span>
                      Ensure all questions are answered before submitting
                    </span>
                  </div>
                  <div className='flex items-start'>
                    <div className='w-1.5 h-1.5 bg-green-500 rounded-full mt-2 mr-2 flex-shrink-0'></div>
                    <span>Review your answers before final submission</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Important Notes */}
            <div className='bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6'>
              <h3 className='font-semibold text-orange-800 mb-2 flex items-center'>
                <AlertCircle className='w-4 h-4 mr-2' />
                Important Notes
              </h3>
              <div className='grid md:grid-cols-2 gap-3 text-sm text-orange-700'>
                <div className='space-y-1'>
                  {test.interactiveSettings?.timeLimit && (
                    <div className='flex items-start'>
                      <Clock className='w-3 h-3 mt-0.5 mr-2 flex-shrink-0' />
                      <span>
                        Timer starts immediately when you begin the test
                      </span>
                    </div>
                  )}
                  <div className='flex items-start'>
                    <Zap className='w-3 h-3 mt-0.5 mr-2 flex-shrink-0' />
                    <span>Test will auto-submit if time expires</span>
                  </div>
                </div>
                <div className='space-y-1'>
                  <div className='flex items-start'>
                    <Users className='w-3 h-3 mt-0.5 mr-2 flex-shrink-0' />
                    <span>This is an individual assessment</span>
                  </div>
                  <div className='flex items-start'>
                    <Calendar className='w-3 h-3 mt-0.5 mr-2 flex-shrink-0' />
                    <span>
                      Results will be available immediately after submission
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Question Types Preview */}
            <div className='bg-gray-50 rounded-lg p-4 mb-6'>
              <h3 className='font-semibold text-gray-800 mb-3'>
                Question Types
              </h3>
              <div className='grid grid-cols-2 gap-4 text-sm'>
                {questions.some((q) => q.type === 'multiple-choice') && (
                  <div className='flex items-center text-gray-600'>
                    <div className='w-2 h-2 bg-blue-500 rounded-full mr-2'></div>
                    Multiple Choice
                  </div>
                )}
                {questions.some((q) => q.type === 'essay') && (
                  <div className='flex items-center text-gray-600'>
                    <div className='w-2 h-2 bg-purple-500 rounded-full mr-2'></div>
                    Essay Questions
                  </div>
                )}
              </div>
            </div>

            {/* Start Button */}
            <div className='text-center'>
              <button
                onClick={handleStartTest}
                className='bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold text-lg transition-colors flex items-center mx-auto'
              >
                <Play className='w-5 h-5 mr-2' />
                Start Test
              </button>
              <p className='text-gray-500 text-sm mt-3'>
                Once you start, the timer will begin counting down
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Timer */}
      {test.interactiveSettings?.timeLimit && !isSubmitted && (
        <div
          className={`fixed top-4 right-4 z-50 ${getTimerColor()} px-4 py-2 rounded-lg shadow-lg`}
        >
          <div className='flex items-center space-x-2'>
            <Timer className='w-4 h-4' />
            <div>
              <div className='text-xs opacity-90'>Time Left</div>
              <div className='text-lg font-bold tabular-nums'>
                {formatTime(timeLeft)}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className='max-w-4xl mx-auto p-4'>
        {/* Test Header */}
        <div className='bg-white rounded-lg shadow-lg border p-6 mb-6'>
          <div className='text-center border-b border-gray-200 pb-4 mb-4'>
            <div className='inline-flex items-center bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium mb-2'>
              <BookOpen className='w-3 h-3 mr-1' />
              Assessment in Progress
            </div>

            <h1 className='text-2xl font-bold text-gray-800 mb-2'>
              {test.title}
            </h1>

            <div className='flex flex-wrap justify-center items-center gap-4 text-sm'>
              <div className='flex items-center bg-gray-100 rounded-full px-3 py-1'>
                <Target className='w-4 h-4 text-blue-600 mr-1' />
                <span className='text-gray-700'>
                  {questions.length} Questions
                </span>
              </div>
              {test.interactiveSettings?.timeLimit && (
                <div className='flex items-center bg-gray-100 rounded-full px-3 py-1'>
                  <Clock className='w-4 h-4 text-green-600 mr-1' />
                  <span className='text-gray-700'>
                    {test.interactiveSettings.timeLimit} Min
                  </span>
                </div>
              )}
              <div className='flex items-center bg-gray-100 rounded-full px-3 py-1'>
                <Trophy className='w-4 h-4 text-yellow-600 mr-1' />
                <span className='text-gray-700'>Pass: 70%</span>
              </div>
            </div>
          </div>

          {/* Progress */}
          <div className='mb-4'>
            <div className='flex justify-between items-center mb-2'>
              <span className='text-sm font-medium text-gray-700'>
                Progress
              </span>
              <span className='text-sm text-blue-600 font-medium'>
                {answeredCount}/{questions.length} (
                {Math.round((answeredCount / questions.length) * 100)}%)
              </span>
            </div>
            <div className='w-full bg-gray-200 rounded-full h-2'>
              <div
                className='bg-blue-600 h-2 rounded-full transition-all duration-300'
                style={{
                  width: `${(answeredCount / questions.length) * 100}%`,
                }}
              />
            </div>
          </div>
        </div>

        {/* Questions Section */}
        {!isSubmitted ? (
          <div className='space-y-4'>
            {questions.map((question, index) => (
              <div
                key={index}
                className='bg-white rounded-lg shadow-lg border p-5'
              >
                <div className='flex items-start space-x-3 mb-4'>
                  <div
                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      answers[index] && answers[index].trim() !== ''
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-300 text-gray-600'
                    }`}
                  >
                    {question.number}
                  </div>
                  <div className='flex-1'>
                    <h3 className='text-lg font-medium text-gray-800 mb-3'>
                      {question.text}
                    </h3>

                    {question.instructions && (
                      <div className='bg-orange-50 border border-orange-200 rounded-lg p-3 mb-4'>
                        <div className='flex items-start'>
                          <AlertCircle className='w-4 h-4 text-orange-600 mr-2 mt-0.5 flex-shrink-0' />
                          <p className='text-sm text-orange-800'>
                            {question.instructions}
                          </p>
                        </div>
                      </div>
                    )}

                    {question.type === 'multiple-choice' &&
                    question.options.length > 0 ? (
                      <div className='space-y-2'>
                        {question.options.map((option) => (
                          <label
                            key={option.letter}
                            className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                              answers[index] === option.letter
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                            }`}
                          >
                            <div
                              className={`relative w-5 h-5 rounded-full border-2 mr-3 flex-shrink-0 ${
                                answers[index] === option.letter
                                  ? 'border-blue-500 bg-blue-500'
                                  : 'border-gray-400'
                              }`}
                            >
                              {answers[index] === option.letter && (
                                <div className='absolute inset-1 bg-white rounded-full' />
                              )}
                              <input
                                type='radio'
                                name={`question_${index}`}
                                value={option.letter}
                                checked={answers[index] === option.letter}
                                onChange={(e) =>
                                  handleAnswerChange(index, e.target.value)
                                }
                                className='sr-only'
                              />
                            </div>
                            <span className='text-gray-800 text-sm'>
                              <span className='font-medium text-blue-600 mr-2'>
                                {option.letter}.
                              </span>
                              {option.text}
                            </span>
                          </label>
                        ))}
                      </div>
                    ) : (
                      <div className='relative'>
                        <textarea
                          placeholder='Type your detailed answer here...'
                          rows={5}
                          value={answers[index] || ''}
                          onChange={(e) =>
                            handleAnswerChange(index, e.target.value)
                          }
                          className='w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none text-gray-800 placeholder-gray-500'
                        />
                        <div className='absolute bottom-3 right-3 text-xs text-gray-500'>
                          {answers[index]?.length || 0} characters
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Submit Button */}
            <div className='text-center pt-6'>
              <button
                onClick={() => handleSubmit()}
                className='bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors'
              >
                Submit Test
              </button>
              <p className='text-gray-500 text-sm mt-2'>
                Review your answers before submitting
              </p>
            </div>
          </div>
        ) : (
          /* Results */
          <div className='bg-white rounded-lg shadow-lg border p-8 text-center'>
            <div className='mb-6'>
              {score >= 70 ? (
                <CheckCircle className='w-16 h-16 text-green-600 mx-auto mb-4' />
              ) : (
                <AlertCircle className='w-16 h-16 text-red-600 mx-auto mb-4' />
              )}

              <h2 className='text-2xl font-bold text-gray-800 mb-3'>
                Test Completed!
              </h2>

              <div
                className={`text-5xl font-black mb-4 ${
                  score >= 70 ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {score}%
              </div>

              <div
                className={`inline-flex items-center px-4 py-2 rounded-full font-semibold mb-4 ${
                  score >= 70
                    ? 'bg-green-100 text-green-800 border border-green-300'
                    : 'bg-red-100 text-red-800 border border-red-300'
                }`}
              >
                <Trophy className='w-4 h-4 mr-2' />
                {score >= 70 ? 'Passed' : 'Needs Improvement'}
              </div>

              <p className='text-gray-600 mb-6'>
                You scored {score >= 70 ? 'above' : 'below'} the passing
                threshold of 70%
              </p>

              {score >= 70 ? (
                <div className='bg-green-50 border border-green-200 rounded-lg p-6 mb-6'>
                  <div className='text-4xl mb-3'>🎉</div>
                  <h3 className='text-xl font-bold text-green-800 mb-2'>
                    Congratulations!
                  </h3>
                  <p className='text-green-700'>
                    You have successfully passed this assessment!
                  </p>
                </div>
              ) : (
                <div className='bg-red-50 border border-red-200 rounded-lg p-6 mb-6'>
                  <div className='text-4xl mb-3'>📚</div>
                  <h3 className='text-xl font-bold text-red-800 mb-2'>
                    Keep Learning!
                  </h3>
                  <p className='text-red-700'>
                    Review the material and try again when you're ready.
                  </p>
                </div>
              )}

              {test.interactiveSettings?.allowRetry && score < 70 && (
                <button
                  onClick={() => window.location.reload()}
                  className='bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors'
                >
                  Retake Test
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default TestViewerPage
