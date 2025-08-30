import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'

const CreatePage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    author: '' // auto-filled from user
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [charCount, setCharCount] = useState(0)

  // Auto-fill author from logged-in user
  useEffect(() => {
    const userData = localStorage.getItem('user')
    const user = userData ? JSON.parse(userData) : null
    if (user?.name) {
      setFormData(prev => ({ ...prev, author: user.name }))
    }
  }, [])

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) {
      navigate('/login');
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    if (name === 'content') setCharCount(value.length)
  }

  const validateForm = () => {
    if (!formData.title.trim()) {
      setError('Title is required')
      return false
    }
    if (formData.title.length > 100) {
      setError('Title must be less than 100 characters')
      return false
    }
    if (!formData.content.trim()) {
      setError('Content is required')
      return false
    }
    if (formData.content.length < 50) {
      setError('Content must be at least 50 characters long')
      return false
    }
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setSuccess('')

    if (!validateForm()) {
      setIsLoading(false)
      return
    }

    try {
      const userData = localStorage.getItem('user')
      const user = userData ? JSON.parse(userData) : null

      const storyData = {
        ...formData,
        owner: user?.id || null
      }

      const response = await fetch('http://localhost:3000/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(storyData)
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess('Story created successfully! Redirecting...')
        setFormData({ title: '', content: '', author: formData.author })
        setCharCount(0)
        setTimeout(() => { window.location.href = '/allstories' }, 2000)
      } else {
        setError(data.message || 'Failed to create story')
      }
    } catch (err) {
      setError('Network error. Please check your connection.')
      console.error('Create story error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveDraft = () => {
    localStorage.setItem('storyDraft', JSON.stringify(formData))
    setSuccess('Draft saved locally!')
    setTimeout(() => setSuccess(''), 3000)
  }

  const loadDraft = () => {
    const draft = localStorage.getItem('storyDraft')
    if (draft) {
      const parsedDraft = JSON.parse(draft)
      setFormData(parsedDraft)
      setCharCount(parsedDraft.content.length)
      setSuccess('Draft loaded!')
      setTimeout(() => setSuccess(''), 3000)
    }
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center px-4">
        <div className="w-full max-w-2xl mx-auto py-10">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Your Story</h1>
            <p className="text-lg text-gray-600">
              Share your creativity with the world.
            </p>
          </div>

          {/* Form Container */}
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
            {/* Success Message */}
            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-5 py-3 rounded-lg mb-5 flex items-center">
                ✅ {success}
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-5 py-3 rounded-lg mb-5 flex items-center">
                ❌ {error}
              </div>
            )}

            

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title Field */}
              <div>
                <label htmlFor="title" className="block text-sm font-semibold text-gray-900 mb-2">
                  Story Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  maxLength="100"
                  className="w-full px-4 py-3 text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Enter your story title..."
                />
                <div className="mt-1 flex justify-between text-xs text-gray-500">
                  <span>Compelling title recommended</span>
                  <span>{formData.title.length}/100</span>
                </div>
              </div>

              {/* Content Field */}
              <div>
                <label htmlFor="content" className="block text-sm font-semibold text-gray-900 mb-2">
                  Story Content *
                </label>
                <textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  required
                  rows="8"
                  className="w-full px-4 py-3 text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                  placeholder="Start writing your story here..."
                />
                <div className="mt-1 flex justify-between text-xs text-gray-500">
                  <span>Minimum 50 characters required</span>
                  <span className={charCount < 50 ? 'text-red-500' : 'text-green-600'}>
                    {charCount} characters
                  </span>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-6 rounded-xl hover:from-indigo-700 hover:to-purple-700 focus:ring-4 focus:ring-indigo-200 font-semibold text-base transition disabled:opacity-50"
                >
                  {isLoading ? 'Publishing...' : 'Publish Story'}
                </button>

                <button
                  type="button"
                  onClick={() => window.history.back()}
                  className="sm:w-32 bg-gray-600 text-white py-3 px-6 rounded-xl hover:bg-gray-700 focus:ring-4 focus:ring-gray-200 font-semibold text-base transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>

          {/* Additional Info */}
          <div className="mt-6 text-center text-sm text-gray-500">
            <p>Your story will be visible to all users once published.</p>
          </div>
        </div>
      </div>
    </>
  )
}

export default CreatePage
