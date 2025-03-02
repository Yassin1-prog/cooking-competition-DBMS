import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import recipeService from "../api/recipeService";
import api from "../api/generalService";

function Recipes() {
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [cuisines, setCuisines] = useState([]);
  const navigate = useNavigate();

  // Filter states
  const [filters, setFilters] = useState({
    cuisine_id: "",
    difficulity: "",
  });

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchQuery, filters]); //Corrected dependency array

  const fetchInitialData = async () => {
    setIsLoading(true);
    try {
      const [recipesResponse, cuisinesResponse] = await Promise.all([
        recipeService.getAllRecipes(),
        api.cuisines.getAllCuisines(),
      ]);

      if (recipesResponse.success) {
        setRecipes(recipesResponse.data);
        setFilteredRecipes(recipesResponse.data);
      }

      if (!cuisinesResponse.error) {
        setCuisines(cuisinesResponse.data);
      }
    } catch (err) {
      setError("Failed to fetch data");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...recipes];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter((recipe) =>
        recipe.recipe_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply cuisine filter
    if (filters.cuisine_id) {
      filtered = filtered.filter(
        (recipe) =>
          recipe.cuisine_name ===
          cuisines.find((c) => c.id === Number.parseInt(filters.cuisine_id))
            ?.name
      );
    }

    // Apply difficulty filter
    if (filters.difficulity) {
      filtered = filtered.filter(
        (recipe) => recipe.difficulity === Number.parseInt(filters.difficulity)
      );
    }

    setFilteredRecipes(filtered);
  };

  const clearFilters = () => {
    setFilters({
      cuisine_id: "",
      difficulity: "",
    });
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this recipe?")) {
      try {
        const response = await recipeService.deleteRecipe(id);
        if (response.success) {
          await fetchInitialData();
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

      {/* Search and Filter Bar */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Search recipes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 pl-10 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-500">
            🔍
          </span>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-amber-500 hover:text-amber-700"
            >
              ✕
            </button>
          )}
        </div>
        <button
          onClick={() => setShowFilterModal(true)}
          className="px-4 py-2 bg-amber-100 text-amber-800 rounded-md hover:bg-amber-200 flex items-center gap-2"
        >
          <span>Filter</span>
          <span>🔽</span>
        </button>
      </div>

      {/* Results Count */}
      <div className="text-sm text-amber-600">
        Showing {filteredRecipes.length} of {recipes.length} recipes
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded flex justify-between items-center">
          <span>{error}</span>
          <button
            onClick={() => setError(null)}
            className="text-red-700 hover:text-red-900"
          >
            ❌
          </button>
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-700 mx-auto"></div>
          <p className="mt-3 text-amber-800">Loading recipes...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecipes.length > 0 ? (
            filteredRecipes.map((recipe) => (
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

      {/* Filter Modal */}
      {showFilterModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-amber-800">
                Filter Recipes
              </h3>
              <button
                onClick={() => setShowFilterModal(false)}
                className="text-amber-500 hover:text-amber-700"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              {/* Cuisine Filter */}
              <div>
                <label
                  className="block text-amber-700 mb-2"
                  htmlFor="cuisine-filter"
                >
                  Cuisine
                </label>
                <select
                  id="cuisine-filter"
                  value={filters.cuisine_id}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      cuisine_id: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="">All Cuisines</option>
                  {cuisines.map((cuisine) => (
                    <option key={cuisine.id} value={cuisine.id}>
                      {cuisine.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Difficulty Filter */}
              <div>
                <label className="block text-amber-700 mb-2">Difficulty</label>
                <div className="flex gap-4">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <button
                      key={level}
                      onClick={() =>
                        setFilters((prev) => ({
                          ...prev,
                          difficulity:
                            prev.difficulity === level.toString()
                              ? ""
                              : level.toString(),
                        }))
                      }
                      className={`px-3 py-1 rounded-md transition-colors ${
                        filters.difficulity === level.toString()
                          ? "bg-amber-500 text-white"
                          : "bg-amber-100 text-amber-800 hover:bg-amber-200"
                      }`}
                    >
                      {"⭐".repeat(level)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Filter Actions */}
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => {
                    clearFilters();
                    setShowFilterModal(false);
                  }}
                  className="px-4 py-2 border border-amber-300 rounded-md text-amber-700 hover:bg-amber-50"
                >
                  Clear Filters
                </button>
                <button
                  onClick={() => setShowFilterModal(false)}
                  className="px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Recipes;
