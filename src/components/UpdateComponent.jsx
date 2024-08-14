import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';


const getAllPosts = async () => {
  const response = await fetch('https://jsonplaceholder.typicode.com/posts');
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};


const updatePost = async (updatedPost) => {
  const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${updatedPost.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updatedPost),
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

const UpdateDisplay = () => {
  const queryClient = useQueryClient();
  const [selectedPost, setSelectedPost] = useState(null);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');


  const { data: posts, error, isLoading } = useQuery({
    queryKey: ['posts'],
    queryFn: getAllPosts,
  });


  const mutation = useMutation({
    mutationFn: updatePost,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries(['posts']);
    },
  });


  const limitedPosts = posts ? posts.slice(0, 5) : [];

  const handleSelectPost = (post) => {
    setSelectedPost(post);
    setTitle(post.title);
    setBody(post.body);
  };

  const handleUpdatePost = (e) => {
    e.preventDefault();
    if (selectedPost) {
      mutation.mutate({ ...selectedPost, title, body });
    }
  };

  if (isLoading) return <p>Loading posts...</p>;
  if (error) return <p style={{ color: 'red' }}>Error fetching posts: {error.message}</p>;

  return (
    <div>
      <h2>List and Update Posts</h2>


      <ul>
        {limitedPosts.map(post => (
          <li key={post.id}>
            <h3>{post.title}</h3>
            <p>{post.body}</p>
            <button onClick={() => handleSelectPost(post)}>Edit</button>
          </li>
        ))}
      </ul>


      {selectedPost && (
        <form onSubmit={handleUpdatePost}>
          <h2>Edit Post</h2>
          <div>
            <label htmlFor="title">Title:</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="body">Body:</label>
            <textarea
              id="body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
            />
          </div>
          <button type="submit">Update Post</button>
        </form>
      )}

      {mutation.isLoading && <p>Updating...</p>}
      {mutation.isError && <p style={{ color: 'red' }}>Error updating post: {mutation.error.message}</p>}
      {mutation.isSuccess && <p>Post updated successfully!</p>}
    </div>
  );
};

export default UpdateDisplay;