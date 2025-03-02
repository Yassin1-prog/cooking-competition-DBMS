import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import cookService from "../api/cookService";
import api from "../api/generalService";

function NewCook() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [availableCuisines, setAvailableCuisines] = useState([]);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    birth: "",
    phone: "",
    years_of_experience: "",
    class: "C",
    cuisines: [],
  });

  useEffect(() => {
    fetchCuisines();
  }, []);

  useEffect(() => {
    if (id && availableCuisines.length > 0) {
      fetchCookDetails();
    }
  }, [id, availableCuisines]);

  const fetchCuisines = async () => {
    try {
      const response = await api.cuisines.getAllCuisines();
      if (!response.error) {
        setAvailableCuisines(response.data);
      }
    } catch (err) {
      console.error("Failed to fetch cuisines:", err);
    }
  };

  const fetchCookDetails = async () => {
    setIsLoading(true);
    try {
      const response = await cookService.getCookById(id);
      if (response.status === "success") {
        const cook = response.data;
        const [firstName, ...lastNameParts] = cook.name.split(" ");
        console.log(availableCuisines);
        setFormData({
          first_name: firstName,
          last_name: lastNameParts.join(" "),
          birth: cook.birthDate,
          phone: cook.phone,
          years_of_experience: cook.experience,
          class: cook.class,
          cuisines: cook.cuisines
            .map(
              (cuisine) => availableCuisines.find((c) => c.name === cuisine)?.id
            )
            .filter(Boolean),
        });
      }
    } catch (err) {
      setError("Failed to fetch cook details");
      console.log(err.message);
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
        ? await cookService.updateCook(id, formData)
        : await cookService.createCook(formData);

      if (response.status === "success") {
        navigate("/cooks");
      } else {
        setError(response.message || "Failed to save cook");
      }
    } catch (err) {
      setError("Failed to save cook");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCuisineChange = (cuisineId) => {
    setFormData((prev) => ({
      ...prev,
      cuisines: prev.cuisines.includes(cuisineId)
        ? prev.cuisines.filter((id) => id !== cuisineId)
        : [...prev.cuisines, cuisineId],
    }));
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-amber-800">
          {id ? "Edit Cook" : "Add New Cook"}
        </h2>
        <button
          onClick={() => navigate("/cooks")}
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

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-amber-700 mb-2" htmlFor="first_name">
              First Name
            </label>
            <input
              id="first_name"
              name="first_name"
              type="text"
              required
              value={formData.first_name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="block text-amber-700 mb-2" htmlFor="last_name">
              Last Name
            </label>
            <input
              id="last_name"
              name="last_name"
              type="text"
              required
              value={formData.last_name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="block text-amber-700 mb-2" htmlFor="birth">
              Birth Date
            </label>
            <input
              id="birth"
              name="birth"
              type="date"
              required
              value={formData.birth}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="block text-amber-700 mb-2" htmlFor="phone">
              Phone Number
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              required
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div>
            <label
              className="block text-amber-700 mb-2"
              htmlFor="years_of_experience"
            >
              Years of Experience
            </label>
            <input
              id="years_of_experience"
              name="years_of_experience"
              type="number"
              min="0"
              required
              value={formData.years_of_experience}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="block text-amber-700 mb-2" htmlFor="class">
              Class
            </label>
            <select
              id="class"
              name="class"
              required
              value={formData.class}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="C">C</option>
              <option value="B">B</option>
              <option value="A">A</option>
              <option value="chef assistant">Chef Assistant</option>
              <option value="chef">Chef</option>
            </select>
          </div>
        </div>
        {console.log(formData)}
        <div>
          <label className="block text-amber-700 mb-2">
            Cuisine Experience
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {availableCuisines.map((cuisine) => (
              <label
                key={cuisine.id}
                className="flex items-center space-x-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={formData.cuisines.includes(cuisine.id)}
                  onChange={() => handleCuisineChange(cuisine.id)}
                  className="rounded border-amber-300 text-amber-600 focus:ring-amber-500"
                />
                <span className="text-amber-700">{cuisine.name}</span>
              </label>
            ))}
          </div>
        </div>
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate("/cooks")}
            className="px-4 py-2 border border-amber-300 rounded-md text-amber-700 hover:bg-amber-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 disabled:opacity-50"
          >
            {isLoading ? "Saving..." : id ? "Update Cook" : "Add Cook"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default NewCook;
