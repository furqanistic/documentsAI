import { motion } from 'framer-motion'
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  MessageSquare,
  Share2,
  Star,
  ThumbsUp,
  Users,
} from 'lucide-react'
import React, { useState } from 'react'

const Testimonial = () => {
  const [activeTab, setActiveTab] = useState('educators')

  // Tabs for filtering testimonials
  const tabs = [
    { id: 'educators', label: 'Educators' },
    { id: 'students', label: 'Students' },
    { id: 'professionals', label: 'Professionals' },
  ]

  // Testimonials data grouped by category
  const testimonials = {
    educators: [
      {
        name: 'Dr. Michelle Patel',
        role: 'University Professor',
        image: 'michelle',
        quote: `This platform has completely transformed my assessment workflow. 
                I can create, distribute, and grade tests in a fraction of the time it used to take.`,
        rating: 5,
        verified: true,
      },
      {
        name: 'James Wilson',
        role: 'High School Teacher',
        image: 'james',
        quote: `The anti-cheating measures and analytics have made remote testing actually viable. 
                My students love the instant feedback, and I love how much time I save on grading.`,
        rating: 5,
        verified: true,
      },
      {
        name: 'Sarah Johnson',
        role: 'Education Director',
        image: 'sarah',
        quote: `Rolling this out across our entire school district has improved assessment consistency 
                and saved thousands of hours of teacher time. The ROI was immediate.`,
        rating: 5,
        verified: true,
      },
      {
        name: 'Robert Chen',
        role: 'Math Department Chair',
        image: 'robert',
        quote: `The ability to create randomized math problems with step-by-step solutions has been 
                a game-changer for our department. Students get more practice with immediate feedback.`,
        rating: 4,
        verified: true,
      },
    ],
    students: [
      {
        name: 'Emma Rodriguez',
        role: 'MBA Student',
        image: 'emma',
        quote: `Taking exams online used to be stressful, but this platform makes it so intuitive. 
                The interface is clean, and I can focus on the content rather than figuring out how to use the system.`,
        rating: 5,
        verified: true,
      },
      {
        name: 'Alex Kim',
        role: 'Computer Science Major',
        image: 'alex',
        quote: `The instant feedback on coding assessments has helped me improve faster than traditional methods. 
                I can see where I went wrong and fix it immediately.`,
        rating: 5,
        verified: true,
      },
      {
        name: 'Taylor Johnson',
        role: 'High School Senior',
        image: 'taylor',
        quote: `I use this to study for AP exams. The practice tests are really helpful and 
                I can track my progress over time to see which areas I need to focus on.`,
        rating: 4,
        verified: true,
      },
      {
        name: 'Marcus Williams',
        role: 'Online Degree Student',
        image: 'marcus',
        quote: `As a remote student, assessment platforms are crucial. This one is by far the best I've used - 
                reliable, easy to navigate, and the mobile experience is excellent.`,
        rating: 5,
        verified: true,
      },
    ],
    professionals: [
      {
        name: 'Michael Chen',
        role: 'Corporate Trainer',
        image: 'michael',
        quote: `We use this for all our certification assessments now. The analytics have helped us 
                refine our training materials based on where participants are struggling.`,
        rating: 5,
        verified: true,
      },
      {
        name: 'Priya Sharma',
        role: 'HR Director',
        image: 'priya',
        quote: `We've implemented this platform for our skills assessments during recruitment. 
                It's standardized our process and reduced hiring time by 30%.`,
        rating: 5,
        verified: true,
      },
      {
        name: 'David Okafor',
        role: 'EdTech Administrator',
        image: 'david',
        quote: `The seamless integration with our existing LMS made adoption painless. 
                The support team was fantastic during our institutional rollout.`,
        rating: 4,
        verified: true,
      },
      {
        name: 'Lisa Gonzalez',
        role: 'Product Manager',
        image: 'lisa',
        quote: `Our team uses this for knowledge checks during product training. 
                The ability to include interactive elements in assessments helps keep engagement high.`,
        rating: 5,
        verified: true,
      },
    ],
  }

  // Stats data
  const stats = [
    { value: '2,500+', label: 'Educational institutions' },
    { value: '1.8M', label: 'Active users' },
    { value: '98%', label: 'Satisfaction rate' },
    { value: '14M+', label: 'Assessments completed' },
  ]

  return (
    <div className='w-full bg-gray-50 py-8 md:py-16 px-3 md:px-4 '>
      <div className='container mx-auto max-w-7xl '>
        {/* Section header */}
        <div className='mb-12 text-center'>
          <motion.div
            className='inline-flex items-center px-2 md:px-4 py-1 md:py-2 mb-3 md:mb-4 space-x-1 md:space-x-2 text-xs md:text-sm font-medium text-gray-800 bg-white rounded-full shadow-sm'
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            <MessageSquare size={16} className='text-gray-600' />
            <span>Real User Stories</span>
          </motion.div>

          <motion.h2
            className='text-2xl md:text-3xl lg:text-4xl font-bold mb-3 '
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <span className='relative'>What Our Users Are Saying</span>
          </motion.h2>

          <motion.p
            className='max-w-2xl mx-auto text-sm md:text-base lg:text-lg text-gray-600'
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Thousands of educators, students, and professionals rely on our
            platform every day. Here's what they have to say about their
            experience.
          </motion.p>
        </div>

        {/* Tab navigation */}
        <div className='flex justify-center mb-6 md:mb-10 px-1 '>
          <div className='inline-flex p-1 bg-white rounded-lg shadow-sm w-full max-w-md'>
            {tabs.map((tab) => (
              <motion.button
                key={tab.id}
                className={`relative flex-1 px-1 md:px-6 py-1.5 md:py-2 text-xs md:text-sm font-medium rounded-md ${
                  activeTab === tab.id
                    ? 'text-white'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
                onClick={() => setActiveTab(tab.id)}
                whileHover={{ scale: activeTab !== tab.id ? 1.03 : 1 }}
                whileTap={{ scale: 0.97 }}
              >
                {activeTab === tab.id && (
                  <motion.div
                    className='absolute inset-0 bg-black rounded-md'
                    layoutId='activeTestimonialTab'
                    initial={false}
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                  />
                )}
                <span className='relative z-10 truncate'>{tab.label}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Testimonial cards */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6'>
          {testimonials[activeTab].map((testimonial, idx) => (
            <motion.div
              key={idx}
              className='bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col h-full'
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              whileHover={{
                y: -5,
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
              }}
            >
              <div className='p-3 md:p-5 flex-grow'>
                <div className='flex items-center mb-3 md:mb-4'>
                  <div className='w-8 h-8 md:w-12 md:h-12 rounded-full bg-gray-200 mr-3 md:mr-4 flex items-center justify-center text-gray-500 overflow-hidden'>
                    {/* Use first letter of name as placeholder */}
                    <span className='text-base md:text-lg font-bold'>
                      {testimonial.name[0]}
                    </span>
                  </div>
                  <div>
                    <div className='font-medium text-gray-900 text-sm md:text-base'>
                      {testimonial.name}
                    </div>
                    <div className='text-xs text-gray-500'>
                      {testimonial.role}
                    </div>
                  </div>
                </div>

                <div className='flex mb-2 md:mb-3'>
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className={
                        i < testimonial.rating
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }
                    />
                  ))}
                </div>

                <p className='text-gray-700 text-xs md:text-sm'>
                  {testimonial.quote}
                </p>
              </div>

              <div className='h-px bg-gray-100'></div>

              <div className='p-2 md:p-3 bg-gray-50 text-xs text-gray-500 flex justify-between items-center'>
                {testimonial.verified && (
                  <div className='flex items-center'>
                    <CheckCircle2 size={10} className='text-green-500 mr-1' />
                    <span>Verified User</span>
                  </div>
                )}
                <motion.button
                  className='flex items-center text-gray-400 hover:text-gray-600'
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Share2 size={10} className='mr-1' />
                  <span>Share</span>
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Testimonial video callout */}
        <motion.div
          className='mt-10 md:mt-16 bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl p-4 md:p-8 text-white'
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 items-center'>
            <div>
              <div className='inline-flex items-center px-2 md:px-3 py-1 mb-3 md:mb-4 space-x-1 text-xs font-medium text-white bg-gray-700 bg-opacity-40 rounded-full'>
                <Users size={10} className='text-gray-300' />
                <span>Success Stories</span>
              </div>

              <h3 className='text-lg md:text-2xl font-bold mb-2 md:mb-3'>
                See how Central University improved student outcomes by 32%
              </h3>

              <p className='text-xs md:text-base text-gray-300 mb-4 md:mb-6'>
                Central University implemented our platform across all
                departments and saw remarkable improvements in student
                engagement, assessment completion rates, and overall
                performance.
              </p>

              <motion.button
                className='inline-flex items-center px-4 md:px-5 py-1.5 md:py-2 text-xs md:text-sm font-medium text-gray-900 bg-white rounded-md hover:bg-gray-100'
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <BookOpen size={12} className='mr-2' />
                Read the case study
              </motion.button>
            </div>

            <div className='relative'>
              <div className='aspect-video bg-gray-700 rounded-lg overflow-hidden flex items-center justify-center'>
                {/* Video placeholder */}
                <div className='text-gray-300 text-center'>
                  <ThumbsUp
                    size={36}
                    className='mx-auto mb-2 md:mb-3 opacity-50'
                  />
                  <div className='text-xs md:text-sm'>Success Story Video</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* CTA section */}
        <motion.div
          className='mt-10 md:mt-16 text-center'
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h3 className='text-lg md:text-2xl font-bold text-gray-900 mb-3 md:mb-4'>
            Join thousands of satisfied users today!
          </h3>
          <p className='text-xs md:text-base text-gray-600 max-w-2xl mx-auto mb-6 md:mb-8'>
            Experience the platform that's transforming how educators assess,
            students learn, and professionals validate skills.
          </p>
          <motion.button
            className='inline-flex items-center justify-center px-4 md:px-6 py-1.5 md:py-2 text-sm md:text-sm font-medium text-white transition-colors bg-black rounded-lg hover:bg-gray-800'
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            Start your free trial
            <motion.div
              animate={{ x: [0, 4, 0] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatType: 'loop',
                ease: 'easeInOut',
              }}
            >
              <ArrowRight size={16} className='ml-2' />
            </motion.div>
          </motion.button>
        </motion.div>
      </div>
    </div>
  )
}

export default Testimonial
