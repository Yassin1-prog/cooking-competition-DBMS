import axios from "axios";

// Base URL for all API requests
const BASE_URL = "http://localhost:3000/general";

// Create axios instance with common configurations
const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 seconds timeout
});

// Error handling helper
const handleApiError = (error) => {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    console.error("API Error Response:", error.response.data);
    console.error("Status:", error.response.status);
    return {
      error: true,
      message: error.response.data.message || "An error occurred",
      status: error.response.status,
      data: error.response.data,
    };
  } else if (error.request) {
    // The request was made but no response was received
    console.error("No Response Received:", error.request);
    return {
      error: true,
      message: "No response from server. Please check your connection.",
      status: 0,
    };
  } else {
    // Something happened in setting up the request that triggered an Error
    console.error("Request Error:", error.message);
    return {
      error: true,
      message: error.message || "An unexpected error occurred",
      status: 0,
    };
  }
};

/**
 * Cuisine API Services
 */
export const cuisineService = {
  // Get all cuisines
  getAllCuisines: async () => {
    try {
      const response = await apiClient.get("/cuisines");
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Create a new cuisine
  createCuisine: async (name) => {
    try {
      const response = await apiClient.post("/cuisines/create", { name });
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Update an existing cuisine
  updateCuisine: async (id, name) => {
    try {
      const response = await apiClient.post(`/cuisines/${id}/update`, { name });
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Delete a cuisine
  deleteCuisine: async (id) => {
    try {
      const response = await apiClient.post(`/cuisines/${id}/delete`);
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },
};

/**
 * Ingredient API Services
 */
export const ingredientService = {
  // Get all ingredients
  getAllIngredients: async () => {
    try {
      const response = await apiClient.get("/ingredients");
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Create a new ingredient
  createIngredient: async (name, calories) => {
    try {
      const response = await apiClient.post("/ingredients/create", {
        name,
        calories,
      });
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Update an existing ingredient
  updateIngredient: async (id, name, calories) => {
    try {
      const response = await apiClient.post(`/ingredients/${id}/update`, {
        name,
        calories,
      });
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Delete an ingredient
  deleteIngredient: async (id) => {
    try {
      const response = await apiClient.post(`/ingredients/${id}/delete`);
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },
};

/**
 * Tool API Services
 */
export const toolService = {
  // Get all tools
  getAllTools: async () => {
    try {
      const response = await apiClient.get("/tools");
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Create a new tool
  createTool: async (name) => {
    try {
      const response = await apiClient.post("/tools/create", { name });
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Update an existing tool
  updateTool: async (id, name) => {
    try {
      const response = await apiClient.post(`/tools/${id}/update`, { name });
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Delete a tool
  deleteTool: async (id) => {
    try {
      const response = await apiClient.post(`/tools/${id}/delete`);
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },
};

// Export a combined API service object for convenience
const api = {
  cuisines: cuisineService,
  ingredients: ingredientService,
  tools: toolService,
};

export default api;
