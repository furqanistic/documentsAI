import { motion } from 'framer-motion'
import {
  ArrowRight,
  Bell,
  Building,
  Eye,
  FileText,
  Lock,
  Mail,
  Shield,
  UserCog,
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
          Privacy Policy
        </h1>
      </motion.div>

      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <p className='text-base text-gray-600 mb-3'>
          At Calani, we take your privacy seriously. This policy outlines how we
          collect, use, and protect your information when using our AI-powered
          document creation platform.
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
    { id: 'information-collection', title: 'Information We Collect' },
    { id: 'information-usage', title: 'How We Use Your Information' },
    { id: 'ai-data', title: 'AI Technology & Your Data' },
    { id: 'data-security', title: 'Data Security' },
    { id: 'third-party', title: 'Third-Party Services' },
    { id: 'user-rights', title: 'Your Rights & Choices' },
    { id: 'policy-updates', title: 'Policy Updates' },
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

// Main Privacy Policy Component
const PrivacyPolicy = () => {
  return (
    <div className='min-h-screen bg-white'>
      <div className='max-w-6xl mx-auto px-4 py-8'>
        <Hero />
        <TableOfContents />

        <div>
          <PolicySection
            icon={<FileText size={22} />}
            title='Information We Collect'
            delay={0.5}
            id='information-collection'
          >
            <Paragraph>
              Calani collects various types of information to provide and
              improve our AI-powered document creation services:
            </Paragraph>

            <SubSection title='Account Information'>
              <Paragraph>
                When you create an account, we collect information such as your
                name, email address, professional role, and institution or
                organization name.
              </Paragraph>
            </SubSection>

            <SubSection title='Content & Documents'>
              <Paragraph>
                We collect the content you create, upload, or generate using our
                platform, including document templates, questions, answers, and
                other materials you create with our AI tools.
              </Paragraph>
            </SubSection>

            <SubSection title='Usage Information'>
              <Paragraph>
                We collect data about how you interact with our platform,
                including features you use, documents you create, time spent on
                the platform, and other analytics that help us improve our
                services.
              </Paragraph>
            </SubSection>

            <SubSection title='Technical Information'>
              <Paragraph>
                This includes IP addresses, device information, browser type,
                operating system, and other technical details that help us
                optimize your experience and troubleshoot issues.
              </Paragraph>
            </SubSection>
          </PolicySection>

          <PolicySection
            icon={<Eye size={24} />}
            title='How We Use Your Information'
            delay={0.6}
            id='information-usage'
          >
            <Paragraph>
              Calani uses the collected information for the following purposes:
            </Paragraph>

            <BulletList
              items={[
                'Providing and maintaining our AI document creation services',
                'Personalizing your experience and improving our platform',
                'Communicating with you about service updates, features, and educational resources',
                'Processing payments and managing your subscription',
                'Analyzing usage patterns to enhance our AI capabilities',
                'Ensuring the security and integrity of our platform',
                'Complying with legal obligations',
              ]}
            />

            <Paragraph>
              We process your information based on legitimate interests,
              contractual necessity, your consent, and legal obligations, as
              applicable.
            </Paragraph>
          </PolicySection>

          <PolicySection
            icon={<UserCog size={24} />}
            title='AI Technology & Your Data'
            delay={0.7}
            id='ai-data'
          >
            <Paragraph>
              As an AI-powered platform, Calani uses advanced algorithms and
              machine learning technologies:
            </Paragraph>

            <SubSection title='AI Content Generation'>
              <Paragraph>
                Our AI systems process your inputs (such as topic descriptions
                or content requirements) to generate customized documents,
                questions, and educational materials.
              </Paragraph>
            </SubSection>

            <SubSection title='Learning & Improvement'>
              <Paragraph>
                With your permission, we may use anonymized content to improve
                our AI models. This helps us enhance our document generation
                capabilities, response quality, and educational effectiveness.
              </Paragraph>
            </SubSection>

            <SubSection title='Opt-Out Options'>
              <Paragraph>
                You can opt out of having your anonymized content used for AI
                improvement in your account settings. This will not affect the
                quality of service you receive.
              </Paragraph>
            </SubSection>
          </PolicySection>

          <PolicySection
            icon={<Lock size={24} />}
            title='Data Security'
            delay={0.8}
            id='data-security'
          >
            <Paragraph>
              Protecting your information is our priority. We implement robust
              security measures:
            </Paragraph>

            <BulletList
              items={[
                'Encryption of data in transit and at rest',
                'Regular security assessments and penetration testing',
                'Strict access controls for employee access to user data',
                'Automated threat detection systems',
                'Regular security training for all staff',
                'Compliance with industry security standards',
              ]}
            />

            <Paragraph>
              While we implement strong safeguards, no system is completely
              immune to security risks. We continually update our security
              practices to address emerging threats.
            </Paragraph>
          </PolicySection>

          <PolicySection
            icon={<Building size={24} />}
            title='Third-Party Services'
            delay={0.9}
            id='third-party'
          >
            <Paragraph>
              Calani works with select third-party service providers to deliver
              our platform:
            </Paragraph>

            <BulletList
              items={[
                'Cloud hosting and infrastructure providers',
                'Payment processors for subscription management',
                'Analytics tools to improve user experience',
                'Customer support systems',
                'Communication services for emails and notifications',
              ]}
            />

            <Paragraph>
              These providers are contractually obligated to protect your data
              and may only access it to perform services on our behalf. We don't
              sell your personal information to third parties.
            </Paragraph>
          </PolicySection>

          <PolicySection
            icon={<Shield size={24} />}
            title='Your Rights & Choices'
            delay={1.0}
            id='user-rights'
          >
            <Paragraph>
              Depending on your location, you have various rights regarding your
              personal information:
            </Paragraph>

            <BulletList
              items={[
                'Access and download your personal data',
                'Request correction of inaccurate information',
                'Delete your account and associated data',
                'Restrict or object to certain processing activities',
                'Export your created content and documents',
                'Opt out of AI training using your data',
                'Manage communication preferences',
              ]}
            />

            <Paragraph>
              To exercise these rights, access your account settings or contact
              our privacy team directly.
            </Paragraph>
          </PolicySection>

          <PolicySection
            icon={<Bell size={24} />}
            title='Policy Updates'
            delay={1.1}
            id='policy-updates'
          >
            <Paragraph>
              We may update this Privacy Policy periodically to reflect changes
              in our practices, technologies, legal requirements, or other
              factors.
            </Paragraph>

            <Paragraph>
              When we make significant changes, we'll notify you through:
            </Paragraph>

            <BulletList
              items={[
                'Email notifications to your registered address',
                'Notices within our platform',
                'Updates on our website',
              ]}
            />

            <Paragraph>
              We encourage you to review our Privacy Policy regularly. Your
              continued use of Calani after policy changes constitutes
              acceptance of the updated terms.
            </Paragraph>
          </PolicySection>

          <PolicySection
            icon={<Mail size={24} />}
            title='Contact Us'
            delay={1.2}
            id='contact'
          >
            <Paragraph>
              If you have questions, concerns, or requests regarding this
              Privacy Policy or our privacy practices, please contact us:
            </Paragraph>

            <div className='border-l-2 border-gray-200 pl-4 mt-6'>
              <ContactItem
                icon={<Mail size={16} />}
                title='Email Address'
                value='help@calani.ai'
              />
            </div>

            <Paragraph className='mt-6'>
              We strive to respond to all inquiries promptly, typically within 5
              business days.
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

const PrivacyPolicyPage = () => (
  <Layout>
    <PrivacyPolicy />
  </Layout>
)

export default PrivacyPolicyPage
