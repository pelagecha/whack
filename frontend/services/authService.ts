import axios from "axios";

const API_URL = "http://127.0.0.1:5000";

export const registerUser = async (username: string, password: string) => {
    try {
        const response = await axios.post(`${API_URL}/register`, {
            username,
            password,
        });
        return response.data;
    } catch (error) {
        const message =
            error.response?.data?.detail || "An unexpected error occurred.";
        return { success: false, message };
    }
};

export const loginUser = async (username: string, password: string) => {
    try {
        const response = await axios.post(`${API_URL}/login`, {
            username,
            password,
        });
        return { success: true, user: response.data }; // Correct response object
    } catch (error: any) {
        const message =
            error.response?.data?.detail || "An unexpected error occurred.";
        return { success: false, message };
    }
};

export const getUserData = async (token: string) => {
    // Updated to use token for authenticated requests
    try {
        const response = await axios.get(`${API_URL}/user`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return { success: true, user: response.data };
    } catch (error) {
        const message =
            error.response?.data?.detail || "An unexpected error occurred.";
        return { success: false, message };
    }
};
