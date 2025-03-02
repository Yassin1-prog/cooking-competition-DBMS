import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import cookService from "../api/cookService";

function Cooks() {
  const [cooks, setCooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCooks();
  }, []);

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
          {cooks.length > 0 ? (
            cooks.map((cook) => (
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
