import { useCallback } from 'react';
import useShowToast from './useShowToast';

function useDeletePost(post) {
  const showToast = useShowToast();

  // useCallback to memoize the function
  const handleDeletePost = useCallback(async (e) => {
    e.preventDefault(); // Prevent default form submission if applicable

    // Confirm deletion
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      const res = await fetch(`/api/posts/delete/${post._id}`, {
        method: "DELETE",
      });

      // Handle response
      const data = await res.json();
      console.log(data);

      // Check for errors in the response
      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }

      // Show success message
      showToast("Success", data.message, "success");

    } catch (error) {
      // Handle fetch errors
      showToast("Error", error.message, "error");
    }
  }, [post, showToast]); // Add dependencies to avoid stale closures

  return { handleDeletePost };
}

export default useDeletePost;
