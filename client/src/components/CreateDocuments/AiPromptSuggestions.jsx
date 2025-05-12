import { motion } from 'framer-motion'
import { RefreshCw, Sparkles, Wand2 } from 'lucide-react'
import React from 'react'

const AiPromptSuggestions = ({ suggestions, onSuggestionClick }) => {
  // Animation variants
  const aiSuggestionContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const aiSuggestionItem = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.2 } },
  }

  return (
    <motion.div variants={aiSuggestionItem} className='mt-3'>
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2'>
        <h4 className='text-base font-medium text-gray-700 flex items-center'>
          AI SUGGESTED PROMPTS
          <Sparkles className='h-4 w-4 ml-1.5 text-amber-500' />
        </h4>
        <div className='text-xs text-gray-500 italic mt-1 sm:mt-0'>
          Click any suggestion to apply it to your prompt
        </div>
      </div>

      <motion.div
        className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2'
        variants={aiSuggestionContainer}
        initial='hidden'
        animate='visible'
      >
        {suggestions?.map((suggestion, idx) => (
          <motion.button
            key={idx}
            variants={aiSuggestionItem}
            onClick={() => onSuggestionClick(suggestion)}
            className='text-xs px-2 py-2 rounded-md border border-gray-200 bg-gray-50 hover:bg-gray-100 hover:border-gray-300 transition-all text-gray-700 flex items-center justify-between group'
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className='truncate'>
              {suggestion.length > 80
                ? suggestion.substring(0, 77) + '...'
                : suggestion}
            </span>
            <span className='hidden group-hover:inline-flex flex-shrink-0 ml-1 transition-opacity'>
              <Wand2 className='h-3 w-3 text-amber-500' />
            </span>
          </motion.button>
        ))}
      </motion.div>
      <div className='mb-1'></div>
    </motion.div>
  )
}

export default AiPromptSuggestions
