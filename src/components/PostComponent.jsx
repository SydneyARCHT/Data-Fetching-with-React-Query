import React, { useState } from "react";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";

const PostComponent = () => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [post, setPost] = useState(null);

  const createPost = async () => {
    const response = await axios.post(
      "https://jsonplaceholder.typicode.com/posts",
      {
        body: JSON.stringify({
          title: title,
          body: body,
          userId: 1,
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      }
    );

    return JSON.parse(response.data.body);
  };

  const { mutate } = useMutation({
    mutationFn: createPost,
    onSuccess: (data) => {
      console.log(data)
      setPost(data);
      alert(`Successfully added post with id ${data.userId}`);
    },
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    mutate();
  };

  return (
    <>
      <form>
        <input 
          type="text"
          autoComplete="off"
          placeholder="title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
        <input
          type="text"
          autoComplete="off"
          placeholder="body"
          value={body}
          onChange={(event) => setBody(event.target.value)}
        />
        <button type="submit" onClick={handleSubmit}>
          Submit
        </button>
      </form>
      {post && (
        <div>
          <h1>{post.title}</h1>
          <p>{post.body}</p>
        </div>
      )}
    </>
  );
};

export default PostComponent;
