import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import cookService from "../api/cookService";

function Cooks() {
  const [cooks, setCooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filteredCooks, setFilteredCooks] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Filter states
  const [selectedClass, setSelectedClass] = useState("");
  const [ageRange, setAgeRange] = useState({ min: "", max: "" });

  const classOptions = ["chef", "chef assistant", "A", "B", "C"];

  useEffect(() => {
    fetchCooks();
  }, []);

  // Apply filters whenever cooks data or filter values change
  useEffect(() => {
    applyFilters();
  }, [cooks, selectedClass, ageRange]); //Corrected dependency array

  const fetchCooks = async () => {
    setIsLoading(true);
    try {
      const response = await cookService.getAllCooks();
      if (response.status === "success") {
        setCooks(response.data);
      } else {
        setError("Failed to fetch cooks");
      }
    } catch (err) {
      setError("Failed to fetch cooks");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...cooks];

    // Apply class filter
    if (selectedClass) {
      filtered = filtered.filter((cook) => cook.class === selectedClass);
    }

    // Apply age range filter
    if (ageRange.min !== "") {
      filtered = filtered.filter(
        (cook) => cook.age >= Number.parseInt(ageRange.min)
      );
    }
    if (ageRange.max !== "") {
      filtered = filtered.filter(
        (cook) => cook.age <= Number.parseInt(ageRange.max)
      );
    }

    setFilteredCooks(filtered);
  };

  const clearFilters = () => {
    setSelectedClass("");
    setAgeRange({ min: "", max: "" });
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this cook?")) {
      try {
        const response = await cookService.deleteCook(id);
        if (response.status === "success") {
          await fetchCooks();
        } else {
          setError("Failed to delete cook");
        }
      } catch (err) {
        setError("Failed to delete cook");
        console.error(err);
      }
    }
  };

  const handleEdit = (e, id) => {
    e.stopPropagation();
    navigate(`/cooks/edit/${id}`);
  };

  const getClassBadgeColor = (cookClass) => {
    const colors = {
      chef: "bg-amber-600",
      "chef assistant": "bg-amber-500",
      A: "bg-green-500",
      B: "bg-blue-500",
      C: "bg-purple-500",
    };
    return colors[cookClass] || "bg-gray-500";
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-amber-800">Cooks</h2>
        <button
          onClick={() => navigate("/cooks/new")}
          className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-md flex items-center"
        >
          <span className="mr-2">Add Cook</span>
          <span>➕</span>
        </button>
      </div>

      {/* Filters Section */}
      <div className="bg-white p-4 rounded-lg shadow-md border border-amber-200">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-amber-800 mb-4">Filters</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Class Filter */}
            <div>
              <label
                className="block text-amber-700 mb-2"
                htmlFor="class-filter"
              >
                Class
              </label>
              <select
                id="class-filter"
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full px-3 py-2 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="">All Classes</option>
                {classOptions.map((classOption) => (
                  <option key={classOption} value={classOption}>
                    {classOption.charAt(0).toUpperCase() + classOption.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Age Range Filter */}
            <div>
              <label className="block text-amber-700 mb-2">Age Range</label>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  min="0"
                  placeholder="Min"
                  value={ageRange.min}
                  onChange={(e) =>
                    setAgeRange({ ...ageRange, min: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <span className="text-amber-700">-</span>
                <input
                  type="number"
                  min="0"
                  placeholder="Max"
                  value={ageRange.max}
                  onChange={(e) =>
                    setAgeRange({ ...ageRange, max: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            {/* Clear Filters Button */}
            <div className="flex items-end">
              <button
                onClick={clearFilters}
                className="px-4 py-2 text-amber-600 hover:text-amber-700 border border-amber-300 rounded-md hover:bg-amber-50"
              >
                Clear Filters
              </button>
            </div>
          </div>

          {/* Results Count */}
          <div className="text-sm text-amber-600">
            Showing {filteredCooks.length} of {cooks.length} cooks
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-700 mx-auto"></div>
          <p className="mt-3 text-amber-800">Loading cooks...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCooks.length > 0 ? (
            filteredCooks.map((cook) => (
              <div
                key={cook.cook_id}
                onClick={() => navigate(`/cooks/${cook.cook_id}`)}
                className="bg-white rounded-lg shadow-md overflow-hidden border border-amber-200 hover:shadow-lg transition-all cursor-pointer"
              >
                <div className="p-5">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-amber-800 mb-2">
                        {cook.name}
                      </h3>
                      <p className="text-amber-600">Age: {cook.age}</p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-white text-sm ${getClassBadgeColor(
                        cook.class
                      )}`}
                    >
                      {cook.class}
                    </span>
                  </div>
                  <div className="flex justify-end space-x-2 mt-4">
                    <button
                      onClick={(e) => handleEdit(e, cook.cook_id)}
                      className="text-amber-600 hover:text-amber-800"
                      title="Edit"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={(e) => handleDelete(e, cook.cook_id)}
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
              No cooks found. Add your first cook!
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Cooks;
