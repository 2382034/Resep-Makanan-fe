import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import RecipesForm, { RecipesFormInput } from "../components/RecipesForm"; // Adjusted import
import axios from "../utils/AxiosInstance";
import { fetchRecipeDetail } from "./RecipesDetail"; // Import fetch function
import { useAuth } from "../utils/AuthProvider";

// Async function to edit/update a recipe
const editRecipe = async (data: RecipesFormInput, id: string | undefined, token: string | null) => {
  if (!id) throw new Error("Recipe ID is missing");
  if (!token) throw new Error("Authentication token is missing");
  // Adjust API endpoint for PUT/PATCH request
  return await axios.put(`/api/recipes/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

// Async function to delete a recipe (can be reused or imported)
const deleteRecipe = async (id: string | undefined, token: string | null) => {
    if (!id) throw new Error("Recipe ID is missing");
    if (!token) throw new Error("Authentication token is missing");
    return await axios.delete(`/api/recipes/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
};


const EditRecipes = () => {
  const { id } = useParams<{ id: string }>(); // Get ID from URL
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Query to get the current recipe details for the form
  const { data: recipeDetailResponse, isLoading: isRecipeLoading, isError: isQueryError, error: queryError } = useQuery({
    queryKey: ["recipeDetail", id], // Use the same key as detail page to potentially reuse cache
    queryFn: () => fetchRecipeDetail(id, getToken()),
    enabled: !!id && !!getToken(),
    refetchOnWindowFocus: false, // Typically don't need aggressive refetching on edit forms
  });

  // Mutation for saving the edited recipe
  const editRecipeMutation = useMutation({
    mutationFn: (data: RecipesFormInput) => editRecipe(data, id, getToken()),
    onSuccess: (updatedData) => {
      // Invalidate queries to refetch updated data
      queryClient.invalidateQueries({ queryKey: ["recipeList"] }); // Update the list view
      queryClient.invalidateQueries({ queryKey: ["recipeDetail", id] }); // Update the detail view cache
      // Navigate back to the detail page or list page after successful edit
      navigate(`/recipes/${id}`, { replace: true }); // Go to detail page
      // navigate("/recipes", { replace: true }); // Or go back to list page
    },
    onError: (err) => {
        console.error("Error updating recipe:", err);
        // Display error to user
    }
  });

  // Mutation for deleting the recipe
  const deleteRecipeMutation = useMutation({
    mutationFn: () => deleteRecipe(id, getToken()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recipeList"] }); // Update list
      // Remove the specific detail query cache if desired
      queryClient.removeQueries({ queryKey: ["recipeDetail", id] });
      navigate("/recipes", { replace: true }); // Go back to list page
    },
    onError: (err) => {
        console.error("Error deleting recipe:", err);
        setIsDeleteModalOpen(false); // Close modal on error
        // Display error to user
    }
  });

  // --- Delete Confirmation Modal --- (Similar to RecipesDetail)
   const DeleteConfirmationModal = () => {
    if (!isDeleteModalOpen) return null;
    const recipeName = recipeDetailResponse?.data?.data?.name || 'this recipe'; // Get name for modal text
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Confirm Deletion</h3>
          <p className="text-gray-600 mb-6">
            Are you sure you want to delete "{recipeName}"? This action cannot be undone.
          </p>
          {(editRecipeMutation.isError || deleteRecipeMutation.isError) && (
             <p className="text-red-500 text-sm mb-4">Error: {(deleteRecipeMutation.error as Error)?.message || (editRecipeMutation.error as Error)?.message || 'Could not perform action.'}</p>
          )}
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-gray-800 transition duration-150"
              disabled={deleteRecipeMutation.isPending}
            >
              Cancel
            </button>
            <button
              onClick={() => {
                deleteRecipeMutation.mutate();
                // No need to close modal here, onSuccess/onError handles it or keeps it open on error
              }}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition duration-150"
              disabled={deleteRecipeMutation.isPending}
            >
              {deleteRecipeMutation.isPending ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Handler for triggering delete
  const handleDelete = () => {
    setIsDeleteModalOpen(true);
  };

  // Combined loading state
  const isLoading = isRecipeLoading || editRecipeMutation.isPending || deleteRecipeMutation.isPending;

  // --- Render Logic ---

  return (
    <div className="relative max-w-4xl mx-auto p-4 md:p-8">
      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-white/70 backdrop-blur-sm z-20 flex items-center justify-center rounded-lg">
           <div className="flex items-center bg-white/95 px-8 py-4 rounded-lg shadow-xl border border-gray-200">
            <span className="text-xl mr-4 text-gray-800 font-medium">
              {editRecipeMutation.isPending ? "Saving..." :
               deleteRecipeMutation.isPending ? "Deleting..." : "Loading Recipe..."}
            </span>
             <svg className="animate-spin h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal />

      <div className="bg-white shadow-lg rounded-lg p-6 md:p-10 border border-gray-100">
        <h2 className="text-3xl font-bold mb-8 text-gray-800 text-center">Edit Recipe</h2>

        {isQueryError ? (
          <div className="text-red-600 text-center">
            Failed to load recipe data. {(queryError as Error)?.message || 'Unknown error'}
          </div>
        ) : !recipeDetailResponse?.data?.data && !isRecipeLoading ? (
            <div className="text-gray-600 text-center">Recipe data not found.</div>
        ) : (
          <>
            {/* Render the form only when data is available */}
            {recipeDetailResponse?.data?.data && (
                 <RecipesForm
                    isEdit={true}
                    mutateFn={editRecipeMutation.mutate}
                    defaultInputData={recipeDetailResponse.data.data}
                    showDeleteButton={true} // Show delete button in the form itself
                    onDelete={handleDelete} // Pass delete handler
                />
            )}

            {/* Display mutation errors */}
            {editRecipeMutation.isError && (
              <div className="text-red-500 mt-4 text-center">
                Error saving recipe: {(editRecipeMutation.error as Error)?.message || "Unknown error"}
              </div>
            )}
            {/* Delete error is shown in modal */}
          </>
        )}
      </div>
    </div>
  );
};

export default EditRecipes;