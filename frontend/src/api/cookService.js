import axios from "axios";

// Base URL for cook API requests
const BASE_URL = "http://localhost:3000";

// Create axios instance with common configurations
const cookClient = axios.create({
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
    console.error("Cook API Error Response:", error.response.data);
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
 * Cook API Service
 * Handles all operations related to cook data
 */
const cookService = {
  // Get all cooks
  getAllCooks: async () => {
    try {
      const response = await cookClient.get("/cooks");
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Get a single cook by ID
  getCookById: async (id) => {
    try {
      const response = await cookClient.get(`/cooks/${id}`);
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Create a new cook
  createCook: async (cookData) => {
    try {
      const response = await cookClient.post("/cooks/create", cookData);
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Update an existing cook
  updateCook: async (id, cookData) => {
    try {
      const response = await cookClient.post(`/cooks/${id}/update`, cookData);
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Delete a cook
  deleteCook: async (id) => {
    try {
      const response = await cookClient.post(`/cooks/${id}/delete`);
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },
};

export default cookService;
