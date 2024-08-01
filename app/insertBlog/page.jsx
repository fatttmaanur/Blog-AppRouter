'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Head from 'next/head';
import '../globals.css'; 

const insertBlog = async (newBlog) => {
  const res = await fetch('https://fakestoreapi.com/products', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newBlog),
  });
  if (!res.ok) {
    throw new Error('Failed to insert blog');
  }
  return res.json();
};

const CreateNewBlog = () => {
  const [title, setTitle] = useState('');
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: insertBlog,
    onSuccess: (data) => {
      console.log('Inserted successfully:', data);
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
    },
    onError: (error) => {
      console.error('Error inserting blog:', error);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate({ title });
  };

  return (
    <>
     <Head>
        <title>Create Blog</title>
        <meta name="description" content="Blog details page" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-100">
        <form onSubmit={handleSubmit} className="w-full max-w-md p-4 border rounded bg-gray-50">
          <div className="mb-4">
            <label className="block text-gray-600">Name</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 rounded"
              required
            />
          </div>
          <button type="submit" className="p-2 bg-blue-600 text-white rounded hover:bg-blue-500">
              AddNewBlog
          </button>
        </form>
      </main>
    </>   
  );
};

export default CreateNewBlog;