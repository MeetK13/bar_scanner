import axios from 'axios';
import api from './api';

export const getRawMaterialByBarcode = async (barcodeId: string) => {
  try {
    console.log(
      'Making API call to:',
      `${api.defaults.baseURL}/ScannedMaterial/getRawMaterialDetailsByBarcode?barcodeId=${barcodeId}`,
    );

    const response = await api.get(
      `/ScannedMaterial/getRawMaterialDetailsByBarcode?barcodeId=${barcodeId}`,
    );
    console.log('API Response:', response.data);
    return response.data;
  } catch (error) {
    console.log('API Error full details:', error);
    if (axios.isAxiosError(error)) {
      console.log('Request URL:', error.config?.url);
      console.log('Response Status:', error.response?.status);
      console.log('Response Data:', error.response?.data);
      throw {
        message:
          error.response?.data?.message ||
          'Failed to fetch raw material details',
        status: error.response?.status,
      };
    }
    throw error;
  }
};
