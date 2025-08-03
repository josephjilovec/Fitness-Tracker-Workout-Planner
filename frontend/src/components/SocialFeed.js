import React, { useState, useEffect } from 'react';
import axios from 'axios';

function SocialFeed() {
  const [posts, setPosts] = useState([]);
  const [challenges, setChallenges] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [newComment, setNewComment] = useState({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch social data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Please log in to view the social feed');
          return;
        }

        // Fetch posts
        const postsResponse = await axios.get('/api/social/posts', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPosts(postsResponse.data.posts);

        // Fetch challenges
        const challengesResponse = await axios.get('/api/social/challenges', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setChallenges(challengesResponse.data.challenges);
      } catch (err) {
        console.error('Fetch social data error:', err.message);
        setError('Failed to load social data');
      }
    };

    fetchData();
  }, []);

  // Handle post creation
  const handleCreatePost = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please log in to create a post');
        return;
      }

      if (!newPost.trim()) {
        setError('Post content is required');
        return;
      }

      const response = await axios.post(
        '/api/social/posts',
        { content: newPost },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setPosts([response.data.post, ...posts]);
      setNewPost('');
      setSuccess('Post created successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Create post error:', err.message);
      setError('Failed to create post');
    }
  };

  // Handle comment creation
  const handleAddComment = async (postId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please log in to comment');
        return;
      }

      if (!newComment[postId]?.trim()) {
        setError('Comment content is required');
        return;
      }

      const response = await axios.post(
        '/api/social/comments',
        { postId, content: newComment[postId] },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update posts with new comment
      setPosts(posts.map((post) =>
        post._id === postId
          ? { ...post, comments: [...(post.comments || []), response.data.comment] }
          : post
      ));
      setNewComment({ ...newComment, [postId]: '' });
      setSuccess('Comment added successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Add comment error:', err.message);
      setError('Failed to add comment');
    }
  };

  // Handle like toggle
  const handleToggleLike = async (postId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please log in to like posts');
        return;
      }

      const response = await axios.post(
        '/api/social/likes',
        { postId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setPosts(posts.map((post) =>
        post._id === postId ? { ...post, likes: response.data.likes } : post
      ));
      setSuccess(response.data.message);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Toggle like error:', err.message);
      setError('Failed to toggle like');
    }
  };

  // Handle join challenge
  const handleJoinChallenge = async (challengeId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please log in to join challenges');
        return;
      }

      const response = await axios.post(
        '/api/social/challenges',
        { challengeId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setChallenges(challenges.map((challenge) =>
        challenge._id === challengeId ? response.data.challenge : challenge
      ));
      setSuccess('Joined challenge successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Join challenge error:', err.message);
      setError('Failed to join challenge');
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold text-blue-600 mb-6">Social Feed</h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Posts Section */}
        <div className="lg:col-span-2">
          <div className="bg-white shadow-md rounded-lg p-6 mb-6">
            <h3 className="text-xl font-semibold mb-4">Create Post</h3>
            <form onSubmit={handleCreatePost}>
              <textarea
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="Share your fitness journey..."
                rows="4"
              />
              <button
                type="submit"
                className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              >
                Post
              </button>
            </form>
          </div>

          <div className="bg-white shadow-md rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Posts</h3>
            {posts.length === 0 ? (
              <p className="text-gray-500">No posts available</p>
            ) : (
              posts.map((post) => (
                <div key={post._id} className="border-b py-4">
                  <p className="text-gray-700"><strong>{post.userId.username}:</strong> {post.content}</p>
                  <p className="text-gray-500 text-sm">
                    Posted: {new Date(post.createdAt).toLocaleDateString()}
                  </p>
                  <div className="flex space-x-4 mt-2">
                    <button
                      onClick={() => handleToggleLike(post._id)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      {post.likes.includes(localStorage.getItem('userId')) ? 'Unlike' : 'Like'} ({post.likes.length})
                    </button>
                  </div>
                  <div className="mt-2">
                    <input
                      type="text"
                      value={newComment[post._id] || ''}
                      onChange={(e) => setNewComment({ ...newComment, [post._id]: e.target.value })}
                      className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                      placeholder="Add a comment..."
                    />
                    <button
                      onClick={() => handleAddComment(post._id)}
                      className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                    >
                      Comment
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Challenges and Leaderboard Section */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Challenges</h3>
          {challenges.length === 0 ? (
            <p className="text-gray-500">No challenges available</p>
          ) : (
            challenges.map((challenge) => (
              <div key={challenge._id} className="border-b py-4">
                <h4 className="text-lg font-medium">{challenge.title}</h4>
                <p className="text-gray-600">{challenge.description || 'No description'}</p>
                <p className="text-gray-500 text-sm">
                  Participants: {challenge.participants.length}
                </p>
                <button
                  onClick={() => handleJoinChallenge(challenge._id)}
                  className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                >
                  Join Challenge
                </button>
              </div>
            ))
          )}

          <h3 className="text-xl font-semibold mt-6 mb-4">Leaderboard</h3>
          <p className="text-gray-500">Coming soon: Top users by workout frequency and challenge participation!</p>
        </div>
      </div>
    </div>
  );
}

export default SocialFeed;
