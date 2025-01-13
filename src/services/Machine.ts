import axios from 'axios';
import {API_URL} from '../services/config';

export const getMachineByQRCode = async (qrCodeId: string) => {
  try {
    console.log(`${API_URL}\n${qrCodeId}`)
    const response = await axios.get(`${API_URL}/machine/getMachineDetailController?qrCodeId=${qrCodeId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};