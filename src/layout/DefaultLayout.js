import React from 'react'
import { AppContent, AppSidebar, AppFooter, AppHeader } from '../components/index'

const DefaultLayout = () => {
  return (
    <div>
      <AppSidebar />
      <div
        className="wrapper d-flex flex-column min-vh-100 bg-light"
        style={{
          backgroundImage: `url(${require('../assets/bg.jpeg')})`,
          backgroundSize: '100% 100%',
        }}
      >
        <AppHeader />
        <div className="body flex-grow-1 px-3">
          <AppContent />
        </div>
      </div>
    </div>
  )
}

export default DefaultLayout
