import { motion } from 'framer-motion'
import {
  Calendar,
  CreditCard,
  DollarSign,
  Gift,
  HelpCircle,
  Layers,
  Minus,
  PauseCircle,
  Plus,
  School,
  ShieldCheck,
} from 'lucide-react'
import React, { useState } from 'react'

const PricingFAQ = () => {
  // Track only one open item at a time
  const [openItemIndex, setOpenItemIndex] = useState(null)
  const toggleQuestion = (index) => {
    setOpenItemIndex(openItemIndex === index ? null : index)
  }

  // FAQ items
  const faqItems = [
    {
      question: `Do you offer a free plan?`,
      answer: `Yes, we offer a completely free plan that includes 3 documents per month, basic templates, PDF export functionality, and single language support. This is perfect for users who want to try our platform before committing to a paid subscription.`,
      icon: <Gift size={18} className='text-blue-500' />,
    },
    {
      question: `Can I switch between monthly and yearly billing?`,
      answer: `Absolutely! You can switch between monthly and yearly billing at any time. Yearly subscriptions offer approximately 17% savings compared to monthly payments. When switching from monthly to yearly, we'll prorate your existing subscription.`,
      icon: <Calendar size={18} className='text-gray-500' />,
    },
    {
      question: `Can I pause my subscription?`,
      answer: `Yes, you can pause your subscription at any time. If you've purchased an annual plan and need to take a break, simply pause your account in your billing settings. Your remaining subscription time will be available when you resume. For example, if you pause in October and resume in December, those two months will be added to your subscription end date.`,
      icon: <PauseCircle size={18} className='text-orange-500' />,
    },
    {
      question: `Do you offer educational discounts?`,
      answer: `Yes! We offer special pricing for educational institutions. Schools, colleges, and universities can receive up to 40% off our regular prices, with additional volume discounts for department or institution-wide adoption.`,
      icon: <School size={18} className='text-green-500' />,
    },
    {
      question: `Are there any hidden fees?`,
      answer: `No, there are no hidden fees. The price you see is the price you pay. All features listed in each plan are included at no additional cost, and we're transparent about any usage limits. If you exceed your document limit, you'll be notified before any additional charges.`,
      icon: <DollarSign size={18} className='text-teal-500' />,
    },
    {
      question: `What payment methods do you accept?`,
      answer: `We accept all major credit cards including Visa, Mastercard, American Express, and Discover. For enterprise customers, we also offer invoice-based payment options. All payments are processed securely through industry-standard payment processors.`,
      icon: <CreditCard size={18} className='text-red-500' />,
    },
  ]

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.07 },
    },
  }

  const itemVariants = {
    hidden: { y: 10, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 },
    },
  }

  return (
    <div className='w-full bg-gray-50 px-4 py-6 lg:py-10 md:px-6 lg:px-8 relative overflow-hidden'>
      {/* Header */}
      <motion.div
        className='max-w-4xl mx-auto text-center mb-8 relative z-10'
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className='inline-flex items-center px-2 md:px-4 py-1 md:py-2 mb-3 md:mb-4 space-x-1 md:space-x-2 text-xs md:text-sm font-medium text-gray-800 bg-white rounded-full shadow-sm'
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <HelpCircle size={16} className='text-gray-600' />
          <span>{`About Our Pricing`}</span>
        </motion.div>
        <h2 className='text-2xl md:text-3xl lg:text-4xl font-bold mb-3'>
          {`Frequently Asked Questions`}
        </h2>
        <p className='max-w-2xl mx-auto text-sm md:text-base lg:text-lg text-gray-600'>
          {`Get quick answers to common questions about our pricing plans, billing options, and subscription features.`}
        </p>
      </motion.div>

      {/* FAQ Items */}
      <motion.div
        className='max-w-4xl mx-auto relative z-10'
        variants={containerVariants}
        initial='hidden'
        animate='visible'
      >
        <div className='flex flex-col gap-3 md:max-w-none'>
          {/* Important: Mobile layout is vertical with added gap between items */}
          <div className='md:hidden space-y-3'>
            {faqItems.map((item, index) => (
              <FAQ_Item
                key={index}
                item={item}
                index={index}
                isOpen={openItemIndex === index}
                toggleQuestion={toggleQuestion}
                variants={itemVariants}
              />
            ))}
          </div>

          {/* Desktop layout manually split into two columns */}
          <div className='hidden md:flex md:gap-3'>
            {/* Left column - even indexed items */}
            <div className='flex-1 flex flex-col gap-3'>
              {faqItems
                .filter((_, i) => i % 2 === 0)
                .map((item, i) => {
                  const originalIndex = i * 2 // Calculate original index
                  return (
                    <FAQ_Item
                      key={originalIndex}
                      item={item}
                      index={originalIndex}
                      isOpen={openItemIndex === originalIndex}
                      toggleQuestion={toggleQuestion}
                      variants={itemVariants}
                    />
                  )
                })}
            </div>
            {/* Right column - odd indexed items */}
            <div className='flex-1 flex flex-col gap-3'>
              {faqItems
                .filter((_, i) => i % 2 === 1)
                .map((item, i) => {
                  const originalIndex = i * 2 + 1 // Calculate original index
                  return (
                    <FAQ_Item
                      key={originalIndex}
                      item={item}
                      index={originalIndex}
                      isOpen={openItemIndex === originalIndex}
                      toggleQuestion={toggleQuestion}
                      variants={itemVariants}
                    />
                  )
                })}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Bottom Section */}
      <motion.div
        className='mt-6 text-center relative z-10'
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <div className='inline-flex items-center space-x-3'>
          <div className='h-px w-12 bg-gray-300'></div>
          <p className='text-xs text-gray-500'>{`Still have questions?`}</p>
          <div className='h-px w-12 bg-gray-300'></div>
        </div>
        <div className='mt-3'>
          <button className='bg-gradient-to-br from-blue-600 to-blue-800 text-white text-xs px-4 py-2 rounded-md hover:bg-gray-800 transition-colors duration-200 shadow-sm'>
            {`Contact Sales`}
          </button>
        </div>
      </motion.div>
    </div>
  )
}

// Extract FAQ item as a separate component for cleaner code
const FAQ_Item = ({ item, index, isOpen, toggleQuestion, variants }) => {
  return (
    <motion.div
      variants={variants}
      className='bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 w-full'
    >
      <button
        onClick={() => toggleQuestion(index)}
        className='flex items-center justify-between w-full px-4 py-3 text-left'
      >
        <div className='flex items-center'>
          <span className='mr-3 p-1.5 rounded-md'>{item.icon}</span>
          <h3 className='font-medium text-gray-900 text-sm'>{item.question}</h3>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 0 : 0 }}
          transition={{ duration: 0.2 }}
          className='text-gray-400'
        >
          {isOpen ? <Minus size={14} /> : <Plus size={14} />}
        </motion.div>
      </button>
      {/* Content area */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          className='px-4 py-3 text-gray-600 text-xs border-t border-gray-100 bg-gray-50'
        >
          {item.answer}
        </motion.div>
      )}
    </motion.div>
  )
}

export default PricingFAQ
