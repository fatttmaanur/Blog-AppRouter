import { useMutation, useQueryClient } from '@tanstack/react-query';

const deleteBlog = async (id) => {
  const res = await fetch(`https://fakestoreapi.com/products/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    throw new Error('Failed to delete blog');
  }
  return res.json();
};

export default function DeleteButton({ id }) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: () => deleteBlog(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['blogs']);
    },
  });

  return (
    <button
      onClick={() => mutation.mutate()}
      className="p-2 ml-4 bg-red-600 text-white rounded hover:bg-red-500"
    >
      Delete
    </button>
  );
}