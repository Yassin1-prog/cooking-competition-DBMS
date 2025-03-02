import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import recipeService from "../api/recipeService";

function Recipes() {
  const [recipes, setRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    setIsLoading(true);
    try {
      const response = await recipeService.getAllRecipes();
      if (response.success) {
        setRecipes(response.data);
      } else {
        setError("Failed to fetch recipes");
      }
    } catch (err) {
      setError("Failed to fetch recipes");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this recipe?")) {
      try {
        const response = await recipeService.deleteRecipe(id);
        if (response.success) {
          await fetchRecipes();
        } else {
          setError("Failed to delete recipe");
        }
      } catch (err) {
        setError("Failed to delete recipe");
        console.error(err);
      }
    }
  };

  const handleEdit = (e, id) => {
    e.stopPropagation();
    navigate(`/recipes/edit/${id}`);
  };

  const renderDifficulty = (difficulty) => {
    return "⭐".repeat(difficulty);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-amber-800">Recipes</h2>
        <button
          onClick={() => navigate("/recipes/new")}
          className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-md flex items-center"
        >
          <span className="mr-2">Add Recipe</span>
          <span>➕</span>
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-700 mx-auto"></div>
          <p className="mt-3 text-amber-800">Loading recipes...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.length > 0 ? (
            recipes.map((recipe) => (
              <div
                key={recipe.recipe_id}
                onClick={() => navigate(`/recipes/${recipe.recipe_id}`)}
                className="bg-white rounded-lg shadow-md overflow-hidden border border-amber-200 hover:shadow-lg transition-all cursor-pointer"
              >
                <div className="p-5">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-xl font-semibold text-amber-800 mb-2">
                        {recipe.recipe_name}
                      </h3>
                      <p className="text-amber-600 text-sm">
                        {recipe.cuisine_name} • {recipe.category}
                      </p>
                    </div>
                    <div className="text-amber-500">
                      {renderDifficulty(recipe.difficulity)}
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2 mt-4">
                    <button
                      onClick={(e) => handleEdit(e, recipe.recipe_id)}
                      className="text-amber-600 hover:text-amber-800"
                      title="Edit"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={(e) => handleDelete(e, recipe.recipe_id)}
                      className="text-red-600 hover:text-red-800"
                      title="Delete"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-10 text-amber-700">
              No recipes found. Add your first recipe!
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Recipes;
