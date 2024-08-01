'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'next/navigation'; 
import Head from 'next/head';

const fetchBlog = async (id) => {
  if (!id) throw new Error('No ID provided');
  const res = await fetch(`https://fakestoreapi.com/products/${id}`);
  if (!res.ok) throw new Error('Failed to fetch blog');
  return res.json();
};

const updateBlog = async (data) => {
  const res = await fetch(`https://fakestoreapi.com/products/${data.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update blog');
  return res.json();
};

export default function Detail() {
  const { id } = useParams();  
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState('');

  const { data, error, isLoading } = useQuery({
    queryKey: ['blog', id],
    queryFn: () => fetchBlog(id),
    enabled: !!id,
  });

  const mutation = useMutation({
    mutationFn: updateBlog,
    onSuccess: () => {
      queryClient.invalidateQueries(['blog', id]);
    },
  });

  const handleUpdate = () => {
    const updatedData = { ...data, title };
    mutation.mutate(updatedData);
    console.log('Updating with data:', updatedData);
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <>
      <Head>
        <title>Update Blog Detail</title>
        <meta name="description" content="Blog details page" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main className="min-h-screen flex items-center justify-center p-4 bg-gray-100">
        <div className="w-full max-w-md bg-gray-50 p-6 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold mb-4">Update Blog Detail</h1>
          {isEditing ? (
            <div className="mt-4">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="p-2 border rounded w-full mb-4"
                placeholder="Enter new title"
              />
              <div className="flex space-x-4">
                <button
                  onClick={handleUpdate}
                  className="p-2 bg-blue-600 hover:bg-blue-500 text-white rounded w-full"
                >
                  Update
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="p-2 bg-gray-500 text-white rounded w-full"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-4">
              <h2
                className="text-xl cursor-pointer hover:to-blue-50"
                onClick={() => {
                  setTitle(data?.title);
                  setIsEditing(true);
                }}
              >
                {data?.title}
              </h2>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
