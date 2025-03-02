import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import recipeService from "../api/recipeService";

function RecipeDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRecipeDetails();
  }, []); // Removed unnecessary dependency 'id'

  const fetchRecipeDetails = async () => {
    setIsLoading(true);
    try {
      const response = await recipeService.getRecipeById(id);
      if (response.success) {
        setRecipe(response.data);
      } else {
        setError("Failed to fetch recipe details");
      }
    } catch (err) {
      setError("Failed to fetch recipe details");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const renderDifficulty = (difficulty) => {
    return "⭐".repeat(difficulty);
  };

  if (isLoading) {
    return (
      <div className="text-center py-10">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-700 mx-auto"></div>
        <p className="mt-3 text-amber-800">Loading recipe details...</p>
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
        {error || "Recipe not found"}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <button
          onClick={() => navigate("/recipes")}
          className="text-amber-600 hover:text-amber-800 flex items-center gap-2"
        >
          ← Back to Recipes
        </button>
        <button
          onClick={() => navigate(`/recipes/edit/${id}`)}
          className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-md"
        >
          Edit Recipe
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6 border border-amber-200">
        <div className="space-y-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-3xl font-bold text-amber-800 mb-2">
                {recipe.name}
              </h2>
              <p className="text-amber-600">
                {recipe.cuisine_name} • {recipe.category}
              </p>
            </div>
            <div className="text-amber-500 text-xl">
              {renderDifficulty(recipe.difficulity)}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="bg-amber-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-amber-800 mb-3">
                  Description
                </h3>
                <p className="text-amber-700 whitespace-pre-wrap">
                  {recipe.description}
                </p>
              </div>

              <div className="bg-amber-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-amber-800 mb-3">
                  Steps
                </h3>
                <p className="text-amber-700 whitespace-pre-wrap">
                  {recipe.steps}
                </p>
              </div>

              <div className="bg-amber-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-amber-800 mb-3">
                  Nutrition Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-amber-600">Calories</p>
                    <p className="text-xl font-semibold text-amber-800">
                      {recipe.nutrition.calories_per_serving} kcal
                    </p>
                  </div>
                  <div>
                    <p className="text-amber-600">Carbohydrates</p>
                    <p className="text-xl font-semibold text-amber-800">
                      {recipe.nutrition.carbs_per_servning}g
                    </p>
                  </div>
                  <div>
                    <p className="text-amber-600">Fat</p>
                    <p className="text-xl font-semibold text-amber-800">
                      {recipe.nutrition.fat_per_serving}g
                    </p>
                  </div>
                  <div>
                    <p className="text-amber-600">Protein</p>
                    <p className="text-xl font-semibold text-amber-800">
                      {recipe.nutrition.protein_per_serving}g
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-amber-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-amber-800 mb-3">
                  Ingredients
                </h3>
                <div className="space-y-2">
                  {recipe.ingredients.map((ingredient) => (
                    <div
                      key={ingredient.ingredient_id}
                      className="flex justify-between items-center py-2 border-b border-amber-200 last:border-0"
                    >
                      <span className="text-amber-700">{ingredient.name}</span>
                      <span className="text-amber-600 font-medium">
                        {ingredient.amount}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-amber-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-amber-800 mb-3">
                  Required Tools
                </h3>
                <div className="flex flex-wrap gap-2">
                  {recipe.tools.map((tool) => (
                    <span
                      key={tool.tool_id}
                      className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm"
                    >
                      {tool.name}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-amber-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-amber-800 mb-2">
                  Show Statistics
                </h3>
                <div>
                  <p className="text-amber-600">Episode Appearances</p>
                  <p className="text-2xl font-bold text-amber-800">
                    {recipe.episodeAppearances}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RecipeDetails;
