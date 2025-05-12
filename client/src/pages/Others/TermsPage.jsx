import { motion } from 'framer-motion'
import {
  AlertCircle,
  ArrowRight,
  Bell,
  Building,
  CreditCard,
  FileCheck,
  FileText,
  Gavel,
  Lock,
  Mail,
  MessageSquare,
  Scale,
  Shield,
  UserCheck,
  XCircle,
} from 'lucide-react'
import React from 'react'
import Layout from '../Layout/Layout'

// Reusable components
const PolicySection = ({ icon, title, children, delay = 0, id }) => {
  return (
    <motion.div
      className='mb-12'
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      id={id}
    >
      <div className='flex items-center mb-5 pb-3 border-b border-gray-100'>
        <div className='mr-3 text-gray-700'>{icon}</div>
        <h2 className='text-xl font-medium text-gray-900'>{title}</h2>
      </div>
      <div className='text-gray-600'>{children}</div>
    </motion.div>
  )
}

const Paragraph = ({ children, className = '' }) => (
  <p className={`mb-4 leading-relaxed ${className}`}>{children}</p>
)

const SubSection = ({ title, children }) => (
  <div className='mt-6 mb-5'>
    <h3 className='text-base font-medium text-gray-800 mb-3'>{title}</h3>
    <div>{children}</div>
  </div>
)

const BulletList = ({ items }) => (
  <ul className='pl-5 mb-4 space-y-2 text-gray-600'>
    {items.map((item, index) => (
      <li
        key={index}
        className="relative pl-2 before:content-[''] before:absolute before:left-[-8px] before:top-[10px] before:w-[3px] before:h-[3px] before:bg-gray-400 before:rounded-full"
      >
        {item}
      </li>
    ))}
  </ul>
)

const SectionDivider = () => <div className='w-full h-px bg-gray-100 my-10' />

const ContactItem = ({ icon, title, value }) => (
  <div className='flex items-center py-3'>
    <div className='mr-3 text-gray-400'>{icon}</div>
    <div>
      <p className='text-xs text-gray-500'>{title}</p>
      <p className='text-sm font-medium text-gray-700'>{value}</p>
    </div>
  </div>
)

const Hero = () => (
  <motion.div
    className='py-6 border-b border-gray-100 mb-8'
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5 }}
  >
    <div className='max-w-6xl mx-auto'>
      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className='text-2xl md:text-3xl font-semibold text-gray-900 mb-2 tracking-tight'>
          Terms and Conditions
        </h1>
      </motion.div>

      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <p className='text-base text-gray-600 mb-3'>
          Welcome to Calani. These terms and conditions outline your rights and
          responsibilities when using our AI-powered document creation platform.
          By using Calani, you agree to be bound by these terms.
        </p>
      </motion.div>

      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className='flex items-center'
      >
        <p className='text-xs text-gray-500'>Last Updated: May 11, 2025</p>
      </motion.div>
    </div>
  </motion.div>
)

const TableOfContents = () => {
  const sections = [
    { id: 'account-terms', title: 'Account Terms' },
    { id: 'subscription-billing', title: 'Subscription & Billing' },
    { id: 'intellectual-property', title: 'Intellectual Property' },
    { id: 'ai-content', title: 'AI-Generated Content' },
    { id: 'acceptable-use', title: 'Acceptable Use Policy' },
    { id: 'service-availability', title: 'Service Availability' },
    { id: 'limitation-liability', title: 'Limitation of Liability' },
    { id: 'termination', title: 'Termination' },
    { id: 'modifications', title: 'Modifications' },
    { id: 'contact', title: 'Contact Us' },
  ]

  const scrollToSection = (id) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <motion.div
      className='mb-8'
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
    >
      <div className='grid grid-cols-1 md:grid-cols-2 gap-1'>
        {sections.map((section, index) => (
          <motion.button
            key={section.id}
            className='flex items-center justify-between px-3 py-1.5 text-left text-gray-700 border-b border-gray-50 hover:bg-gray-50 transition-colors group w-full'
            onClick={() => scrollToSection(section.id)}
            whileHover={{ x: 3 }}
            transition={{ type: 'spring', stiffness: 500, damping: 20 }}
          >
            <span className='text-xs font-medium'>{section.title}</span>
            <ArrowRight className='w-3 h-3 text-gray-400 group-hover:text-gray-700 transition-colors' />
          </motion.button>
        ))}
      </div>
    </motion.div>
  )
}

// Main Terms and Conditions Component
const TermsAndConditions = () => {
  return (
    <div className='min-h-screen bg-white'>
      <div className='max-w-6xl mx-auto px-4 py-8'>
        <Hero />
        <TableOfContents />

        <div>
          <PolicySection
            icon={<UserCheck size={22} />}
            title='Account Terms'
            delay={0.5}
            id='account-terms'
          >
            <Paragraph>
              To use Calani's services, you must create an account and agree to
              these terms:
            </Paragraph>

            <SubSection title='Account Registration'>
              <Paragraph>
                You must provide accurate, complete, and current information
                during registration. You are responsible for maintaining the
                confidentiality of your account credentials.
              </Paragraph>
            </SubSection>

            <SubSection title='Account Responsibility'>
              <BulletList
                items={[
                  'You are responsible for all activities under your account',
                  'Notify us immediately of any unauthorized use',
                  'You may not share your account with others',
                  'One person or entity per account (unless enterprise account)',
                  'Keep your account information up to date',
                ]}
              />
            </SubSection>
          </PolicySection>

          <PolicySection
            icon={<CreditCard size={24} />}
            title='Subscription & Billing'
            delay={0.6}
            id='subscription-billing'
          >
            <Paragraph>
              Calani offers various subscription plans for accessing our
              AI-powered document creation services:
            </Paragraph>

            <SubSection title='Subscription Plans'>
              <Paragraph>
                We offer monthly and annual subscription options with different
                feature sets. Your subscription automatically renews unless
                canceled before the renewal date.
              </Paragraph>
            </SubSection>

            <SubSection title='Payment Terms'>
              <BulletList
                items={[
                  'All fees are in USD unless otherwise specified',
                  'Payments are processed securely through our payment partners',
                  'Subscription fees are non-refundable except as required by law',
                  'We may change pricing with 30 days notice',
                  'Failed payments may result in service suspension',
                ]}
              />
            </SubSection>

            <SubSection title='Free Trials'>
              <Paragraph>
                We may offer free trials. At the end of the trial, your account
                will convert to a paid subscription unless you cancel.
              </Paragraph>
            </SubSection>
          </PolicySection>

          <PolicySection
            icon={<FileCheck size={24} />}
            title='Intellectual Property Rights'
            delay={0.7}
            id='intellectual-property'
          >
            <Paragraph>
              Understanding content ownership is crucial when using Calani:
            </Paragraph>

            <SubSection title='Your Content'>
              <Paragraph>
                You retain ownership of any original content you upload or
                create using Calani. By using our service, you grant us a
                license to process, store, and display your content as necessary
                to provide the service.
              </Paragraph>
            </SubSection>

            <SubSection title='Calani Platform'>
              <Paragraph>
                The Calani platform, including its software, design, templates,
                and AI models, is protected by intellectual property laws. You
                may not copy, modify, or reverse engineer any part of our
                service.
              </Paragraph>
            </SubSection>

            <SubSection title='Feedback'>
              <Paragraph>
                Any feedback, suggestions, or ideas you provide about Calani may
                be used by us without compensation or attribution.
              </Paragraph>
            </SubSection>
          </PolicySection>

          <PolicySection
            icon={<Shield size={24} />}
            title='AI-Generated Content'
            delay={0.8}
            id='ai-content'
          >
            <Paragraph>
              Special terms apply to content generated using our AI technology:
            </Paragraph>

            <SubSection title='Content Ownership'>
              <Paragraph>
                Content generated by Calani's AI based on your inputs is owned
                by you, subject to our license to improve our service.
              </Paragraph>
            </SubSection>

            <SubSection title='Usage Rights'>
              <BulletList
                items={[
                  'You may use AI-generated content for personal, educational, or commercial purposes',
                  'You are responsible for reviewing and verifying AI-generated content',
                  'You must not use AI-generated content for illegal or harmful purposes',
                  'Attribution to Calani is appreciated but not required',
                ]}
              />
            </SubSection>

            <SubSection title='Accuracy Disclaimer'>
              <Paragraph>
                While we strive for accuracy, AI-generated content may contain
                errors. You are responsible for reviewing and editing content
                before use.
              </Paragraph>
            </SubSection>
          </PolicySection>

          <PolicySection
            icon={<AlertCircle size={24} />}
            title='Acceptable Use Policy'
            delay={0.9}
            id='acceptable-use'
          >
            <Paragraph>
              You agree not to use Calani for any prohibited purposes:
            </Paragraph>

            <SubSection title='Prohibited Activities'>
              <BulletList
                items={[
                  'Violating any laws or regulations',
                  'Infringing on intellectual property rights',
                  'Creating harmful, offensive, or discriminatory content',
                  'Attempting to compromise our security or systems',
                  'Impersonating others or creating false identities',
                  'Using automated systems to abuse the service',
                  'Sharing or reselling your account access',
                  'Creating content for fraudulent purposes',
                ]}
              />
            </SubSection>

            <SubSection title='Content Standards'>
              <Paragraph>
                All content created with Calani must be appropriate for
                educational and professional use. We reserve the right to remove
                content that violates these standards.
              </Paragraph>
            </SubSection>
          </PolicySection>

          <PolicySection
            icon={<Building size={24} />}
            title='Service Availability'
            delay={1.0}
            id='service-availability'
          >
            <Paragraph>
              We strive to provide reliable service but cannot guarantee
              uninterrupted availability:
            </Paragraph>

            <BulletList
              items={[
                'Calani is provided "as is" without warranties',
                'We may experience downtime for maintenance',
                'Service features may change or be discontinued',
                'We do not guarantee specific uptime percentages',
                'Internet connectivity issues are your responsibility',
              ]}
            />

            <SubSection title='Service Modifications'>
              <Paragraph>
                We reserve the right to modify, suspend, or discontinue any part
                of our service with reasonable notice when possible.
              </Paragraph>
            </SubSection>
          </PolicySection>

          <PolicySection
            icon={<Scale size={24} />}
            title='Limitation of Liability'
            delay={1.1}
            id='limitation-liability'
          >
            <Paragraph>
              Our liability is limited to the maximum extent permitted by law:
            </Paragraph>

            <SubSection title='Disclaimer'>
              <Paragraph>
                Calani is not liable for any indirect, incidental, special,
                consequential, or punitive damages arising from your use of our
                service.
              </Paragraph>
            </SubSection>

            <SubSection title='Liability Cap'>
              <Paragraph>
                Our total liability shall not exceed the amount you paid to
                Calani in the 12 months preceding the claim.
              </Paragraph>
            </SubSection>

            <SubSection title='Indemnification'>
              <Paragraph>
                You agree to indemnify Calani against any claims arising from
                your use of the service or violation of these terms.
              </Paragraph>
            </SubSection>
          </PolicySection>

          <PolicySection
            icon={<XCircle size={24} />}
            title='Termination'
            delay={1.2}
            id='termination'
          >
            <Paragraph>
              Either party may terminate this agreement under certain
              conditions:
            </Paragraph>

            <SubSection title='Your Termination Rights'>
              <Paragraph>
                You may cancel your subscription at any time through your
                account settings. Cancellation takes effect at the end of the
                current billing period.
              </Paragraph>
            </SubSection>

            <SubSection title='Our Termination Rights'>
              <Paragraph>
                We may suspend or terminate your account for:
              </Paragraph>
              <BulletList
                items={[
                  'Violation of these terms or our policies',
                  'Non-payment of subscription fees',
                  'Suspected fraudulent or illegal activity',
                  'Extended periods of inactivity',
                ]}
              />
            </SubSection>

            <SubSection title='Effect of Termination'>
              <Paragraph>
                Upon termination, your right to use Calani ceases immediately.
                You may export your content within 30 days of termination.
              </Paragraph>
            </SubSection>
          </PolicySection>

          <PolicySection
            icon={<Bell size={24} />}
            title='Modifications to Terms'
            delay={1.3}
            id='modifications'
          >
            <Paragraph>
              We may update these terms periodically to reflect changes in our
              services or legal requirements:
            </Paragraph>

            <BulletList
              items={[
                'We will notify you of material changes via email or platform notification',
                'Changes take effect 30 days after notification',
                'Continued use after changes constitutes acceptance',
                'You may terminate if you disagree with changes',
                'Minor changes may be made without notice',
              ]}
            />

            <Paragraph>
              We encourage you to review these terms regularly to stay informed
              of any updates.
            </Paragraph>
          </PolicySection>

          <PolicySection
            icon={<Gavel size={24} />}
            title='Governing Law'
            delay={1.4}
            id='governing-law'
          >
            <Paragraph>
              These terms are governed by the laws of the United States and the
              State of Delaware, without regard to conflict of law principles.
            </Paragraph>

            <SubSection title='Dispute Resolution'>
              <Paragraph>
                Any disputes arising from these terms shall be resolved through
                binding arbitration in Delaware, except where prohibited by law.
              </Paragraph>
            </SubSection>

            <SubSection title='Class Action Waiver'>
              <Paragraph>
                You agree to resolve disputes individually and waive any right
                to participate in class actions.
              </Paragraph>
            </SubSection>
          </PolicySection>

          <PolicySection
            icon={<Mail size={24} />}
            title='Contact Us'
            delay={1.5}
            id='contact'
          >
            <Paragraph>
              If you have questions about these Terms and Conditions, please
              contact us:
            </Paragraph>

            <div className='border-l-2 border-gray-200 pl-4 mt-6'>
              <ContactItem
                icon={<MessageSquare size={16} />}
                title='Support'
                value='help@calani.ai'
              />
            </div>

            <Paragraph className='mt-6'>
              For general support inquiries, please use our help center or
              contact our support team.
            </Paragraph>
          </PolicySection>

          <SectionDivider />

          <motion.div
            className='text-center text-gray-500 text-sm pt-8'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 1.0 }}
          >
            <p>© 2025 Calani AI Inc. All rights reserved.</p>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

const TermsAndConditionsPage = () => (
  <Layout>
    <TermsAndConditions />
  </Layout>
)

export default TermsAndConditionsPage
