import CalaniFAQ from '@/components/Home/CalaniFAQ'
import Footer from '@/components/Home/Footer'
import Hero from '@/components/Home/Hero'
import HowItWorks from '@/components/Home/HowItWorks'
import TemplateGallery from '@/components/Home/TemplateGallery'
import Testimonials from '@/components/Home/Testimonials'
import React from 'react'
import Layout from '../Layout/Layout'

const HomePage = () => {
  return (
    <Layout>
      <Hero />
      <HowItWorks />
      <TemplateGallery />
      <Testimonials />
      <CalaniFAQ />
      <Footer />
    </Layout>
  )
}

export default HomePage
