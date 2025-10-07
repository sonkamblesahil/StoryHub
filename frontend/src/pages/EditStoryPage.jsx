import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const EditStoryPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [story, setStory] = useState(null);
  const [formData, setFormData] = useState({ title: '', content: '', author: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    async function fetchStory() {
      try {
        const response = await fetch(`/api/story/${id}`);
        if (!response.ok) throw new Error('Story not found');
        const data = await response.json();
        setStory(data);
        setFormData({ title: data.title, content: data.content, author: data.author });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchStory();
  }, [id]);

  useEffect(() => {
    if (!user || (story && story.owner !== user.id)) {
      navigate('/');
    }
  }, [user, story, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await fetch(`/api/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ ...formData, userId: user.id })
      });
      if (response.ok) {
        navigate(`/story/${id}`);
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to update story');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <>
      <Navbar />
      <div className="max-w-xl mx-auto mt-12 bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold mb-6">Edit Story</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg px-4 py-2"
            placeholder="Title"
            required
          />
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg px-4 py-2 min-h-[120px]"
            placeholder="Content"
            required
          />
          <input
            type="text"
            name="author"
            value={formData.author}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg px-4 py-2"
            placeholder="Author"
            required
          />
          <button
            type="submit"
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-indigo-700"
          >
            Update Story
          </button>
        </form>
      </div>
    </>
  );
};

export default EditStoryPage;
