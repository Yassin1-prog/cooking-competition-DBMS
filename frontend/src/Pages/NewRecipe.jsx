import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import recipeService from "../api/recipeService";
import api from "../api/generalService";

function NewRecipe() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cuisines, setCuisines] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [tools, setTools] = useState([]);
  const [formData, setFormData] = useState({
    recipe_name: "",
    description: "",
    cuisine_id: "",
    difficulity: "1",
    category: "",
    steps: "",
    nutrition: {
      calories: "",
      carbs: "",
      fat: "",
      protein: "",
    },
    ingredients: [],
    tools: [],
  });

  useEffect(() => {
    fetchInitialData();
  }, []); // Removed unnecessary dependency 'id'

  const fetchInitialData = async () => {
    setIsLoading(true);
    try {
      const [cuisinesRes, ingredientsRes, toolsRes] = await Promise.all([
        api.cuisines.getAllCuisines(),
        api.ingredients.getAllIngredients(),
        api.tools.getAllTools(),
      ]);

      setCuisines(cuisinesRes.data);
      setIngredients(ingredientsRes.data);
      setTools(toolsRes.data);

      if (id) {
        const recipeRes = await recipeService.getRecipeById(id);
        if (recipeRes.success) {
          const recipe = recipeRes.data;
          setFormData({
            recipe_name: recipe.name,
            description: recipe.description,
            cuisine_id: cuisinesRes.data.find(
              (c) => c.name === recipe.cuisine_name
            )?.id,
            difficulity: recipe.difficulity.toString(),
            category: recipe.category,
            steps: recipe.steps,
            nutrition: {
              calories: recipe.nutrition.calories_per_serving,
              carbs: recipe.nutrition.carbs_per_servning,
              fat: recipe.nutrition.fat_per_serving,
              protein: recipe.nutrition.protein_per_serving,
            },
            ingredients: recipe.ingredients.map((ing) => ({
              ingredient_id: ing.ingredient_id,
              amount: ing.amount,
            })),
            tools: recipe.tools.map((tool) => tool.tool_id),
          });
        }
      }
    } catch (err) {
      setError("Failed to fetch initial data");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = id
        ? await recipeService.updateRecipe(id, formData)
        : await recipeService.createRecipe(formData);

      if (response.success) {
        navigate("/recipes");
      } else {
        setError(response.message || "Failed to save recipe");
      }
    } catch (err) {
      setError("Failed to save recipe");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("nutrition.")) {
      const nutritionField = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        nutrition: {
          ...prev.nutrition,
          [nutritionField]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleIngredientChange = (ingredientId, amount) => {
    setFormData((prev) => {
      const newIngredients = [...prev.ingredients];
      const index = newIngredients.findIndex(
        (i) => i.ingredient_id === ingredientId
      );

      if (amount === "") {
        // Remove ingredient if amount is empty
        if (index > -1) {
          newIngredients.splice(index, 1);
        }
      } else {
        // Update or add ingredient
        if (index > -1) {
          newIngredients[index] = { ingredient_id: ingredientId, amount };
        } else {
          newIngredients.push({ ingredient_id: ingredientId, amount });
        }
      }

      return {
        ...prev,
        ingredients: newIngredients,
      };
    });
  };

  const handleToolToggle = (toolId) => {
    setFormData((prev) => ({
      ...prev,
      tools: prev.tools.includes(toolId)
        ? prev.tools.filter((id) => id !== toolId)
        : [...prev.tools, toolId],
    }));
  };

  const getIngredientAmount = (ingredientId) => {
    return (
      formData.ingredients.find((i) => i.ingredient_id === ingredientId)
        ?.amount || ""
    );
  };

  if (isLoading) {
    return (
      <div className="text-center py-10">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-700 mx-auto"></div>
        <p className="mt-3 text-amber-800">Loading...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-amber-800">
          {id ? "Edit Recipe" : "Add New Recipe"}
        </h2>
        <button
          onClick={() => navigate("/recipes")}
          className="text-amber-600 hover:text-amber-800"
        >
          Cancel
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-amber-700 mb-2" htmlFor="recipe_name">
              Recipe Name
            </label>
            <input
              id="recipe_name"
              name="recipe_name"
              type="text"
              required
              value={formData.recipe_name}
              onChange={handleChange}
              maxLength={40}
              className="w-full px-3 py-2 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="block text-amber-700 mb-2" htmlFor="category">
              Category
            </label>
            <input
              id="category"
              name="category"
              type="text"
              required
              value={formData.category}
              onChange={handleChange}
              maxLength={40}
              className="w-full px-3 py-2 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="block text-amber-700 mb-2" htmlFor="cuisine_id">
              Cuisine
            </label>
            <select
              id="cuisine_id"
              name="cuisine_id"
              required
              value={formData.cuisine_id}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="">Select Cuisine</option>
              {cuisines.map((cuisine) => (
                <option key={cuisine.id} value={cuisine.id}>
                  {cuisine.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-amber-700 mb-2" htmlFor="difficulity">
              Difficulty
            </label>
            <select
              id="difficulity"
              name="difficulity"
              required
              value={formData.difficulity}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              {[1, 2, 3, 4, 5].map((level) => (
                <option key={level} value={level}>
                  {"⭐".repeat(level)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-amber-700 mb-2" htmlFor="description">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            required
            value={formData.description}
            onChange={handleChange}
            rows={3}
            maxLength={1000}
            className="w-full px-3 py-2 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        <div>
          <label className="block text-amber-700 mb-2" htmlFor="steps">
            Steps
          </label>
          <textarea
            id="steps"
            name="steps"
            required
            value={formData.steps}
            onChange={handleChange}
            rows={5}
            maxLength={1000}
            className="w-full px-3 py-2 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        <div>
          <h3 className="text-lg font-semibold text-amber-800 mb-4">
            Nutrition Information
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label
                className="block text-amber-700 mb-2"
                htmlFor="nutrition.calories"
              >
                Calories
              </label>
              <input
                id="nutrition.calories"
                name="nutrition.calories"
                type="number"
                step="0.01"
                required
                value={formData.nutrition.calories}
                onChange={handleChange}
                max={10000}
                className="w-full px-3 py-2 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <div>
              <label
                className="block text-amber-700 mb-2"
                htmlFor="nutrition.carbs"
              >
                Carbs (g)
              </label>
              <input
                id="nutrition.carbs"
                name="nutrition.carbs"
                type="number"
                step="0.01"
                required
                value={formData.nutrition.carbs}
                onChange={handleChange}
                max={10000}
                className="w-full px-3 py-2 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <div>
              <label
                className="block text-amber-700 mb-2"
                htmlFor="nutrition.fat"
              >
                Fat (g)
              </label>
              <input
                id="nutrition.fat"
                name="nutrition.fat"
                type="number"
                step="0.01"
                required
                value={formData.nutrition.fat}
                onChange={handleChange}
                max={10000}
                className="w-full px-3 py-2 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <div>
              <label
                className="block text-amber-700 mb-2"
                htmlFor="nutrition.protein"
              >
                Protein (g)
              </label>
              <input
                id="nutrition.protein"
                name="nutrition.protein"
                type="number"
                step="0.01"
                required
                value={formData.nutrition.protein}
                onChange={handleChange}
                max={10000}
                className="w-full px-3 py-2 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-amber-800 mb-4">
            Ingredients
          </h3>
          <div className="max-h-60 overflow-y-auto border border-amber-200 rounded-md p-4">
            <div className="space-y-4">
              {ingredients.map((ingredient) => (
                <div key={ingredient.id} className="flex items-center gap-4">
                  <label className="flex-1 text-amber-700">
                    {ingredient.name}
                  </label>
                  <input
                    type="text"
                    value={getIngredientAmount(ingredient.id)}
                    onChange={(e) =>
                      handleIngredientChange(ingredient.id, e.target.value)
                    }
                    placeholder="Amount"
                    maxLength={40}
                    className="w-24 px-2 py-1 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-amber-800 mb-4">
            Required Tools
          </h3>
          <div className="max-h-60 overflow-y-auto border border-amber-200 rounded-md p-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {tools.map((tool) => (
                <label
                  key={tool.id}
                  className="flex items-center space-x-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={formData.tools.includes(tool.id)}
                    onChange={() => handleToolToggle(tool.id)}
                    className="rounded border-amber-300 text-amber-600 focus:ring-amber-500"
                  />
                  <span className="text-amber-700">{tool.name}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate("/recipes")}
            className="px-4 py-2 border border-amber-300 rounded-md text-amber-700 hover:bg-amber-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 disabled:opacity-50"
          >
            {isLoading ? "Saving..." : id ? "Update Recipe" : "Add Recipe"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default NewRecipe;
