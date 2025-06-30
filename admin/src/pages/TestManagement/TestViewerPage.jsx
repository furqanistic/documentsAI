import { AnimatePresence, motion } from 'framer-motion'
import {
  AlertCircle,
  BookOpen,
  CheckCircle,
  Clock,
  FileText,
  Target,
  Timer,
  Trophy,
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
  const [score, setScore] = useState(null)
  const [loading, setLoading] = useState(true)
  const [answeredCount, setAnsweredCount] = useState(0)

  useEffect(() => {
    loadTest()
  }, [testId])

  useEffect(() => {
    if (test && test.interactiveSettings?.timeLimit && !isSubmitted) {
      setTimeLeft(test.interactiveSettings.timeLimit * 60)

      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer)
            handleSubmit(true) // Auto-submit when time runs out
            return 0
          }
          return prev - 1
        })
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [test, isSubmitted])

  const loadTest = async () => {
    try {
      setLoading(true)
      console.log('Loading test with ID:', testId)

      const response = await axiosInstance.get(`/documents/${testId}`)
      console.log('API Response:', response.data)

      if (response.data.success && response.data.document) {
        const testData = response.data.document
        setTest(testData)

        // Clean the content by removing any <think> tags and extra headers
        let cleanContent = testData.content

        // Remove <think> blocks
        cleanContent = cleanContent.replace(/<think>[\s\S]*?<\/think>/g, '')

        // Remove the header metadata section (everything before the first question)
        const firstQuestionMatch = cleanContent.match(/^(\d+)\./m)
        if (firstQuestionMatch) {
          const firstQuestionIndex = cleanContent.indexOf(firstQuestionMatch[0])
          cleanContent = cleanContent.substring(firstQuestionIndex)
        }

        const parsedQuestions = parseTestContent(cleanContent)
        console.log('Parsed questions:', parsedQuestions)
        setQuestions(parsedQuestions)

        // Initialize answers object
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

      // Skip headers, markdown, and metadata
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

      // Check if it's a question (starts with number and period)
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
      }
      // Check if it's a multiple choice option
      else if (line.match(/^[A-D]\.\s*/) && currentQuestion) {
        const optionMatch = line.match(/^([A-D])\.\s*(.+?)(\s*\[CORRECT\])?$/)
        if (optionMatch) {
          currentQuestion.options.push({
            letter: optionMatch[1],
            text: optionMatch[2].trim(),
            isCorrect: !!optionMatch[3],
          })
        }
      }
      // If no options detected, it might be an essay question
      else if (
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

    // Filter out questions without proper content
    questions = questions.filter(
      (q) =>
        q.text &&
        q.text.length > 5 &&
        (q.type === 'essay' || q.options.length >= 2)
    )

    return questions
  }

  const handleAnswerChange = (questionIndex, answer) => {
    const newAnswers = { ...answers, [questionIndex]: answer }
    setAnswers(newAnswers)

    // Count answered questions
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
    if (timeLeft <= 300) return 'bg-gradient-to-r from-red-500 to-red-600' // Last 5 minutes
    if (timeLeft <= 600) return 'bg-gradient-to-r from-yellow-500 to-orange-500' // Last 10 minutes
    return 'bg-gradient-to-r from-green-500 to-emerald-600'
  }

  if (loading) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center'>
        <div className='text-center'>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className='w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-6'
          />
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className='text-xl font-semibold text-gray-700 mb-2'>
              Loading Test
            </h2>
            <p className='text-gray-500'>
              Please wait while we prepare your assessment...
            </p>
          </motion.div>
        </div>
      </div>
    )
  }

  if (!test) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className='text-center bg-white rounded-2xl shadow-xl p-12 max-w-md mx-4'
        >
          <FileText className='w-20 h-20 text-gray-400 mx-auto mb-6' />
          <h2 className='text-2xl font-bold text-gray-900 mb-4'>
            Test Not Found
          </h2>
          <p className='text-gray-600 leading-relaxed'>
            The test you're looking for doesn't exist or has been removed.
            Please check the link and try again.
          </p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100'>
      {/* Enhanced Timer */}
      <AnimatePresence>
        {test.interactiveSettings?.timeLimit && !isSubmitted && (
          <motion.div
            initial={{ opacity: 0, y: -30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 0.9 }}
            className={`fixed top-6 right-6 z-50 ${getTimerColor()} text-white px-6 py-4 rounded-2xl shadow-2xl backdrop-blur border border-white/20`}
          >
            <div className='flex items-center space-x-3'>
              <Timer className='w-6 h-6' />
              <div>
                <div className='text-xs font-medium opacity-90'>
                  Time Remaining
                </div>
                <div className='text-2xl font-bold tabular-nums'>
                  {formatTime(timeLeft)}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className='max-w-5xl mx-auto p-6'>
        {/* Enhanced Test Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className='bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 p-10 mb-8 relative overflow-hidden'
        >
          {/* Decorative background elements */}
          <div className='absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-100 to-indigo-200 rounded-full opacity-30 -translate-y-32 translate-x-32'></div>
          <div className='absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-purple-100 to-pink-200 rounded-full opacity-30 translate-y-24 -translate-x-24'></div>

          <div className='relative z-10'>
            <div className='text-center border-b border-gray-200/50 pb-8 mb-8'>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className='inline-flex items-center bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-4'
              >
                <BookOpen className='w-4 h-4 mr-2' />
                Assessment in Progress
              </motion.div>

              <h1 className='text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-4'>
                {test.title}
              </h1>

              <p className='text-lg text-gray-600 mb-6 max-w-2xl mx-auto leading-relaxed'>
                {test.metadata?.additionalInfo ||
                  'Complete this assessment to test your knowledge and understanding.'}
              </p>

              <div className='flex flex-wrap justify-center items-center gap-6'>
                <div className='flex items-center bg-gray-50 rounded-full px-4 py-2'>
                  <Target className='w-5 h-5 text-blue-600 mr-2' />
                  <span className='text-sm font-medium text-gray-700'>
                    {questions.length} Questions
                  </span>
                </div>
                {test.interactiveSettings?.timeLimit && (
                  <div className='flex items-center bg-gray-50 rounded-full px-4 py-2'>
                    <Clock className='w-5 h-5 text-green-600 mr-2' />
                    <span className='text-sm font-medium text-gray-700'>
                      {test.interactiveSettings.timeLimit} Minutes
                    </span>
                  </div>
                )}
                <div className='flex items-center bg-gray-50 rounded-full px-4 py-2'>
                  <Trophy className='w-5 h-5 text-yellow-600 mr-2' />
                  <span className='text-sm font-medium text-gray-700'>
                    Passing: 70%
                  </span>
                </div>
              </div>
            </div>

            {/* Enhanced Progress Section */}
            <div className='mb-8'>
              <div className='flex justify-between items-center mb-4'>
                <div>
                  <h3 className='text-lg font-semibold text-gray-900'>
                    Progress
                  </h3>
                  <p className='text-sm text-gray-600'>
                    {answeredCount} of {questions.length} questions completed
                  </p>
                </div>
                <div className='text-right'>
                  <div className='text-2xl font-bold text-blue-600'>
                    {Math.round((answeredCount / questions.length) * 100)}%
                  </div>
                  <div className='text-xs text-gray-500'>Complete</div>
                </div>
              </div>

              <div className='relative'>
                <div className='w-full bg-gray-200 rounded-full h-3 overflow-hidden'>
                  <motion.div
                    className='bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full shadow-sm'
                    initial={{ width: 0 }}
                    animate={{
                      width: `${(answeredCount / questions.length) * 100}%`,
                    }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                  />
                </div>
                <div className='flex justify-between mt-2 text-xs text-gray-500'>
                  <span>Start</span>
                  <span>Complete</span>
                </div>
              </div>
            </div>

            {/* Enhanced Instructions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className='bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/50 rounded-2xl p-6'
            >
              <h3 className='font-bold text-blue-900 mb-4 flex items-center'>
                <AlertCircle className='w-5 h-5 mr-2' />
                Important Instructions
              </h3>
              <div className='grid md:grid-cols-2 gap-4 text-sm text-blue-800'>
                <div className='space-y-2'>
                  <div className='flex items-start'>
                    <div className='w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0'></div>
                    <span>
                      Read each question carefully before selecting your answer
                    </span>
                  </div>
                  {test.interactiveSettings?.timeLimit && (
                    <div className='flex items-start'>
                      <div className='w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0'></div>
                      <span>
                        You have {test.interactiveSettings.timeLimit} minutes to
                        complete this assessment
                      </span>
                    </div>
                  )}
                </div>
                <div className='space-y-2'>
                  <div className='flex items-start'>
                    <div className='w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0'></div>
                    <span>
                      {test.interactiveSettings?.allowRetry
                        ? 'You can retake this test if needed'
                        : 'You have only one attempt - make it count'}
                    </span>
                  </div>
                  <div className='flex items-start'>
                    <div className='w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0'></div>
                    <span>
                      Ensure all questions are answered before submitting
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Enhanced Questions Section */}
        {!isSubmitted ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className='space-y-8'
          >
            {questions.map((question, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className='bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-8 hover:shadow-xl transition-all duration-300'
              >
                <div className='flex items-start space-x-4 mb-6'>
                  <div
                    className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                      answers[index] && answers[index].trim() !== ''
                        ? 'bg-green-100 text-green-800 border-2 border-green-200'
                        : 'bg-gray-100 text-gray-600 border-2 border-gray-200'
                    }`}
                  >
                    {question.number}
                  </div>
                  <div className='flex-1'>
                    <h3 className='text-xl font-semibold text-gray-900 mb-4 leading-relaxed'>
                      {question.text}
                    </h3>

                    {question.instructions && (
                      <div className='bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6'>
                        <div className='flex items-start'>
                          <AlertCircle className='w-5 h-5 text-amber-600 mr-3 mt-0.5 flex-shrink-0' />
                          <p className='text-sm text-amber-800 font-medium'>
                            {question.instructions}
                          </p>
                        </div>
                      </div>
                    )}

                    {question.type === 'multiple-choice' &&
                    question.options.length > 0 ? (
                      <div className='space-y-3'>
                        {question.options.map((option) => (
                          <label
                            key={option.letter}
                            className={`group flex items-center p-5 border-2 rounded-xl cursor-pointer transition-all duration-200 hover:scale-[1.02] ${
                              answers[index] === option.letter
                                ? 'border-blue-500 bg-blue-50 shadow-md'
                                : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            <div
                              className={`relative w-6 h-6 rounded-full border-2 mr-4 flex-shrink-0 transition-all ${
                                answers[index] === option.letter
                                  ? 'border-blue-500 bg-blue-500'
                                  : 'border-gray-300 group-hover:border-gray-400'
                              }`}
                            >
                              {answers[index] === option.letter && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className='absolute inset-1 bg-white rounded-full'
                                />
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
                            <span className='text-gray-900 leading-relaxed'>
                              <span className='font-semibold text-blue-600 mr-2'>
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
                          rows={8}
                          value={answers[index] || ''}
                          onChange={(e) =>
                            handleAnswerChange(index, e.target.value)
                          }
                          className='w-full p-6 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none resize-none transition-all duration-200 text-gray-700 leading-relaxed'
                        />
                        <div className='absolute bottom-4 right-4 text-xs text-gray-400'>
                          {answers[index]?.length || 0} characters
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Enhanced Submit Button */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className='text-center pt-8'
            >
              <motion.button
                onClick={() => handleSubmit()}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className='bg-gradient-to-r from-green-600 to-emerald-600 text-white px-12 py-4 rounded-2xl font-bold text-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-xl hover:shadow-2xl'
              >
                Submit Test
              </motion.button>

              <p className='text-sm text-gray-500 mt-4'>
                Double-check your answers before submitting
              </p>
            </motion.div>
          </motion.div>
        ) : (
          /* Enhanced Results */
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', duration: 0.6 }}
            className='bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/50 p-12 text-center relative overflow-hidden'
          >
            {/* Decorative elements */}
            <div
              className={`absolute inset-0 ${
                score >= 70
                  ? 'bg-gradient-to-br from-green-50 to-emerald-100'
                  : 'bg-gradient-to-br from-red-50 to-orange-100'
              } opacity-30`}
            ></div>

            <div className='relative z-10'>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
                className='mb-8'
              >
                {score >= 70 ? (
                  <CheckCircle className='w-24 h-24 text-green-500 mx-auto mb-6' />
                ) : (
                  <AlertCircle className='w-24 h-24 text-red-500 mx-auto mb-6' />
                )}

                <h2 className='text-4xl font-bold text-gray-900 mb-4'>
                  Test Completed Successfully!
                </h2>

                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.4, type: 'spring' }}
                  className={`text-8xl font-black mb-6 ${
                    score >= 70 ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {score}%
                </motion.div>

                <div
                  className={`inline-flex items-center px-6 py-3 rounded-full text-lg font-semibold mb-6 ${
                    score >= 70
                      ? 'bg-green-100 text-green-800 border-2 border-green-200'
                      : 'bg-red-100 text-red-800 border-2 border-red-200'
                  }`}
                >
                  <Trophy className='w-6 h-6 mr-2' />
                  {score >= 70 ? 'Passed' : 'Needs Improvement'}
                </div>

                <p className='text-xl text-gray-600 mb-8 max-w-md mx-auto leading-relaxed'>
                  You scored {score >= 70 ? 'above' : 'below'} the passing
                  threshold of 70%
                </p>

                {score >= 70 ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className='bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-8 mb-8'
                  >
                    <div className='text-6xl mb-4'>🎉</div>
                    <h3 className='text-2xl font-bold text-green-900 mb-2'>
                      Congratulations!
                    </h3>
                    <p className='text-green-800 text-lg leading-relaxed'>
                      You have successfully passed this assessment. Your
                      knowledge and understanding are commendable!
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className='bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200 rounded-2xl p-8 mb-8'
                  >
                    <div className='text-6xl mb-4'>📚</div>
                    <h3 className='text-2xl font-bold text-red-900 mb-2'>
                      Keep Learning!
                    </h3>
                    <p className='text-red-800 text-lg leading-relaxed'>
                      Don't worry - this is a learning opportunity. Review the
                      material and try again when you're ready.
                    </p>
                  </motion.div>
                )}

                {test.interactiveSettings?.allowRetry && score < 70 && (
                  <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    onClick={() => window.location.reload()}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className='bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl'
                  >
                    Retake Test
                  </motion.button>
                )}
              </motion.div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default TestViewerPage
