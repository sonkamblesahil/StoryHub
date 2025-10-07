import React, { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import { motion } from 'framer-motion'
import StoryCard from '../components/StoryCard'
import Tilt from 'react-parallax-tilt'

const HomePage = () => {
  const [stories, setStories] = useState([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) setUser(JSON.parse(userData))
    fetchStories()
  }, [])

  const fetchStories = async () => {
    try {
      const response = await fetch('/api/')
      if (response.ok) {
        const data = await response.json()
        setStories(data)
      }
    } catch (error) {
      console.error('Error fetching stories:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 via-white to-gray-100">
      <Navbar />

      {/* Hero Section with Animated 3D Elements */}
      <section className="relative min-h-[85vh] flex items-center justify-center bg-gradient-to-r from-indigo-600 to-purple-700 text-white overflow-hidden">
        {/* Floating 3D shapes */}
        <motion.div
          initial={{ y: -50, x: -50 }}
          animate={{ y: [0, 30, 0], x: [0, 20, 0] }}
          transition={{ repeat: Infinity, duration: 8 }}
          className="absolute top-20 left-10 w-40 h-40 rounded-full bg-gradient-to-br from-indigo-400 to-pink-500 blur-2xl opacity-40"
        />
        <motion.div
          initial={{ y: 50 }}
          animate={{ y: [-30, 30, -30] }}
          transition={{ repeat: Infinity, duration: 10 }}
          className="absolute bottom-20 right-10 w-28 h-28 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-400 blur-xl opacity-40"
        />
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 6 }}
          className="absolute top-1/2 left-1/2 w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 blur-lg opacity-30"
        />

        {/* Hero Content */}
        <div className="relative max-w-6xl px-6 lg:px-8 text-center z-10">
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-extrabold mb-6 drop-shadow-xl"
          >
            Share Your Stories
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-lg md:text-2xl mb-10 opacity-90 max-w-2xl mx-auto leading-relaxed"
          >
            Discover, create, and share inspiring stories from writers across the world 🌍
          </motion.p>
          <motion.div
            className="flex justify-center gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <a
              href="/create"
              className="bg-white text-indigo-600 shadow-lg hover:scale-110 transform transition px-8 py-3 rounded-2xl text-lg font-semibold"
            >
              ✍️ Start Writing
            </a>
            <a
              href="/allstories"
              className="border-2 border-white hover:bg-white hover:text-indigo-600 shadow-lg px-8 py-3 rounded-2xl text-lg font-semibold transition transform hover:scale-110"
            >
              📖 Browse Stories
            </a>
          </motion.div>
        </div>
      </section>

      {/* Recent Stories with 3D Tilt Cards */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="mb-12 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-3">✨ Recent Stories</h2>
          <p className="text-gray-600">Fresh reads from our creative community</p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-indigo-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {stories.length > 0 ? (
              stories.slice(0, 6).map((story) => (
                <Tilt key={story._id} tiltMaxAngleX={10} tiltMaxAngleY={10} className="rounded-2xl">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="rounded-2xl shadow-xl bg-white/80 backdrop-blur-md p-4 border border-gray-100 hover:shadow-2xl transform transition"
                  >
                    <StoryCard story={story} />
                  </motion.div>
                </Tilt>
              ))
            ) : (
              <div className="col-span-full text-center py-16">
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">🚀 No stories yet</h3>
                <p className="text-gray-600 mb-6">Be the first to share something amazing!</p>
                <a
                  href="/create"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-medium shadow-lg transition transform hover:scale-110"
                >
                  Write First Story
                </a>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer with 3D Hover Icons */}
      <footer className="bg-gray-900 text-gray-300 mt-12 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Logo */}
            <div className="md:col-span-2">
              <h3 className="text-2xl font-bold text-white mb-4">StoryHub</h3>
              <p className="mb-4 max-w-md leading-relaxed">
                A platform where writers connect with readers and inspire each other through storytelling. 
                Join our growing community of dreamers ✨
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 grid grid-cols-2">
                <li><a href="/allstories" className="hover:text-white">All Stories</a></li>
                <li><a href="/create" className="hover:text-white">Write Story</a></li>
                <li><a href="/mystories" className="hover:text-white">My Stories</a></li>
                <li><a href="/profile" className="hover:text-white">Profile</a></li>
              </ul>
            </div>

          
          </div>

          {/* Bottom */}
          <div className="border-t border-gray-700 mt-10 pt-6 text-center">
            <p className="text-gray-400">
              &copy; Sahil Sonkamble 2025 <span className="text-indigo-400 font-semibold">StoryHub</span>. Made with ❤️ for storytellers.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default HomePage
