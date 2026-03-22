import axios from 'axios';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Logger } from './Logger';

// For Android emulator, use 10.0.2.2 to reach host machine's localhost.
// For iOS simulator, localhost works directly.
// For physical devices, use your machine's LAN IP (e.g., 192.168.x.x).
const DEFAULT_API_URL = Platform.OS === 'android' ? 'http://10.0.2.2:3000' : 'http://localhost:3000';
const API_URL = process.env.EXPO_PUBLIC_API_URL || DEFAULT_API_URL;

const api = axios.create({
    baseURL: API_URL,
    timeout: 15000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor — attach JWT token to every request
api.interceptors.request.use(
    async (config) => {
        Logger.debug('API', `🚀 Request: ${config.method?.toUpperCase()} ${config.url}`, config.data);
        try {
            const token = await AsyncStorage.getItem('JALSAKHI_TOKEN');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        } catch (e) {
            Logger.warn('API', 'Could not retrieve token from storage');
        }
        return config;
    },
    (error) => {
        Logger.error('API', 'Request Interceptor Error', error);
        return Promise.reject(error);
    }
);

// Response interceptor — handle 401 globally
api.interceptors.response.use(
    (response) => {
        Logger.debug('API', `✅ Response: ${response.config.method?.toUpperCase()} ${response.config.url} [${response.status}]`, response.data);
        return response;
    },
    async (error) => {
        const status = error.response?.status;
        const url = error.config?.url;
        Logger.error('API', `❌ Error: ${error.config?.method?.toUpperCase()} ${url} [${status || 'NETWORK_ERROR'}]`, error.response?.data || error.message);

        if (status === 401) {
            await AsyncStorage.removeItem('JALSAKHI_TOKEN');
            await AsyncStorage.removeItem('JALSAKHI_USER_ID');
        }
        return Promise.reject(error);
    }
);

export const TOKEN_KEY = 'JALSAKHI_TOKEN';
export const USER_ID_KEY = 'JALSAKHI_USER_ID';

export default api;
