import React, { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import StoryCard from '../components/StoryCard'

const ProfilePage = () => {
  const [user, setUser] = useState(null)
  const [userStories, setUserStories] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('stories')
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({
    username: '',
    email: '',
    bio: ''
  })

  useEffect(() => {
    // Get user from localStorage
    const userData = localStorage.getItem('user')
    if (userData) {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)
      setEditForm({
        username: parsedUser.username || '',
        email: parsedUser.email || '',
        bio: parsedUser.bio || 'No bio available yet.'
      })
      fetchUserStories(parsedUser.id)
    }
    setLoading(false)
  }, [])

  const fetchUserStories = async (userId) => {
    try {
      const response = await fetch(`http://localhost:3000/user/${userId}/stories`)
      if (response.ok) {
        const stories = await response.json()
        setUserStories(stories)
      } else {
        // Fallback: fetch all stories and filter by owner
        const allStoriesResponse = await fetch('http://localhost:3000/')
        if (allStoriesResponse.ok) {
          const allStories = await allStoriesResponse.json()
          const filteredStories = allStories.filter(story => story.owner === userId)
          setUserStories(filteredStories)
        }
      }
    } catch (error) {
      console.error('Error fetching user stories:', error)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    window.location.href = '/'
  }

  const handleEditSubmit = async (e) => {
    e.preventDefault()
    console.log('Update profile:', editForm)
    setIsEditing(false)
    const updatedUser = { ...user, ...editForm }
    localStorage.setItem('user', JSON.stringify(updatedUser))
    setUser(updatedUser)
  }

  const getInitials = (name) => {
    if (!name) return 'U'
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Please Log In</h2>
          <a href="/login" className="text-indigo-600 hover:text-indigo-800">
            Go to Login
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Compact Profile Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-700 pt-20 pb-4">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-4">
              
              {/* Smaller Avatar */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xl sm:text-2xl font-bold flex-shrink-0">
                {getInitials(user.username)}
              </div>

              {/* User Info - More Compact */}
              <div className="flex-1 text-center sm:text-left min-w-0">
                {isEditing ? (
                  <form onSubmit={handleEditSubmit} className="space-y-3">
                    <input
                      type="text"
                      value={editForm.username}
                      onChange={(e) => setEditForm({...editForm, username: e.target.value})}
                      className="text-lg sm:text-xl font-bold text-gray-900 border-b-2 border-indigo-300 focus:border-indigo-600 outline-none bg-transparent w-full"
                      placeholder="Username"
                    />
                    <input
                      type="email"
                      value={editForm.email}
                      onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                      className="text-sm text-gray-600 border-b-2 border-gray-300 focus:border-indigo-600 outline-none bg-transparent w-full"
                      placeholder="Email"
                    />
                    <textarea
                      value={editForm.bio}
                      onChange={(e) => setEditForm({...editForm, bio: e.target.value})}
                      className="text-sm text-gray-700 border-2 border-gray-300 focus:border-indigo-600 outline-none bg-transparent rounded-md p-2 w-full"
                      placeholder="Bio"
                      rows="2"
                    />
                    <div className="flex flex-col sm:flex-row gap-2">
                      <button
                        type="submit"
                        className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition duration-200 text-sm"
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition duration-200 text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 truncate">{user.username}</h1>
                    <p className="text-sm text-gray-600 mb-2 truncate">{user.email}</p>
                    <p className="text-sm text-gray-700 mb-3 line-clamp-2">{user.bio || 'No bio available yet.'}</p>
                    
                    {/* Compact Stats */}
                    <div className="flex justify-center sm:justify-start space-x-4 sm:space-x-6 text-xs sm:text-sm text-gray-600">
                      <div className="text-center">
                        <div className="font-semibold text-sm sm:text-base text-gray-900">{userStories.length}</div>
                        <div>Stories</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-sm sm:text-base text-gray-900">
                          {userStories.reduce((sum, story) => sum + (Array.isArray(story.likes) ? story.likes.length : 0), 0)}
                        </div>
                        <div>Likes</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-sm sm:text-base text-gray-900">
                          {user.createdAt ? new Date(user.createdAt).getFullYear() : new Date().getFullYear()}
                        </div>
                        <div>Joined</div>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Compact Action Buttons */}
              {!isEditing && (
                <div className="flex flex-row sm:flex-col gap-2 flex-shrink-0">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="bg-indigo-600 text-white px-3 py-2 rounded-md hover:bg-indigo-700 transition duration-200 text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={handleLogout}
                    className="bg-red-600 text-white px-3 py-2 rounded-md hover:bg-red-700 transition duration-200 text-sm"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Compact Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex px-4 sm:px-6">
              <button
                onClick={() => setActiveTab('stories')}
                className={`py-3 px-4 border-b-2 font-medium text-sm transition duration-200 ${
                  activeTab === 'stories'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Stories ({userStories.length})
              </button>
              <button
                onClick={() => setActiveTab('activity')}
                className={`py-3 px-4 border-b-2 font-medium text-sm transition duration-200 ${
                  activeTab === 'activity'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Activity
              </button>
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
          {activeTab === 'stories' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-4 sm:gap-6">
              {userStories.length > 0 ? (
                userStories.map(story => (
                  <StoryCard key={story._id} story={story} showActions={true} />
                ))
              ) : (
                <div className="col-span-full text-center py-8">
                  <p className="text-gray-500 mb-4">No stories yet</p>
                  <a href="/create" className="text-indigo-600 hover:text-indigo-800 font-medium">
                    Create your first story
                  </a>
                </div>
              )}
            </div>
          )}

          {activeTab === 'activity' && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-2">
                {userStories.slice(0, 5).map((story) => (
                  <div key={story._id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full flex-shrink-0"></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-700 truncate">
                        Published "<strong>{story.title}</strong>"
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(story.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
                {userStories.length === 0 && (
                  <p className="text-gray-500 text-center py-8">No activity yet.</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
