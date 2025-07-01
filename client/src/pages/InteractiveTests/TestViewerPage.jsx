import {
  AlertCircle,
  BookOpen,
  CheckCircle,
  Clock,
  Eye,
  FileText,
  Play,
  Shield,
  Target,
  Timer,
  Trophy,
} from 'lucide-react'
import React, { useCallback, useEffect, useState } from 'react'
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

  // Anti-cheating states
  const [tabSwitchCount, setTabSwitchCount] = useState(0)
  const [fullscreenExitCount, setFullscreenExitCount] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [suspiciousActivity, setSuspiciousActivity] = useState([])
  const [testTerminated, setTestTerminated] = useState(false)
  const [virtualMachineDetected, setVirtualMachineDetected] = useState(false)

  // Anti-cheating functions
  const logSuspiciousActivity = useCallback((activity) => {
    const timestamp = new Date().toISOString()
    setSuspiciousActivity((prev) => [...prev, { activity, timestamp }])
    console.warn('Suspicious activity detected:', activity, timestamp)
  }, [])

  const terminateTest = useCallback(
    (reason) => {
      setTestTerminated(true)
      setIsSubmitted(true)
      logSuspiciousActivity(`Test terminated: ${reason}`)
      toast.error(`Test terminated: ${reason}`)
      setScore(0)
    },
    [logSuspiciousActivity]
  )

  // Optimized screenshot prevention
  const handleScreenshotAttempt = useCallback(() => {
    logSuspiciousActivity('Screenshot attempt blocked')

    // Brief visual feedback
    document.body.style.backgroundColor = '#ff0000'
    setTimeout(() => {
      document.body.style.backgroundColor = ''
    }, 50)

    // Clear clipboard efficiently
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText('').catch(() => {})
    }

    toast.error('Screenshot blocked! This action has been logged.')
  }, [logSuspiciousActivity])

  // Enhanced key prevention with debouncing
  const handleKeyDown = useCallback(
    (e) => {
      if (!testStarted || isSubmitted) return

      // Screenshot detection
      if (
        e.key === 'PrintScreen' ||
        (e.altKey && e.key === 'PrintScreen') ||
        (e.metaKey && e.key === 'PrintScreen') ||
        (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 's') ||
        (e.metaKey && e.shiftKey && ['3', '4', '5'].includes(e.key))
      ) {
        e.preventDefault()
        e.stopPropagation()
        handleScreenshotAttempt()
        return false
      }

      const preventedKeys = ['F12', 'F5', 'F11', 'Insert']
      const preventedCombinations = [
        { ctrl: true, key: 'c' },
        { ctrl: true, key: 'v' },
        { ctrl: true, key: 'x' },
        { ctrl: true, key: 'a' },
        { ctrl: true, key: 's' },
        { ctrl: true, key: 'p' },
        { ctrl: true, key: 'f' },
        { ctrl: true, key: 'h' },
        { ctrl: true, key: 'j' },
        { ctrl: true, key: 'k' },
        { ctrl: true, key: 'l' },
        { ctrl: true, key: 'n' },
        { ctrl: true, key: 't' },
        { ctrl: true, key: 'w' },
        { ctrl: true, key: 'r' },
        { ctrl: true, key: 'u' },
        { ctrl: true, shift: true, key: 'i' },
        { ctrl: true, shift: true, key: 'j' },
        { ctrl: true, shift: true, key: 'c' },
        { ctrl: true, shift: true, key: 'k' },
        { alt: true, key: 'Tab' },
        { alt: true, key: 'F4' },
      ]

      if (preventedKeys.includes(e.key)) {
        e.preventDefault()
        e.stopPropagation()
        return false
      }

      const isProhibited = preventedCombinations.some((combo) => {
        const ctrlMatch = combo.ctrl ? e.ctrlKey : !e.ctrlKey
        const shiftMatch = combo.shift ? e.shiftKey : !e.shiftKey
        const altMatch = combo.alt ? e.altKey : !e.altKey
        return (
          ctrlMatch &&
          shiftMatch &&
          altMatch &&
          combo.key.toLowerCase() === e.key.toLowerCase()
        )
      })

      if (isProhibited) {
        e.preventDefault()
        e.stopPropagation()
        return false
      }
    },
    [testStarted, isSubmitted, handleScreenshotAttempt]
  )

  // Context menu and selection prevention
  const handleContextMenu = useCallback(
    (e) => {
      if (testStarted && !isSubmitted) {
        e.preventDefault()
        logSuspiciousActivity('Right-click blocked')
      }
    },
    [testStarted, isSubmitted, logSuspiciousActivity]
  )

  const handleSelectStart = useCallback(
    (e) => {
      if (testStarted && !isSubmitted) e.preventDefault()
    },
    [testStarted, isSubmitted]
  )

  // Tab switching detection
  const handleVisibilityChange = useCallback(() => {
    if (!testStarted || isSubmitted || !document.hidden) return

    const newCount = tabSwitchCount + 1
    setTabSwitchCount(newCount)
    logSuspiciousActivity(`Tab switch detected (${newCount}/2)`)

    if (newCount === 1) {
      toast.warning('Tab switching detected. One more will terminate the test.')
    } else if (newCount >= 2) {
      terminateTest('Multiple tab switches')
    }
  }, [
    testStarted,
    isSubmitted,
    tabSwitchCount,
    logSuspiciousActivity,
    terminateTest,
  ])

  // Enhanced fullscreen entry
  const enterFullscreen = useCallback(async () => {
    try {
      const element = document.documentElement

      if (element.requestFullscreen) {
        await element.requestFullscreen()
      } else if (element.webkitRequestFullscreen) {
        await element.webkitRequestFullscreen()
      } else if (element.mozRequestFullScreen) {
        await element.mozRequestFullScreen()
      } else if (element.msRequestFullscreen) {
        await element.msRequestFullscreen()
      } else {
        throw new Error('Fullscreen not supported')
      }
    } catch (error) {
      console.error('Fullscreen error:', error)
      throw error
    }
  }, [])

  // Fullscreen monitoring with auto re-entry and 3 tries
  const handleFullscreenChange = useCallback(() => {
    const fullscreen = !!(
      document.fullscreenElement ||
      document.webkitFullscreenElement ||
      document.mozFullScreenElement ||
      document.msFullscreenElement
    )

    setIsFullscreen(fullscreen)

    if (testStarted && !isSubmitted && !fullscreen) {
      const newCount = fullscreenExitCount + 1
      setFullscreenExitCount(newCount)
      logSuspiciousActivity(`Attempted to exit fullscreen (${newCount}/3)`)

      if (newCount >= 3) {
        terminateTest('Multiple fullscreen exit attempts (limit: 3)')
      } else {
        // Automatically re-enter fullscreen
        setTimeout(async () => {
          try {
            await enterFullscreen()
            if (newCount === 1) {
              toast.warning(
                'Returned to fullscreen. 2 more exit attempts will terminate the test.'
              )
            } else if (newCount === 2) {
              toast.error(
                'Returned to fullscreen. One more exit attempt will terminate the test!'
              )
            }
          } catch (error) {
            console.error('Failed to re-enter fullscreen:', error)
            terminateTest('Unable to maintain fullscreen mode')
          }
        }, 100)
      }
    }
  }, [
    testStarted,
    isSubmitted,
    fullscreenExitCount,
    logSuspiciousActivity,
    terminateTest,
    enterFullscreen,
  ])

  // VM detection
  const detectVirtualMachine = useCallback(() => {
    try {
      const canvas = document.createElement('canvas')
      const ctx =
        canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
      if (ctx) {
        const debugInfo = ctx.getExtension('WEBGL_debug_renderer_info')
        if (debugInfo) {
          const renderer = ctx.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
          const vendor = ctx.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL)

          const vmIndicators = [
            'vmware',
            'virtualbox',
            'vbox',
            'qemu',
            'xen',
            'hyper-v',
            'parallels',
            'citrix',
            'virtual',
          ]
          const isVM = vmIndicators.some(
            (indicator) =>
              renderer.toLowerCase().includes(indicator) ||
              vendor.toLowerCase().includes(indicator)
          )

          if (isVM) {
            setVirtualMachineDetected(true)
            logSuspiciousActivity('Virtual machine detected')
            toast.warning('Virtual machine environment detected')
          }
        }
      }
    } catch (error) {
      console.log('VM detection failed:', error)
    }
  }, [logSuspiciousActivity])

  // Optimized clipboard monitoring
  const monitorClipboard = useCallback(async () => {
    if (!testStarted || isSubmitted) return

    try {
      if (navigator.clipboard && navigator.clipboard.read) {
        const clipboardItems = await navigator.clipboard.read()
        for (const item of clipboardItems) {
          const hasImage = item.types.some((type) => type.includes('image/'))
          if (hasImage) {
            handleScreenshotAttempt()
            if (navigator.clipboard.writeText) {
              await navigator.clipboard.writeText('')
            }
            break
          }
        }
      }
    } catch (error) {
      // Expected - clipboard access is restricted
    }
  }, [testStarted, isSubmitted, handleScreenshotAttempt])

  // Enhanced security monitoring (optimized)
  useEffect(() => {
    if (!testStarted) return

    // Event listeners with passive options for better performance
    const events = [
      ['keydown', handleKeyDown, { passive: false }],
      ['contextmenu', handleContextMenu, { passive: false }],
      ['selectstart', handleSelectStart, { passive: false }],
      ['visibilitychange', handleVisibilityChange, { passive: true }],
      ['fullscreenchange', handleFullscreenChange, { passive: true }],
      ['webkitfullscreenchange', handleFullscreenChange, { passive: true }],
      ['mozfullscreenchange', handleFullscreenChange, { passive: true }],
      ['MSFullscreenChange', handleFullscreenChange, { passive: true }],
    ]

    events.forEach(([event, handler, options]) => {
      document.addEventListener(event, handler, options)
    })

    // Security styles (optimized)
    const style = document.createElement('style')
    style.id = 'security-styles'
    style.textContent = `
      * { user-select: none !important; }
      input, textarea { user-select: text !important; }
      @media print { body { display: none !important; } }
    `
    document.head.appendChild(style)

    // Security overlay (lightweight)
    const overlay = document.createElement('div')
    overlay.id = 'security-overlay'
    overlay.style.cssText = `
      position: fixed; top: 0; left: 0; width: 100%; height: 100%;
      pointer-events: none; z-index: 9999; opacity: 0.005;
      background: linear-gradient(45deg, transparent 49%, rgba(255,0,0,0.01) 50%, transparent 51%);
    `
    document.body.appendChild(overlay)

    // Initialize security features (no webcam)
    detectVirtualMachine()

    // Optimized clipboard monitoring (reduced frequency)
    const clipboardInterval = setInterval(monitorClipboard, 3000)

    // Optimized developer tools detection (reduced frequency)
    const devToolsInterval = setInterval(() => {
      const threshold = 160
      if (
        window.outerHeight - window.innerHeight > threshold ||
        window.outerWidth - window.innerWidth > threshold
      ) {
        logSuspiciousActivity('Developer tools detected')
        terminateTest('Developer tools usage')
      }
    }, 2000)

    // Cleanup
    return () => {
      events.forEach(([event, handler]) => {
        document.removeEventListener(event, handler)
      })
      clearInterval(clipboardInterval)
      clearInterval(devToolsInterval)
      document.getElementById('security-overlay')?.remove()
      document.getElementById('security-styles')?.remove()
    }
  }, [
    testStarted,
    handleKeyDown,
    handleContextMenu,
    handleSelectStart,
    handleVisibilityChange,
    handleFullscreenChange,
    detectVirtualMachine,
    monitorClipboard,
    logSuspiciousActivity,
    terminateTest,
  ])

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
      const response = await axiosInstance.get(`/documents/${testId}`)

      if (response.data.success && response.data.document) {
        const testData = response.data.document
        setTest(testData)

        let cleanContent = testData.content.replace(
          /<think>[\s\S]*?<\/think>/g,
          ''
        )
        const firstQuestionMatch = cleanContent.match(/^(\d+)\./m)
        if (firstQuestionMatch) {
          const firstQuestionIndex = cleanContent.indexOf(firstQuestionMatch[0])
          cleanContent = cleanContent.substring(firstQuestionIndex)
        }

        const parsedQuestions = parseTestContent(cleanContent)
        setQuestions(parsedQuestions)

        const initialAnswers = {}
        parsedQuestions.forEach((_, index) => {
          initialAnswers[index] = ''
        })
        setAnswers(initialAnswers)
      } else {
        toast.error('Test not found or inaccessible')
      }
    } catch (error) {
      if (error.response?.status === 404) {
        toast.error('Test not found')
      } else if (error.response?.status === 401) {
        toast.error('You need to be logged in to view this test')
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
        if (currentQuestion) questions.push(currentQuestion)
        currentQuestion = {
          number: parseInt(questionMatch[1]),
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

    if (currentQuestion) questions.push(currentQuestion)

    return questions.filter(
      (q) =>
        q.text &&
        q.text.length > 5 &&
        (q.type === 'essay' || q.options.length >= 2)
    )
  }

  const handleStartTest = async () => {
    try {
      // Force enter fullscreen before starting
      await enterFullscreen()

      // Wait a bit for fullscreen to activate
      setTimeout(() => {
        const fullscreen = !!(
          document.fullscreenElement ||
          document.webkitFullscreenElement ||
          document.mozFullScreenElement ||
          document.msFullscreenElement
        )

        if (fullscreen) {
          setIsFullscreen(true)
          setTestStarted(true)
          toast.success('Test started in secure fullscreen mode')
        } else {
          toast.error('Fullscreen mode is required to start the test')
        }
      }, 500)
    } catch (error) {
      toast.error('Please allow fullscreen mode to start the test')
    }
  }

  const handleAnswerChange = (questionIndex, answer) => {
    if (testTerminated) return
    const newAnswers = { ...answers, [questionIndex]: answer }
    setAnswers(newAnswers)
    const answered = Object.values(newAnswers).filter(
      (answer) => answer.trim() !== ''
    ).length
    setAnsweredCount(answered)
  }

  const calculateScore = () => {
    if (testTerminated) return 0
    let correct = 0
    let totalMCQ = 0

    questions.forEach((question, index) => {
      if (question.type === 'multiple-choice' && question.options.length > 0) {
        totalMCQ++
        const selectedOption = question.options.find(
          (opt) => opt.letter === answers[index]
        )
        if (selectedOption && selectedOption.isCorrect) correct++
      }
    })

    return totalMCQ > 0 ? Math.round((correct / totalMCQ) * 100) : 0
  }

  const handleSubmit = (autoSubmit = false) => {
    if (!autoSubmit && answeredCount < questions.length && !testTerminated) {
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
    } else if (testTerminated) {
      toast.error('Test was terminated due to security violations.')
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

              <div className='bg-gray-50 rounded-lg p-4'>
                <h3 className='font-semibold text-gray-800 mb-3 flex items-center'>
                  <Shield className='w-4 h-4 mr-2 text-green-600' />
                  Security Requirements
                </h3>
                <div className='space-y-2 text-sm text-gray-600'>
                  <div className='flex items-start'>
                    <div className='w-1.5 h-1.5 bg-red-500 rounded-full mt-2 mr-2 flex-shrink-0'></div>
                    <span>
                      Fullscreen enforced (auto-return, 3 attempts allowed)
                    </span>
                  </div>
                  <div className='flex items-start'>
                    <div className='w-1.5 h-1.5 bg-red-500 rounded-full mt-2 mr-2 flex-shrink-0'></div>
                    <span>Tab switching prohibited (max 2)</span>
                  </div>
                  <div className='flex items-start'>
                    <div className='w-1.5 h-1.5 bg-red-500 rounded-full mt-2 mr-2 flex-shrink-0'></div>
                    <span>Screenshots blocked and logged</span>
                  </div>
                  <div className='flex items-start'>
                    <div className='w-1.5 h-1.5 bg-green-500 rounded-full mt-2 mr-2 flex-shrink-0'></div>
                    <span>Developer tools detection active</span>
                  </div>
                </div>
              </div>
            </div>

            <div className='bg-red-50 border border-red-200 rounded-lg p-4 mb-6'>
              <h3 className='font-semibold text-red-800 mb-2 flex items-center'>
                <AlertCircle className='w-4 h-4 mr-2' />
                Security Notice
              </h3>
              <p className='text-sm text-red-700 mb-3'>
                This test uses advanced anti-cheating technology. Any attempt to
                circumvent security measures will result in immediate test
                termination.
              </p>
              <div className='text-xs text-red-600'>
                <strong>Automatic termination triggers:</strong> Tab switching
                (2+ times), screenshots, developer tools, fullscreen exit
                attempts (3+ times), VM detection, window manipulation
              </div>
            </div>

            <div className='text-center'>
              <button
                onClick={handleStartTest}
                className='bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold text-lg transition-colors flex items-center mx-auto'
              >
                <Play className='w-5 h-5 mr-2' />
                Start Secure Test
              </button>
              <p className='text-gray-500 text-sm mt-3'>
                Test will automatically enter fullscreen mode for security.
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (testTerminated) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center p-4'>
        <div className='text-center bg-white rounded-lg shadow-lg p-8 max-w-md mx-auto border border-red-300'>
          <AlertCircle className='w-20 h-20 text-red-600 mx-auto mb-4' />
          <h2 className='text-2xl font-bold text-red-800 mb-3'>
            Test Terminated
          </h2>
          <p className='text-red-700 mb-4'>
            Your test has been terminated due to security policy violations.
          </p>
          <div className='bg-red-50 border border-red-200 rounded-lg p-4 mb-4'>
            <h3 className='font-semibold text-red-800 mb-2'>Final Score: 0%</h3>
            <p className='text-red-700 text-sm'>
              Tests terminated for security violations receive a score of 0%.
            </p>
          </div>
          <p className='text-gray-600 text-sm'>
            Contact your instructor if you believe this is an error.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-gray-50' style={{ userSelect: 'none' }}>
      {/* Security Status Bar */}
      {testStarted && !isSubmitted && (
        <div className='fixed top-0 left-0 right-0 bg-blue-600 text-white text-xs py-1 px-4 z-40 flex justify-between items-center'>
          <div className='flex items-center space-x-4'>
            <span className='flex items-center'>
              <Shield className='w-3 h-3 mr-1' />
              Secure Mode
            </span>
            <span className='flex items-center'>
              <Eye className='w-3 h-3 mr-1' />
              Tabs: {tabSwitchCount}/2
            </span>
            <span className='flex items-center'>
              <Target className='w-3 h-3 mr-1' />
              Exit Attempts: {fullscreenExitCount}/3
            </span>
            <span className='flex items-center'>
              {isFullscreen ? (
                <>
                  <CheckCircle className='w-3 h-3 mr-1' />
                  Fullscreen
                </>
              ) : (
                <>
                  <AlertCircle className='w-3 h-3 mr-1' />
                  Exit Detected
                </>
              )}
            </span>
            {virtualMachineDetected && (
              <span className='flex items-center text-red-200'>
                <AlertCircle className='w-3 h-3 mr-1' />
                VM Detected
              </span>
            )}
          </div>
          <div className='text-xs'>Activities: {suspiciousActivity.length}</div>
        </div>
      )}

      {/* Timer */}
      {test.interactiveSettings?.timeLimit && !isSubmitted && (
        <div
          className={`fixed top-12 right-4 z-50 ${getTimerColor()} px-4 py-2 rounded-lg shadow-lg`}
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

      <div
        className='max-w-4xl mx-auto p-4'
        style={{ paddingTop: testStarted && !isSubmitted ? '3rem' : '1rem' }}
      >
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
                    <h3
                      className='text-lg font-medium text-gray-800 mb-3'
                      style={{ userSelect: 'text' }}
                    >
                      {question.text}
                    </h3>

                    {question.instructions && (
                      <div className='bg-orange-50 border border-orange-200 rounded-lg p-3 mb-4'>
                        <div className='flex items-start'>
                          <AlertCircle className='w-4 h-4 text-orange-600 mr-2 mt-0.5 flex-shrink-0' />
                          <p
                            className='text-sm text-orange-800'
                            style={{ userSelect: 'text' }}
                          >
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
                            <span
                              className='text-gray-800 text-sm'
                              style={{ userSelect: 'text' }}
                            >
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
                          style={{ userSelect: 'text' }}
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

            <div className='text-center pt-6'>
              <button
                onClick={() => handleSubmit()}
                className='bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors'
                disabled={testTerminated}
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
              {score >= 70 && !testTerminated ? (
                <CheckCircle className='w-16 h-16 text-green-600 mx-auto mb-4' />
              ) : (
                <AlertCircle className='w-16 h-16 text-red-600 mx-auto mb-4' />
              )}

              <h2 className='text-2xl font-bold text-gray-800 mb-3'>
                {testTerminated ? 'Test Terminated' : 'Test Completed!'}
              </h2>

              <div
                className={`text-5xl font-black mb-4 ${
                  score >= 70 && !testTerminated
                    ? 'text-green-600'
                    : 'text-red-600'
                }`}
              >
                {score}%
              </div>

              <div
                className={`inline-flex items-center px-4 py-2 rounded-full font-semibold mb-4 ${
                  score >= 70 && !testTerminated
                    ? 'bg-green-100 text-green-800 border border-green-300'
                    : 'bg-red-100 text-red-800 border border-red-300'
                }`}
              >
                <Trophy className='w-4 h-4 mr-2' />
                {testTerminated
                  ? 'Terminated'
                  : score >= 70
                  ? 'Passed'
                  : 'Needs Improvement'}
              </div>

              <p className='text-gray-600 mb-6'>
                {testTerminated
                  ? 'Test was terminated due to security policy violations'
                  : `You scored ${
                      score >= 70 ? 'above' : 'below'
                    } the passing threshold of 70%`}
              </p>

              {score >= 70 && !testTerminated ? (
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
                  <div className='text-4xl mb-3'>
                    {testTerminated ? '⚠️' : '📚'}
                  </div>
                  <h3 className='text-xl font-bold text-red-800 mb-2'>
                    {testTerminated ? 'Security Violation' : 'Keep Learning!'}
                  </h3>
                  <p className='text-red-700'>
                    {testTerminated
                      ? 'Contact your instructor regarding this termination.'
                      : "Review the material and try again when you're ready."}
                  </p>
                </div>
              )}

              {test.interactiveSettings?.allowRetry &&
                score < 70 &&
                !testTerminated && (
                  <button
                    onClick={() => window.location.reload()}
                    className='bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors'
                  >
                    Retake Test
                  </button>
                )}

              {/* Security Log Summary */}
              {suspiciousActivity.length > 0 && (
                <div className='mt-6 bg-gray-50 border border-gray-200 rounded-lg p-4'>
                  <h4 className='font-semibold text-gray-800 mb-2'>
                    Security Log
                  </h4>
                  <p className='text-sm text-gray-600'>
                    {suspiciousActivity.length} security events were logged
                    during this test.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default TestViewerPage
