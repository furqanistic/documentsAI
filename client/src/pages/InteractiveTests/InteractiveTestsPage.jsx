import InteractiveTestsHeader from '@/components/InteractiveTests/InteractiveTestsHeader'
import InteractiveTestsMain from '@/components/InteractiveTests/InteractiveTestsMain'
import React from 'react'
import Layout from '../Layout/Layout'

const InteractiveTestsPage = () => {
  return (
    <Layout>
      <InteractiveTestsHeader />
      <InteractiveTestsMain />
    </Layout>
  )
}

export default InteractiveTestsPage
