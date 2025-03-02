import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import cookService from "../api/cookService";

function CookDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cook, setCook] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCookDetails();
  }, []);

  const fetchCookDetails = async () => {
    setIsLoading(true);
    try {
      const response = await cookService.getCookById(id);
      if (response.status === "success") {
        setCook(response.data);
      } else {
        setError("Failed to fetch cook details");
      }
    } catch (err) {
      setError("Failed to fetch cook details");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
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

  if (isLoading) {
    return (
      <div className="text-center py-10">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-700 mx-auto"></div>
        <p className="mt-3 text-amber-800">Loading cook details...</p>
      </div>
    );
  }

  if (error || !cook) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
        {error || "Cook not found"}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <button
          onClick={() => navigate("/cooks")}
          className="text-amber-600 hover:text-amber-800 flex items-center gap-2"
        >
          ← Back to Cooks
        </button>
        <button
          onClick={() => navigate(`/cooks/edit/${id}`)}
          className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-md"
        >
          Edit Cook
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6 border border-amber-200">
        <div className="space-y-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-3xl font-bold text-amber-800 mb-2">
                {cook.name}
              </h2>
              <p className="text-amber-600">
                Born: {new Date(cook.birthDate).toLocaleDateString()}
              </p>
            </div>
            <span
              className={`px-4 py-2 rounded-full text-white ${getClassBadgeColor(
                cook.class
              )}`}
            >
              {cook.class}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="bg-amber-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-amber-800 mb-2">
                  Contact Information
                </h3>
                <p className="text-amber-700">Phone: {cook.phone}</p>
                <p className="text-amber-700">Age: {cook.age} years</p>
              </div>

              <div className="bg-amber-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-amber-800 mb-2">
                  Professional Experience
                </h3>
                <p className="text-amber-700">
                  Years of Experience: {cook.experience}
                </p>
                <div className="mt-2">
                  <h4 className="font-medium text-amber-800">
                    Cuisine Expertise:
                  </h4>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {cook.cuisines.map((cuisine, index) => (
                      <span
                        key={index}
                        className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm"
                      >
                        {cuisine}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-amber-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-amber-800 mb-2">
                  Show Statistics
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-amber-600">Judge Appearances</p>
                    <p className="text-2xl font-bold text-amber-800">
                      {cook.judgeAppearances}
                    </p>
                  </div>
                  <div>
                    <p className="text-amber-600">Cook Appearances</p>
                    <p className="text-2xl font-bold text-amber-800">
                      {cook.cookAppearances}
                    </p>
                  </div>
                  <div>
                    <p className="text-amber-600">Wins</p>
                    <p className="text-2xl font-bold text-amber-800">
                      {cook.wins}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CookDetails;
