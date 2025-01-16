import axios, { AxiosResponse } from 'axios';
import { url } from './Url';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {jwtDecode} from 'jwt-decode';

// Server URL configuration
const serverUrl: string = `${url}/user`;

// Interface for login form data
interface LoginFormData {
  email: string;
  password: string;
}

// Interface for decoded JWT token
interface DecodedToken {
  userId: string;
  email: string;
  exp: number;
  
}


export const login = async (formData: LoginFormData): Promise<AxiosResponse> => {

    console.log("inside login api call");
  return await axios.post(`${serverUrl}/loginFromApp`, formData);
};


export const setToken = async (Token: string): Promise<void> => {
  console.log(Token, "token");
    return await AsyncStorage.setItem('Token', Token);
};


export const removeToken = async (): Promise<void> => {
  return await AsyncStorage.removeItem('Token');
};


export const getToken = async (): Promise<string | null> => {
  return await AsyncStorage.getItem('Token');
};


export const getDecodedToken = async (): Promise<DecodedToken> => {
  const token = await AsyncStorage.getItem('Token');
  
  if (!token) {
    throw new Error('No token found');
  }
  
  return jwtDecode<DecodedToken>(token);
};