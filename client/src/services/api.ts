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
    return response
  } catch (error) {
    console.error('Error during signup:', error);
    throw error;
  }
};

// ✅ Login API
const loginApiHandler = async (data: any):Promise<AxiosResponse> => {
  try {
     return  await axiosInstance.post('/auth/login', data);
  
  } catch (error) {
    console.error('Error during login:', error);
    throw error;
  }
};

const changePasswordApiHandler = async (data: any, token:string):Promise<AxiosResponse> => {
  try {
    return await axiosInstance.patch('/auth/updatePassword', data ,
      {
        headers: {
          'Authorization': `Bearer ${token}`, // Include token in headers
        },
      }
    );
  } catch (error) {
    console.error('Error during password change:', error);
    throw error;
  }
}
const getAllMyAddressApiHandler = async (searchQuery: string,token:string): Promise<AxiosResponse> => {
  try {
     let url= '/address/all';
     if(searchQuery!=='') {
      url += `?${searchQuery}`;
      }

    const response = await axiosInstance.get(url, {
      headers: {
        'Authorization': `Bearer ${token}`, 
      },
    });
    return response;
  } catch (error) {
    console.error('Error fetching addresses:', error);
    throw error;
  }
}

const addNewAddressApiHandler = async (data: any, token:string): Promise<AxiosResponse> => {
  try {
    return await axiosInstance.post('/address/addNew', data, {
      headers: {
        'Authorization': `Bearer ${token}`, // Include token in headers
      },
    });
  } catch (error) {
    console.error('Error adding new address:', error);
    throw error;
  }
}

const updateAddressApiHandler = async (data: any, token:string,addressId:string): Promise<AxiosResponse> => {
  try {
    return await axiosInstance.put(`/address/update/${addressId}`, data, {
      headers: {
        'Authorization': `Bearer ${token}`, // Include token in headers
      },
    });
  } catch (error) {
    console.error('Error updating address:', error);
    throw error;
  }
}
const deleteAddressApiHandler = async (addressId: string, token:string): Promise<AxiosResponse> => {
  try {
    return await axiosInstance.delete(`/address/delete/${addressId}`, {
      headers: {
        'Authorization': `Bearer ${token}`, // Include token in headers
      },    
    });
  } catch (error) { 
    console.error('Error deleting address:', error);
    throw error;
  }
}

export {
  signupApiHandler,
  loginApiHandler,
  getAxiosErrorMessage,
  changePasswordApiHandler,
  getAllMyAddressApiHandler,
  addNewAddressApiHandler,
  updateAddressApiHandler,
  deleteAddressApiHandler
};
