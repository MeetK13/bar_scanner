import axios from 'axios';
import api from './api';
import { API_URL } from './config';

interface RawMaterial {
  _id: string;
  name: string;
  // Add other properties if they exist
}

interface TransformedMaterial {
  label: string;
  value: string;
}

interface ApiResponse {
  data: TransformedMaterial[];
  message?: string;
  status?: number;
}

export const QRRawMaterial = async (): Promise<ApiResponse> => {
  try {
    console.log('Making API call to:', `${API_URL}/rawMaterial`);

    const response = await api.get(`${API_URL}/rawMaterial`);
    console.log('API Response:', response.data);
    
    // Check if the response.data.data exists and is an array
    if (!Array.isArray(response.data.data)) {
      console.error('Error: "data" is not an array:', response.data);
      throw new Error('Invalid data format received from API');
    }

    // Transform the data to match the required format for the dropdown
    const transformedData = {
      data: response.data.data.map((material: RawMaterial) => ({
        label: material.name,
        value: material._id,
      })),
      message: response.data.message,
      status: response.data.status
    };
    
    return transformedData;
  } catch (error) {
    console.log('API Error full details:', error);
    if (axios.isAxiosError(error)) {
      console.log('Request URL:', error.config?.url);
      console.log('Response Status:', error.response?.status);
      console.log('Response Data:', error.response?.data);
      throw {
        message: error.response?.data?.message || 'Failed to fetch raw materials',
        status: error.response?.status,
      };
    }
    throw error;
  }
};