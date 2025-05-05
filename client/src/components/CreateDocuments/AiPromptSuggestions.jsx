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
    <motion.div variants={aiSuggestionItem} className='mt-6'>
      <div className='mb-2 flex items-center justify-between'>
        <h4 className='text-xs font-medium text-gray-500 flex items-center'>
          <Sparkles className='h-3 w-3 mr-1 text-amber-500' />
          AI SUGGESTED PROMPTS
        </h4>
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
            className='text-xs px-3 py-2 rounded-md border border-gray-200 bg-gray-50 hover:bg-gray-100 hover:border-gray-300 transition-all text-gray-700 flex items-center justify-between group'
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className='truncate pr-2'>
              {suggestion.length > 60
                ? suggestion.substring(0, 57) + '...'
                : suggestion}
            </span>
            <span className='flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity'>
              <Wand2 className='h-3 w-3 text-amber-500' />
            </span>
          </motion.button>
        ))}
      </motion.div>

      <div className='mt-2 text-xs text-gray-500 italic'>
        Click any suggestion to apply it to your prompt
      </div>
    </motion.div>
  )
}

export default AiPromptSuggestions
