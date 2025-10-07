import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Navbar from '../components/Navbar'

const ViewPage = () => {
  const { id } = useParams()
  const [story, setStory] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [user, setUser] = useState(null)

  useEffect(() => {
    // Get user from localStorage
    const userData = localStorage.getItem('user')
    if (userData) {
      setUser(JSON.parse(userData))
    }

    async function fetchStory() {
      try {
        const response = await fetch(`/api/story/${id}`)
        if (!response.ok) throw new Error('Story not found')
        const data = await response.json()
        setStory(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchStory()
  }, [id])

  // Likes state for toggle
  const [likesCount, setLikesCount] = useState(Array.isArray(story?.likes) ? story.likes.length : 0);
  const [liked, setLiked] = useState(user && Array.isArray(story?.likes) && story.likes.includes(user.id));
  useEffect(() => {
    setLikesCount(Array.isArray(story?.likes) ? story.likes.length : 0);
    setLiked(user && Array.isArray(story?.likes) && story.likes.includes(user.id));
  }, [story, user]);

  const handleLike = async () => {
    if (!user) {
      alert('Please log in to like stories');
      return;
    }
    try {
      const response = await fetch(`/api/story/${id}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: user.id })
      });
      if (!response.ok) throw new Error('Failed to like/unlike story');
      const data = await response.json();
      setLikesCount(typeof data.likes === 'number' && !isNaN(data.likes) ? data.likes : 0);
      setLiked(!!data.liked);
      setStory(prev => ({ ...prev, likes: Array(data.likes).fill('dummy') })); // For compatibility
    } catch (err) {
      console.error('Error liking/unliking story:', err);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getReadingTime = (content) => {
    const wordsPerMinute = 200
    const words = content.split(' ').length
    const readingTime = Math.ceil(words / wordsPerMinute)
    return readingTime === 1 ? '1 min read' : `${readingTime} min read`
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back Button */}
          <div className="mb-6">
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Stories
            </button>
          </div>

          {loading ? (
            /* Loading State */
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                  <p className="text-gray-600 text-lg">Loading story...</p>
                </div>
              </div>
            </div>
          ) : error ? (
            /* Error State */
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="text-center py-12">
                <svg className="mx-auto h-24 w-24 text-red-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">Story Not Found</h3>
                <p className="text-red-600 text-lg mb-6">{error}</p>
                <div className="space-x-4">
                  <button
                    onClick={() => window.history.back()}
                    className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition duration-200"
                  >
                    Go Back
                  </button>
                  <a
                    href="/stories"
                    className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition duration-200 inline-block"
                  >
                    Browse Stories
                  </a>
                </div>
              </div>
            </div>
          ) : story ? (
            /* Story Content */
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              {/* Story Header */}
              <div className="bg-gradient-to-r from-indigo-600 to-purple-800 px-8 py-2 ">
                <div className="text-center text-white">
                  <h1 className="text-2xl md:text-3xl font-bold  leading-tight">
                    {story.title}
                  </h1>
                  
                  {/* Author and Meta Info */}
                  <div className="flex flex-col sm:flex-row items-center justify-between  sm:space-y-0 sm:space-x-6 text-blue-100">
                    <div className="flex items-center">
                      
                      <div className="text-left">
                        <p className="font-semibold text-lg">By {story.author}</p>
                        {story.createdAt && (
                          <p className="text-sm opacity-90">
                            Published on {formatDate(story.createdAt)}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm">
                      <span>📖 {getReadingTime(story.content)}</span>
                      <span>❤️ {typeof likesCount === 'number' && !isNaN(likesCount) ? likesCount : 0} likes</span>
                      {story.bookmarks && <span>🔖 Bookmarked</span>}
                    </div>
                  </div>
                </div>
              </div>

              {/* Story Content */}
              <div className="min-h-[300px]">
                <div className="prose prose-lg prose-gray max-w-none">
                  <div className="text-gray-800 leading-relaxed text-lg break-words whitespace-pre-line p-3">
                    {story.content.split('\n').map((paragraph, index) => (
                      paragraph.trim() && (
                        <p key={index} className="mb-6 break-words whitespace-pre-line">
                          {paragraph}
                        </p>
                      )
                    ))}
                  </div>
                </div>
              </div>

              {/* Story Actions */}
              <div className="border-t border-gray-200 px-8 py-6">
                <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
                  {/* Like Button */}
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={handleLike}
                      className={`inline-flex items-center px-6 py-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition duration-200`}
                    >
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                      </svg>
                      {liked ? 'Unlike' : 'Like'} ({typeof likesCount === 'number' && !isNaN(likesCount) ? likesCount : 0})
                    </button>
                    
                    
                  </div>

                  {/* Story Stats */}
                  <div className="text-sm text-gray-500 flex items-center space-x-6">
                    <span>📊 {story.content.split(' ').length} words</span>
                    <span>🕒 {story.createdAt && formatDate(story.createdAt)}</span>
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          </div>
        </div>
      
    </>
  )
}

export default ViewPage
