/**
 * @fileoverview Social Feed Component
 * @description Social features: posts, comments, likes, challenges
 * @module components/SocialFeed
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { apiService } from '../services/api';
import useApi from '../hooks/useApi';
import LoadingSpinner from './LoadingSpinner';

/**
 * SocialFeed component
 * Optimized with useCallback
 */
const SocialFeed = () => {
  const { user } = useAuth();
  const [newPost, setNewPost] = useState('');
  const [newComment, setNewComment] = useState({});

  // Fetch posts
  const {
    data: postsData,
    loading: postsLoading,
    execute: fetchPosts,
  } = useApi(apiService.getPosts, { showErrorToast: true });

  // Fetch challenges
  const {
    data: challengesData,
    loading: challengesLoading,
    execute: fetchChallenges,
  } = useApi(apiService.getChallenges, { showErrorToast: true });

  // Create post
  const { loading: createPostLoading, execute: createPost } = useApi(
    apiService.createPost,
    { showSuccessToast: true, showErrorToast: true },
  );

  // Like post
  const { execute: likePost } = useApi(apiService.likePost, {
    showSuccessToast: false,
    showErrorToast: true,
  });

  // Create comment
  const { execute: createComment } = useApi(apiService.createComment, {
    showSuccessToast: true,
    showErrorToast: true,
  });

  // Join challenge
  const { execute: joinChallenge } = useApi(apiService.joinChallenge, {
    showSuccessToast: true,
    showErrorToast: true,
  });

  useEffect(() => {
    fetchPosts({ limit: 20 });
    fetchChallenges({ limit: 10 });
  }, [fetchPosts, fetchChallenges]);

  // Handle post creation
  const handleCreatePost = useCallback(
    async (e) => {
      e.preventDefault();
      if (!newPost.trim()) return;

      const result = await createPost({ content: newPost });
      if (result.success) {
        setNewPost('');
        fetchPosts({ limit: 20 });
      }
    },
    [newPost, createPost, fetchPosts],
  );

  // Handle like toggle
  const handleToggleLike = useCallback(
    async (postId) => {
      const result = await likePost(postId);
      if (result.success) {
        fetchPosts({ limit: 20 });
      }
    },
    [likePost, fetchPosts],
  );

  // Handle comment creation
  const handleAddComment = useCallback(
    async (postId) => {
      const commentText = newComment[postId];
      if (!commentText?.trim()) return;

      const result = await createComment({ postId, content: commentText });
      if (result.success) {
        setNewComment((prev) => ({ ...prev, [postId]: '' }));
        fetchPosts({ limit: 20 });
      }
    },
    [newComment, createComment, fetchPosts],
  );

  // Handle join challenge
  const handleJoinChallenge = useCallback(
    async (challengeId) => {
      const result = await joinChallenge(challengeId);
      if (result.success) {
        fetchChallenges({ limit: 10 });
      }
    },
    [joinChallenge, fetchChallenges],
  );

  const posts = postsData?.posts || [];
  const challenges = challengesData?.challenges || [];

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold text-blue-600 mb-6">Social Feed</h2>

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
                disabled={createPostLoading || !newPost.trim()}
                className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
              >
                {createPostLoading ? 'Posting...' : 'Post'}
              </button>
            </form>
          </div>

          <div className="bg-white shadow-md rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Posts</h3>
            {postsLoading ? (
              <div className="flex items-center justify-center py-12">
                <LoadingSpinner size="lg" />
              </div>
            ) : posts.length === 0 ? (
              <p className="text-gray-500">No posts available</p>
            ) : (
              posts.map((post) => (
                <div key={post._id || post.id} className="border-b py-4 last:border-b-0">
                  <div className="flex items-start mb-2">
                    <div className="flex-1">
                      <p className="font-semibold">
                        {post.userId?.username || 'Unknown User'}
                      </p>
                      <p className="text-gray-700">{post.content}</p>
                      <p className="text-gray-500 text-sm mt-1">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-4 mt-2">
                    <button
                      onClick={() => handleToggleLike(post._id || post.id)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Like ({post.likes?.length || 0})
                    </button>
                  </div>
                  <div className="mt-2">
                    <input
                      type="text"
                      value={newComment[post._id || post.id] || ''}
                      onChange={(e) =>
                        setNewComment({ ...newComment, [post._id || post.id]: e.target.value })
                      }
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddComment(post._id || post.id);
                        }
                      }}
                      className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                      placeholder="Add a comment..."
                    />
                    <button
                      onClick={() => handleAddComment(post._id || post.id)}
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

        {/* Challenges Section */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Challenges</h3>
          {challengesLoading ? (
            <div className="flex items-center justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : challenges.length === 0 ? (
            <p className="text-gray-500">No challenges available</p>
          ) : (
            challenges.map((challenge) => (
              <div key={challenge._id || challenge.id} className="border-b py-4 last:border-b-0">
                <h4 className="text-lg font-medium">{challenge.title}</h4>
                <p className="text-gray-600 text-sm">{challenge.description || 'No description'}</p>
                <p className="text-gray-500 text-sm mt-1">
                  Participants: {challenge.participants?.length || 0}
                </p>
                <button
                  onClick={() => handleJoinChallenge(challenge._id || challenge.id)}
                  className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition text-sm"
                >
                  Join Challenge
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default SocialFeed;
