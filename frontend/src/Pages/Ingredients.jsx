import { useState, useEffect } from "react";
import api from "../api/generalService";

function Ingredients() {
  const [ingredients, setIngredients] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentIngredient, setCurrentIngredient] = useState({
    id: null,
    name: "",
    calories: 0,
  });
  const [newIngredient, setNewIngredient] = useState({ name: "", calories: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchIngredients();
  }, []);

  const fetchIngredients = async () => {
    setIsLoading(true);
    try {
      const data = await api.ingredients.getAllIngredients();
      if (!data.error) {
        setIngredients(data);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Failed to fetch ingredients");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddIngredient = async (e) => {
    e.preventDefault();
    if (!newIngredient.name.trim()) return;

    try {
      const result = await api.ingredients.createIngredient(
        newIngredient.name,
        Number.parseInt(newIngredient.calories, 10) || 0
      );
      if (!result.error) {
        await fetchIngredients();
        setNewIngredient({ name: "", calories: 0 });
        setShowAddModal(false);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError("Failed to add ingredient");
      console.error(err);
    }
  };

  const handleEditIngredient = async (e) => {
    e.preventDefault();
    if (!currentIngredient.name.trim()) return;

    try {
      const result = await api.ingredients.updateIngredient(
        currentIngredient.id,
        currentIngredient.name,
        Number.parseInt(currentIngredient.calories, 10) || 0
      );
      if (!result.error) {
        await fetchIngredients();
        setShowEditModal(false);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError("Failed to update ingredient");
      console.error(err);
    }
  };

  const handleDeleteIngredient = async (id) => {
    if (window.confirm("Are you sure you want to delete this ingredient?")) {
      try {
        const result = await api.ingredients.deleteIngredient(id);
        if (!result.error) {
          await fetchIngredients();
        } else {
          setError(result.message);
        }
      } catch (err) {
        setError("Failed to delete ingredient");
        console.error(err);
      }
    }
  };

  const openEditModal = (ingredient) => {
    setCurrentIngredient({ ...ingredient });
    setShowEditModal(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-amber-800">Ingredients</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-md flex items-center"
        >
          <span className="mr-2">Add Ingredient</span>
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
          <p className="mt-3 text-amber-800">Loading ingredients...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ingredients.length > 0 ? (
            ingredients.map((ingredient) => (
              <div
                key={ingredient.id}
                className="bg-white rounded-lg shadow-md overflow-hidden border border-amber-200 hover:shadow-lg transition-shadow"
              >
                <div className="p-5">
                  <h3 className="text-xl font-semibold text-amber-800 mb-2">
                    {ingredient.name}
                  </h3>
                  <p className="text-amber-600">
                    Calories: {ingredient.calories}
                  </p>
                  <div className="flex justify-end space-x-2 mt-4">
                    <button
                      onClick={() => openEditModal(ingredient)}
                      className="text-amber-600 hover:text-amber-800"
                      title="Edit"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDeleteIngredient(ingredient.id)}
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
              No ingredients found. Add your first ingredient!
            </div>
          )}
        </div>
      )}

      {/* Add Ingredient Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold text-amber-800 mb-4">
              Add New Ingredient
            </h3>
            <form onSubmit={handleAddIngredient}>
              <div className="mb-4">
                <label
                  className="block text-amber-700 mb-2"
                  htmlFor="ingredient-name"
                >
                  Ingredient Name
                </label>
                <input
                  id="ingredient-name"
                  type="text"
                  value={newIngredient.name}
                  onChange={(e) =>
                    setNewIngredient({ ...newIngredient, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="Enter ingredient name"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-amber-700 mb-2"
                  htmlFor="ingredient-calories"
                >
                  Calories
                </label>
                <input
                  id="ingredient-calories"
                  type="number"
                  value={newIngredient.calories}
                  onChange={(e) =>
                    setNewIngredient({
                      ...newIngredient,
                      calories: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="Enter calories"
                  min="0"
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-amber-300 rounded-md text-amber-700 hover:bg-amber-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700"
                >
                  Add Ingredient
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Ingredient Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold text-amber-800 mb-4">
              Edit Ingredient
            </h3>
            <form onSubmit={handleEditIngredient}>
              <div className="mb-4">
                <label
                  className="block text-amber-700 mb-2"
                  htmlFor="edit-ingredient-name"
                >
                  Ingredient Name
                </label>
                <input
                  id="edit-ingredient-name"
                  type="text"
                  value={currentIngredient.name}
                  onChange={(e) =>
                    setCurrentIngredient({
                      ...currentIngredient,
                      name: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="Enter ingredient name"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-amber-700 mb-2"
                  htmlFor="edit-ingredient-calories"
                >
                  Calories
                </label>
                <input
                  id="edit-ingredient-calories"
                  type="number"
                  value={currentIngredient.calories}
                  onChange={(e) =>
                    setCurrentIngredient({
                      ...currentIngredient,
                      calories: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="Enter calories"
                  min="0"
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 border border-amber-300 rounded-md text-amber-700 hover:bg-amber-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700"
                >
                  Update Ingredient
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Ingredients;
