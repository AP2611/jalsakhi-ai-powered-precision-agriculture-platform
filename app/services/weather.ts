import * as Location from 'expo-location';
import { Alert } from 'react-native';
import { Logger } from '../utils/Logger';

// REPLACE WITH YOUR OPENWEATHERMAP API KEY
const API_KEY = '22dd9d513f3a42b418bc2da4119d777e'; // Demo key, might be rate limited

export interface WeatherData {
    temp: number;
    condition: string;
    city: string;
    icon: string;
}

export const WeatherService = {
    /**
     * Request permission and get current location coordinates
     */
    getLocation: async (): Promise<{ lat: number; lon: number } | null> => {
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission Denied', 'Allow location access to get local weather.');
                return null;
            }

            const location = await Location.getCurrentPositionAsync({});
            return {
                lat: location.coords.latitude,
                lon: location.coords.longitude
            };
        } catch (error) {
            Logger.error('WeatherService', 'Error getting location', error);
            return null;
        }
    },

    /**
     * Fetch current weather from OpenWeatherMap
     */
    getCurrentWeather: async (lat: number, lon: number): Promise<WeatherData | null> => {
        try {
            const response = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
            );
            const data = await response.json();

            if (data.cod !== 200) {
                throw new Error(data.message);
            }

            return {
                temp: Math.round(data.main.temp),
                condition: data.weather[0].main,
                city: data.name,
                icon: data.weather[0].icon,
            };
        } catch (error) {
            Logger.error('WeatherService', 'Error fetching weather', error);
            return null;
        }
    }
};
