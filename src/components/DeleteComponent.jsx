import React, { useState } from "react";
import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const fetchPosts = async () => {
  const { data } = await axios.get("https://jsonplaceholder.typicode.com/posts");
  return data;
};

const deletePost = async (postId) => {
  await axios.delete(`https://jsonplaceholder.typicode.com/posts/${postId}`);
};

const DeleteComponent = () => {
  const [postId, setPostId] = useState("");
  const queryClient = useQueryClient();
  const { data: posts, isLoading, isError } = useQuery(["posts"], fetchPosts);
  const mutation = useMutation(deletePost, {
    onSuccess: () => {
      queryClient.invalidateQueries(["posts"]);
      alert(`Successfully deleted post with id ${postId}`);
    },
    onError: () => {
      alert(`Failed to delete post with id ${postId}`);
    }
  });

  const handleDelete = (event) => {
    event.preventDefault();
    if (postId) {
      mutation.mutate(postId);
    }
  };

  if (isLoading) return <div>Loading posts...</div>;
  if (isError) return <div>Error fetching posts</div>;

  return (
    <div>
      <h1>Delete Post</h1>
      <form onSubmit={handleDelete}>
        <input
          type="text"
          placeholder="Enter post ID to delete"
          value={postId}
          onChange={(event) => setPostId(event.target.value)}
        />
        <button type="submit" disabled={mutation.isLoading}>
          {mutation.isLoading ? "Deleting..." : "Delete Post"}
        </button>
      </form>
      {mutation.isError && <p style={{ color: "red" }}>Error deleting post.</p>}
    </div>
  );
};

export default DeleteComponent;