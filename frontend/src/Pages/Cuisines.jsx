import { useState, useEffect } from "react";
import api from "../api/generalService";

function Cuisines() {
  const [cuisines, setCuisines] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentCuisine, setCurrentCuisine] = useState({ id: null, name: "" });
  const [newCuisineName, setNewCuisineName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchCuisines();
  }, []);

  const fetchCuisines = async () => {
    setIsLoading(true);
    try {
      const res = await api.cuisines.getAllCuisines();
      if (!res.error) {
        setCuisines(res.data);
      } else {
        setError(res.message);
      }
    } catch (err) {
      setError("Failed to fetch cuisines");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddCuisine = async (e) => {
    e.preventDefault();
    if (!newCuisineName.trim()) return;

    try {
      const result = await api.cuisines.createCuisine(newCuisineName);
      if (!result.error) {
        await fetchCuisines();
        setNewCuisineName("");
        setShowAddModal(false);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError("Failed to add cuisine");
      console.error(err);
    }
  };

  const handleEditCuisine = async (e) => {
    e.preventDefault();
    if (!currentCuisine.name.trim()) return;

    try {
      const result = await api.cuisines.updateCuisine(
        currentCuisine.id,
        currentCuisine.name
      );
      if (!result.error) {
        await fetchCuisines();
        setShowEditModal(false);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError("Failed to update cuisine");
      console.error(err);
    }
  };

  const handleDeleteCuisine = async (id) => {
    if (window.confirm("Are you sure you want to delete this cuisine?")) {
      try {
        const result = await api.cuisines.deleteCuisine(id);
        if (!result.error) {
          await fetchCuisines();
        } else {
          setError(result.message);
        }
      } catch (err) {
        setError("Failed to delete cuisine");
        console.error(err);
      }
    }
  };

  const openEditModal = (cuisine) => {
    setCurrentCuisine({ ...cuisine });
    setShowEditModal(true);
  };

  const filteredCuisines = cuisines.filter((cuisine) =>
    cuisine.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-amber-800">Cuisines</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-md flex items-center"
        >
          <span className="mr-2">Add Cuisine</span>
          <span>➕</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <svg
            className="w-4 h-4 text-amber-500"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 20"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
            />
          </svg>
        </div>
        <input
          type="text"
          className="block w-full p-3 pl-10 text-sm text-amber-900 border border-amber-300 rounded-lg bg-white focus:ring-amber-500 focus:border-amber-500"
          placeholder="Search cuisines..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-amber-500 hover:text-amber-700"
          >
            <svg
              className="w-4 h-4"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
              />
            </svg>
          </button>
        )}
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
          <p className="mt-3 text-amber-800">Loading cuisines...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCuisines.length > 0 ? (
            filteredCuisines.map((cuisine) => (
              <div
                key={cuisine.id}
                className="bg-white rounded-lg shadow-md overflow-hidden border border-amber-200 hover:shadow-lg transition-shadow"
              >
                <div className="p-5">
                  <h3 className="text-xl font-semibold text-amber-800 mb-2">
                    {cuisine.name}
                  </h3>
                  <div className="flex justify-end space-x-2 mt-4">
                    <button
                      onClick={() => openEditModal(cuisine)}
                      className="text-amber-600 hover:text-amber-800"
                      title="Edit"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDeleteCuisine(cuisine.id)}
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
              No cuisines found. Add your first cuisine!
            </div>
          )}
        </div>
      )}

      {/* Add Cuisine Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold text-amber-800 mb-4">
              Add New Cuisine
            </h3>
            <form onSubmit={handleAddCuisine}>
              <div className="mb-4">
                <label
                  className="block text-amber-700 mb-2"
                  htmlFor="cuisine-name"
                >
                  Cuisine Name
                </label>
                <input
                  id="cuisine-name"
                  type="text"
                  value={newCuisineName}
                  onChange={(e) => setNewCuisineName(e.target.value)}
                  className="w-full px-3 py-2 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="Enter cuisine name"
                  maxLength="40"
                  required
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
                  Add Cuisine
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Cuisine Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold text-amber-800 mb-4">
              Edit Cuisine
            </h3>
            <form onSubmit={handleEditCuisine}>
              <div className="mb-4">
                <label
                  className="block text-amber-700 mb-2"
                  htmlFor="edit-cuisine-name"
                >
                  Cuisine Name
                </label>
                <input
                  id="edit-cuisine-name"
                  type="text"
                  value={currentCuisine.name}
                  onChange={(e) =>
                    setCurrentCuisine({
                      ...currentCuisine,
                      name: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="Enter cuisine name"
                  maxLength={40}
                  required
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
                  Update Cuisine
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cuisines;
