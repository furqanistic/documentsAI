import { motion } from 'framer-motion'
import {
  ArrowRight,
  Book,
  Building,
  Check,
  Gift,
  Star,
  Users,
  X,
  Zap,
} from 'lucide-react'
import React, { useState } from 'react'
import Layout from '../Layout/Layout'

// Shadcn UI components
import PricingFAQ from '@/components/Pricing/PricingFAQ'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

// Free Plan Banner Component
const FreePlanBanner = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className='max-w-5xl mx-auto mb-6 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-xl overflow-hidden shadow-md border border-gray-200 dark:border-gray-700'
  >
    <div className='flex flex-col sm:flex-row items-center p-5 sm:p-6'>
      {/* Icon - centered on mobile */}
      <div className='rounded-full bg-white dark:bg-gray-800 p-2.5 w-12 h-12 flex items-center justify-center shadow-sm mb-4 sm:mb-0 sm:mr-6'>
        <Gift className='text-gray-600 dark:text-gray-300' size={24} />
      </div>

      {/* Content area with better mobile spacing */}
      <div className='flex-1 text-center sm:text-left mb-5 sm:mb-0 w-full sm:w-auto'>
        <h3 className='text-xl font-bold text-gray-900 dark:text-white'>
          Try it for Free
        </h3>

        {/* Feature grid - 2 columns on mobile, row on desktop */}
        <div className='mt-3 grid grid-cols-2 gap-y-2 gap-x-2 sm:flex sm:flex-row sm:items-center sm:gap-4 sm:mt-2'>
          <div className='flex items-center gap-1.5'>
            <Check className='h-4 w-4 flex-shrink-0 text-green-500 dark:text-green-400' />
            <span className='text-sm text-gray-700 dark:text-gray-300'>
              3 documents/mo
            </span>
          </div>
          <div className='flex items-center gap-1.5'>
            <Check className='h-4 w-4 flex-shrink-0 text-green-500 dark:text-green-400' />
            <span className='text-sm text-gray-700 dark:text-gray-300'>
              Basic templates
            </span>
          </div>
          <div className='flex items-center gap-1.5'>
            <Check className='h-4 w-4 flex-shrink-0 text-green-500 dark:text-green-400' />
            <span className='text-sm text-gray-700 dark:text-gray-300'>
              PDF export
            </span>
          </div>
          <div className='flex items-center gap-1.5'>
            <Check className='h-4 w-4 flex-shrink-0 text-green-500 dark:text-green-400' />
            <span className='text-sm text-gray-700 dark:text-gray-300'>
              Single language
            </span>
          </div>
        </div>
      </div>

      {/* Button - full width on mobile */}
      <Button
        size='sm'
        className='w-full sm:w-auto border border-gray-400 text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 rounded-md px-6 py-2 group whitespace-nowrap'
      >
        <span>Start Free</span>
        <ArrowRight className='ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform' />
      </Button>
    </div>
  </motion.div>
)

const PricingPage = () => {
  const [billingCycle, setBillingCycle] = useState('monthly')
  const [showComparison, setShowComparison] = useState(false)

  const toggleBilling = () => {
    setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')
  }

  const pricingPlans = [
    {
      name: 'Basic',
      icon: <Book className='text-blue-500' />,
      color: 'bg-blue-50 dark:bg-blue-800',
      textColor: 'text-gray-800 dark:text-white',
      monthlyPrice: '$4.99',
      yearlyPrice: '$49',
      subtitle: 'Essential Features',
      features: [
        '10 documents/mo',
        'Basic templates',
        'PDF export',
        'Dual language support',
        'Email support',
      ],
      popular: false,
      ctaText: 'Keep it Basic',
      ctaColor:
        'border border-blue-500 text-blue-600 bg-white hover:bg-blue-50 dark:bg-gray-900 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-900/20',
    },
    {
      name: 'Starter',
      icon: <Zap className='text-cyan-500' />,
      color: 'bg-cyan-50 dark:bg-gray-800',
      textColor: 'text-gray-800 dark:text-white',
      monthlyPrice: '$9.99',
      yearlyPrice: '$99',
      subtitle: 'Save ~17% yearly',
      features: [
        '25 documents/mo',
        'Expanded templates',
        'Multiple export formats',
        '10 languages support',
        '5 interactive tests/mo',
      ],
      popular: false,
      ctaText: 'Start Creating',
      ctaColor:
        'border border-cyan-500 text-cyan-600 bg-white hover:bg-cyan-50 dark:bg-gray-900 dark:border-cyan-400 dark:text-cyan-400 dark:hover:bg-cyan-900/20',
    },
    {
      name: 'Pro',
      icon: <Star className='text-orange-500' />,
      color: 'bg-orange-50 dark:bg-gray-800',
      textColor: 'text-gray-800 dark:text-white',
      monthlyPrice: '$24.99',
      yearlyPrice: '$249',
      subtitle: 'Save ~17% yearly',
      features: [
        '75 documents/mo',
        'Full template library',
        'All export formats',
        'Branded templates',
        '100+ languages',
        '10 interactive tests/mo',
        'Anti-cheating features',
      ],
      popular: true,
      ctaText: 'Go Pro',
      ctaColor:
        'border border-orange-500 text-orange-600 bg-white hover:bg-orange-50 dark:bg-gray-900 dark:border-orange-400 dark:text-orange-400 dark:hover:bg-orange-900/20',
    },
    {
      name: 'Team',
      icon: <Users className='text-green-500' />,
      color: 'bg-green-50 dark:bg-gray-800',
      textColor: 'text-gray-800 dark:text-white',
      monthlyPrice: '$99.99',
      yearlyPrice: '$999',
      subtitle: 'For up to 5 users',
      features: [
        '500 documents/mo',
        'Custom template creation',
        'Advanced branding',
        '100+ languages',
        'Total 25 interactive tests/mo',
        'Team collaboration',
        'User management',
      ],
      popular: false,
      ctaText: 'Team Up',
      ctaColor:
        'border border-green-500 text-green-600 bg-white hover:bg-green-50 dark:bg-gray-900 dark:border-green-400 dark:text-green-400 dark:hover:bg-green-900/20',
    },
    {
      name: 'Enterprise',
      icon: <Building className='text-purple-500' />,
      color: 'bg-purple-50 dark:bg-gray-800',
      textColor: 'text-gray-800 dark:text-white',
      monthlyPrice: 'Custom',
      yearlyPrice: 'Custom',
      subtitle: 'Contact for pricing',
      features: [
        'Unlimited everything',
        'White-labeling',
        'API access',
        'Custom AI training',
        'Dedicated support',
        'Enterprise security',
      ],
      popular: false,
      ctaText: 'Contact Sales',
      ctaColor:
        'border border-purple-500 text-purple-600 bg-white hover:bg-purple-50 dark:bg-gray-900 dark:border-purple-400 dark:text-purple-400 dark:hover:bg-purple-900/20',
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  }

  return (
    <Layout>
      <div className='bg-gray-50 min-h-screen'>
        {/* Hero section with animated background */}
        <div className='relative overflow-hidden py-10  bg-white dark:bg-gray-950'>
          <div className='absolute inset-0 z-0'>
            {/* Animated background elements */}
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                repeatType: 'reverse',
              }}
              className='absolute -top-20 -left-20 w-96 h-96 bg-blue-50 dark:bg-gray-800 rounded-full opacity-30 blur-3xl'
            />
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.2, 0.4, 0.2],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                repeatType: 'reverse',
                delay: 1,
              }}
              className='absolute bottom-0 right-0 w-96 h-96 bg-purple-50 dark:bg-gray-700 rounded-full opacity-20 blur-3xl'
            />
          </div>

          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10'>
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className='text-center max-w-3xl mx-auto mb-6'
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <h1 className='text-4xl md:text-5xl font-bold tracking-tight mb-2 text-gray-900 dark:text-white'>
                  Choose Your{' '}
                  <span className='bg-clip-text text-transparent bg-gradient-to-r bg-black'>
                    Plan
                  </span>
                </h1>
                <p className='text-lg text-gray-700 dark:text-gray-300 mb-4 max-w-2xl mx-auto'>
                  AI-powered document creation for educators, students, and
                  professionals.
                </p>
              </motion.div>

              {/* Billing toggle with improved styling */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className='inline-flex items-center justify-center bg-white dark:bg-gray-800 p-2 rounded-full shadow-sm border border-gray-100 dark:border-gray-700 mb-3'
              >
                <div className='flex items-center gap-4 px-3'>
                  <span
                    className={`text-sm font-medium ${
                      billingCycle === 'monthly'
                        ? 'text-gray-900 dark:text-white'
                        : 'text-gray-500 dark:text-gray-400'
                    }`}
                  >
                    Monthly
                  </span>
                  <Switch
                    checked={billingCycle === 'yearly'}
                    onCheckedChange={toggleBilling}
                    className='data-[state=checked]:bg-gray-900 dark:data-[state=checked]:bg-white dark:data-[state=checked]:text-gray-900'
                  />
                  <span
                    className={`text-sm font-medium flex items-center ${
                      billingCycle === 'yearly'
                        ? 'text-gray-900 dark:text-white'
                        : 'text-gray-500 dark:text-gray-400'
                    }`}
                  >
                    Yearly{' '}
                    <Badge
                      variant='outline'
                      className='ml-1.5 bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-100 dark:border-green-800'
                    >
                      Save 17%
                    </Badge>
                  </span>
                </div>
              </motion.div>

              {/* Toggle comparison view */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className='my-4 flex justify-center'
              >
                <Button
                  onClick={() => setShowComparison(!showComparison)}
                  className='bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors duration-200 rounded-md px-8 py-2 flex items-center justify-center gap-2 font-medium'
                  size='sm'
                >
                  <span>
                    {showComparison
                      ? 'Hide comparison table'
                      : 'View full comparison'}
                  </span>
                  <ArrowRight
                    size={14}
                    className={`transition-transform duration-300 ${
                      showComparison ? 'rotate-90' : ''
                    }`}
                  />
                </Button>
              </motion.div>
            </motion.div>

            {/* Free Plan Banner - Added here */}
            <FreePlanBanner />

            {showComparison ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className='mb-16 overflow-x-auto'
              >
                {/* Fixed width container that doesn't change size, centered with mx-auto */}
                <div
                  className='mx-auto'
                  style={{ width: '1200px', maxWidth: '100%' }}
                >
                  <div className='rounded-xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700'>
                    <Table className='bg-white dark:bg-gray-900 table-fixed w-full'>
                      <TableHeader>
                        <TableRow className='bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700'>
                          <TableHead
                            className='py-4 px-6 text-left font-bold'
                            style={{ width: '220px' }}
                          >
                            Features
                          </TableHead>
                          {/* Free plan added as first column with fixed width */}
                          <TableHead
                            className='text-center py-4 px-4'
                            style={{ width: '160px' }}
                          >
                            <div className='space-y-1 py-2 px-3 rounded-lg'>
                              <div className='font-bold text-gray-900 dark:text-white flex items-center justify-center gap-1'>
                                Free
                              </div>
                              <div className='font-semibold text-lg whitespace-nowrap'>
                                $0
                                <span className='text-xs text-gray-500 dark:text-gray-400'>
                                  /mo
                                </span>
                              </div>
                            </div>
                          </TableHead>
                          {/* Regular pricing plans with fixed width */}
                          {pricingPlans.map((plan) => (
                            <TableHead
                              key={plan.name}
                              className='text-center py-4 px-4'
                              style={{ width: '160px' }}
                            >
                              <div className='space-y-1 py-2 px-3 rounded-lg'>
                                <div className='font-bold text-gray-900 dark:text-white flex items-center justify-center gap-1'>
                                  {plan.name}
                                </div>
                                <div className='font-semibold text-lg whitespace-nowrap'>
                                  {billingCycle === 'monthly'
                                    ? plan.monthlyPrice
                                    : plan.yearlyPrice}
                                  <span className='text-xs text-gray-500 dark:text-gray-400'>
                                    {plan.monthlyPrice !== 'Custom' &&
                                      `/${
                                        billingCycle === 'monthly' ? 'mo' : 'yr'
                                      }`}
                                  </span>
                                </div>
                              </div>
                            </TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {[
                          {
                            feature: 'Documents',
                            values: [
                              '3/mo', // Free plan
                              '10/mo', // Basic plan
                              '25/mo',
                              '75/mo',
                              '500/mo',
                              'Unlimited',
                            ],
                          },
                          {
                            feature: 'Templates',
                            values: [
                              'Basic',
                              'Basic',
                              'Expanded',
                              'Full Library',
                              'Full + Custom',
                              'Full + Bespoke',
                            ],
                          },
                          {
                            feature: 'Export Formats',
                            values: [
                              'PDF Only',
                              'PDF Only',
                              'Multiple Formats',
                              'All Formats',
                              'All Formats',
                              'All Formats',
                            ],
                          },
                          {
                            feature: 'Interactive Tests',
                            values: [
                              '1/mo',
                              '5/mo',
                              '10/mo',
                              '25/mo',
                              '50/mo',
                              'Unlimited',
                            ],
                          },
                          {
                            feature: 'Languages',
                            values: [
                              'Single',
                              'Dual',
                              '10 Languages',
                              '100+ Languages',
                              '100+ Languages',
                              '100+ Languages',
                            ],
                          },
                          {
                            feature: 'Team Access',
                            values: [
                              false,
                              false,
                              false,
                              false,
                              '5 Users',
                              'Unlimited',
                            ],
                          },
                          {
                            feature: 'API Access',
                            values: [false, false, false, false, false, true],
                          },
                          {
                            feature: 'Support',
                            values: [
                              'Basic',
                              'Email',
                              'Email',
                              'Priority',
                              'Priority + Phone',
                              '24/7 Dedicated',
                            ],
                          },
                        ].map((row, i) => (
                          <TableRow
                            key={i}
                            className='border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                          >
                            <TableCell
                              className='font-medium py-4 px-6'
                              style={{ width: '220px' }}
                            >
                              {row.feature}
                            </TableCell>
                            {row.values.map((value, j) => (
                              <TableCell
                                key={j}
                                className='text-center py-4'
                                style={{ width: '160px' }}
                              >
                                {typeof value === 'boolean' ? (
                                  value ? (
                                    <Check
                                      className='mx-auto text-green-500'
                                      size={18}
                                    />
                                  ) : (
                                    <X
                                      className='mx-auto text-gray-400'
                                      size={18}
                                    />
                                  )
                                ) : (
                                  <span className='text-sm whitespace-nowrap'>
                                    {value}
                                  </span>
                                )}
                              </TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </motion.div>
            ) : (
              /* Pricing cards */
              <motion.div
                variants={containerVariants}
                initial='hidden'
                animate='visible'
                className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-y-6 gap-x-3 sm:gap-6 mb-0 sm:mb-0 mt-2 sm:mt-2'
              >
                {pricingPlans.map((plan) => (
                  <motion.div
                    key={plan.name}
                    variants={itemVariants}
                    whileHover={{ y: -5 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                    className={`h-full ${plan.popular ? 'z-10' : ''}`}
                  >
                    <Card
                      className={`h-full border relative rounded-lg sm:rounded-xl mt-2 sm:mt-4 ${
                        plan.popular
                          ? `border-amber-200 dark:border-amber-800/50 shadow-lg`
                          : 'border-gray-200 dark:border-gray-800 shadow-md hover:shadow-lg'
                      } transition-all duration-300 flex flex-col`}
                    >
                      {/* Popular badge */}
                      {plan.popular && (
                        <div className='absolute -top-3 sm:-top-4 right-3 sm:right-4 z-50'>
                          <div className='bg-amber-500 text-white px-2 sm:px-4 py-0.5 sm:py-1.5 rounded-full shadow-md text-xs sm:text-sm font-medium tracking-wide'>
                            MOST POPULAR
                          </div>
                        </div>
                      )}

                      {/* Card header with icon and plan name */}
                      <CardHeader
                        className={`${plan.color} ${plan.textColor} pt-3 pb-1 sm:pt-6 sm:pb-3 px-2 sm:px-6`}
                      >
                        <div className='flex items-center gap-1.5 sm:gap-3 mb-0 sm:mb-1'>
                          <div className='rounded-full bg-white dark:bg-gray-900 p-1 sm:p-2.5 w-8 h-8 sm:w-11 sm:h-11 flex items-center justify-center shadow-sm'>
                            {plan.icon}
                          </div>
                          <span className='font-bold text-lg sm:text-2xl'>
                            {plan.name}
                          </span>
                        </div>
                        <p className='text-xs sm:text-sm opacity-80 mt-0.5 sm:mt-1'>
                          {plan.description}
                        </p>
                      </CardHeader>
                      {/* Pricing */}
                      <CardContent className='pt-0 pb-0 px-2 sm:pt-3 sm:pb-2 sm:px-6'>
                        <div className='flex justify-center sm:justify-start items-baseline'>
                          <span className='text-2xl sm:text-3xl font-bold'>
                            {billingCycle === 'monthly'
                              ? plan.monthlyPrice
                              : plan.yearlyPrice}
                          </span>
                          {plan.monthlyPrice !== 'Custom' && (
                            <span className='text-base sm:text-sm font-normal text-gray-500 dark:text-gray-400'>
                              {' '}
                              {`/${billingCycle === 'monthly' ? 'mo' : 'yr'}`}
                            </span>
                          )}
                        </div>
                        <p className='text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0 mb-2 text-center sm:text-left'>
                          {plan.subtitle}
                        </p>

                        {/* Features - UPDATED SPACING AND FONT SIZE */}
                        <div className='mt-0 mb-0 sm:mt-4'>
                          <ul className='space-y-2 sm:space-y-2.5'>
                            {plan.features.map((feature, i) => (
                              <li
                                key={i}
                                className='flex items-start text-sm sm:text-sm'
                              >
                                <Check className='h-3.5 w-3.5 sm:h-4 sm:w-4 text-green-500 dark:text-green-400 flex-shrink-0 mt-0.5 mr-2 sm:mr-2' />
                                <span>{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </CardContent>
                      {/* CTA Button */}
                      <CardFooter className='mt-auto pb-0 pt-0 sm:pb-2 px-2 sm:px-6'>
                        <Button
                          size='sm'
                          className={`w-full group ${
                            plan.ctaColor || 'bg-gray-900 text-white'
                          } rounded-md py-1 sm:h-10`}
                        >
                          <span className='text-xs sm:text-sm'>
                            {plan.ctaText}
                          </span>
                          <ArrowRight className='ml-1 sm:ml-2 h-3 w-3 sm:h-4 sm:w-4 transform group-hover:translate-x-1 transition-transform' />
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </div>
        <PricingFAQ />

        {/* CTA section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7 }}
          className='pt-0 pb-6 sm:pb-12 bg-gray-50 dark:bg-gray-950'
        >
          <div className='max-w-5xl mx-auto px-4 sm:px-6 lg:px-8'>
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className='relative overflow-hidden rounded-xl bg-gradient-to-r from-gray-900 to-black p-5 sm:p-8 md:p-10'
            >
              {/* Enhanced background */}
              <div className='absolute inset-0 z-0 opacity-30'>
                <div className='absolute top-0 right-0 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl -mr-20 -mt-20'></div>
                <div className='absolute bottom-0 left-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl -ml-10 -mb-10'></div>
              </div>

              <div className='relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between'>
                <div className='mb-5 sm:mb-0 sm:max-w-lg'>
                  <h2 className='text-xl sm:text-2xl md:text-3xl font-bold mb-2 text-white'>
                    Transform your workflow with AI
                  </h2>
                  <p className='text-sm sm:text-base text-gray-300/90 max-w-md'>
                    Join thousands of educators, students, and professionals who
                    create better documents in less time.
                  </p>
                </div>
                <div className='flex flex-row gap-2 sm:gap-3'>
                  <Button
                    size='sm'
                    className='bg-white text-gray-900 hover:bg-gray-100 rounded-md px-4 sm:px-6 py-1.5 sm:py-2 text-sm sm:text-base flex-1 sm:flex-none'
                  >
                    Start Free
                  </Button>
                  <Button
                    size='sm'
                    className='bg-transparent border border-white/50 text-white hover:bg-white/10 rounded-md px-4 sm:px-6 py-1.5 sm:py-2 text-sm sm:text-base flex-1 sm:flex-none'
                  >
                    Watch Demo
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </Layout>
  )
}

export default PricingPage
