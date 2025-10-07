import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

export const EditIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-yellow-500 hover:text-yellow-600 cursor-pointer">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487a2.25 2.25 0 113.182 3.182L7.5 20.213l-4.5 1.5 1.5-4.5 12.362-12.726z" />
  </svg>
);

export const DeleteIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-red-500 hover:text-red-600 cursor-pointer">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const StoryCard = ({ story, showActions }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  const isOwner = user && story.owner === user.id;
  const navigate = useNavigate();

  // Likes state
  const [likesCount, setLikesCount] = React.useState(Array.isArray(story.likes) ? story.likes.length : 0);
  const [liked, setLiked] = React.useState(user && Array.isArray(story.likes) && story.likes.includes(user.id));
  const [likeLoading, setLikeLoading] = React.useState(false);

  // Update likes state if story.likes changes (for AllStoriesPage)
  React.useEffect(() => {
    setLikesCount(Array.isArray(story.likes) ? story.likes.length : 0);
    setLiked(user && Array.isArray(story.likes) && story.likes.includes(user.id));
  }, [story.likes, user]);

  const handleEdit = () => {
    navigate(`/edit/${story._id}`);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this story?')) {
      try {
      const response = await fetch(`/api/${story._id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({ userId: user.id })
        });
        if (response.ok) {
          window.location.reload();
        }
      } catch (err) {
        alert('Failed to delete story.');
      }
    }
  };

  // Like/Unlike handler
  const handleLike = async () => {
    if (!user) return;
    setLikeLoading(true);
    try {
      const response = await fetch(`/api/story/${story._id}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: user.id })
      });
      if (response.ok) {
        const data = await response.json();
        // Defensive: likes should be a number, fallback to 0 if not
        setLikesCount(typeof data.likes === 'number' && !isNaN(data.likes) ? data.likes : 0);
        setLiked(!!data.liked);
      }
    } catch (err) {
      // Optionally show error
    }
    setLikeLoading(false);
  };

  return (
    <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 transition transform hover:-translate-y-2 hover:shadow-2xl flex flex-col gap-4 min-h-[320px] h-full">
      {/* Title */}
      <h2 className="text-2xl font-bold text-gray-900 line-clamp-2">
        {story.title}
      </h2>

      {/* Content Preview */}
      <p className="text-gray-600 text-base line-clamp-3 flex-1">
        {story.content.slice(0, 120)}
        {story.content.length > 120 ? '...' : ''}
      </p>

      {/* Author and Likes */}
      <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
        <span>By <span className="font-semibold text-indigo-600">{story.author}</span></span>
        <button
          className={`flex items-center gap-1 px-2 py-1 rounded-full transition ${liked ? 'bg-pink-100 text-pink-600' : 'bg-gray-100 text-gray-500'} ${likeLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-pink-200 hover:text-pink-700'}`}
          onClick={handleLike}
          disabled={likeLoading}
        >
          {liked ? '💖 Unlike' : '🤍 Like'} ({typeof likesCount === 'number' && !isNaN(likesCount) ? likesCount : 0})
        </button>
      </div>

      {/* Read More Button */}
      <Link
        to={`/story/${story._id}`}
        className="mt-4 bg-gradient-to-r from-indigo-600 to-purple-700 text-white px-4 py-2 rounded-xl text-sm font-semibold text-center transition transform hover:scale-105 hover:from-indigo-700 hover:to-purple-800 shadow-md"
      >
        Read More →
      </Link>

      {/* Edit/Delete Icons for Owner, only if showActions is true */}
      {showActions && isOwner && (
        <div className="flex gap-2 mt-4">
          <span onClick={handleEdit}><EditIcon /></span>
          <span onClick={handleDelete}><DeleteIcon /></span>
        </div>
      )}
    </div>
  )
}

export default StoryCard
