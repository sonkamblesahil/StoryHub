import React from 'react'
import { Routes, Route } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import SignUpPage from './pages/SignUpPage'
import HomePage from './pages/HomePage'
import ViewPage from './pages/ViewPage'
import ProfilePage from './pages/ProfilePage'
import CreatePage from './pages/CreatePage'
import AllStoriesPage from './pages/AllStoriesPage'
import EditStoryPage from './pages/EditStoryPage'

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/create" element={<CreatePage />} />
      <Route path="/story/:id" element={<ViewPage />} />
      <Route path="/allstories" element={<AllStoriesPage />} />
      <Route path="/edit/:id" element={<EditStoryPage />} />
    </Routes>
  )
}

export default App
