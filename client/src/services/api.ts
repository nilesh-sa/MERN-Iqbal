/// <reference types="vite/client" />
import axios, { AxiosResponse } from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json', // Default for JSON requests
  },
});
const getAxiosErrorMessage = (error: any): string => {
  if (axios.isAxiosError(error)) {
    // Handle Axios-specific errors
    if (error.response) {
      // The request was made and the server responded with a status code
      return error.response.data?.error || error.response.data.message || 'An error occurred';
    } else if (error.request) {
      // The request was made but no response was received
      return 'No response received from the server';
    } else {
      // Something happened in setting up the request that triggered an Error
      return error.message;
    }
  }
  // Handle non-Axios errors
  return 'An unexpected error occurred';  
}
// 🟡 Register API: Accepts FormData (with profilePicture)
const signupApiHandler = async (data: FormData):Promise<AxiosResponse> => {
  try {
    const response = await axiosInstance.post('/auth/register', data, {
      headers: {
        'Content-Type': 'multipart/form-data', // Must override for FormData
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error during signup:', error);
    throw error;
  }
};

// ✅ Login API
const loginApiHandler = async (data: any):Promise<AxiosResponse> => {
  try {
    const response = await axiosInstance.post('/auth/login', data);
    return response.data;
  } catch (error) {
    console.error('Error during login:', error);
    throw error;
  }
};

export {
  signupApiHandler,
  loginApiHandler,
  getAxiosErrorMessage
};
