import api from '../utils/api';
import { Logger } from '../utils/Logger';

export interface CropPredictionInput {
    crop_type: string;
    soil_type: 'DRY' | 'HUMID' | 'WET' | string; // Model expects moisture state
    area_acre: number;
    temperature?: '10-20' | '20-30' | '30-40' | '40-50' | string;
    weather_condition?: 'NORMAL' | 'RAINY' | 'SUNNY' | 'WINDY' | string;
    region?: string;
}

export interface SoilMoistureInput {
    sensorValue?: number;
    // Sensor fields
    avg_pm1?: number;
    avg_pm2?: number;
    avg_pm3?: number;
    avg_am?: number;
    avg_lum?: number;
    avg_temp?: number;
    avg_humd?: number;
    avg_pres?: number;
    // Location fields
    state?: string;
    district?: string;
    month?: number;
    sm_history?: number[];
}

export const MLService = {
    /**
     * Calls the Random Forest Regressor via Azure Proxy
     */
    predictWaterRequirement: async (input: CropPredictionInput): Promise<any> => {
        Logger.info('MLService', `Predicting water for ${input.crop_type}`);

        try {
            const response = await api.post('/api/ai/crop-water', input);
            // Return the full data object from the AI response
            return response.data?.data || null;
        } catch (error: any) {
            Logger.error('MLService', 'Crop water prediction failed', error);
            throw error;
        }
    },

    /**
     * Calls the Time-Series Forecaster via Azure Proxy
     */
    forecastSoilMoisture: async (input: SoilMoistureInput): Promise<any> => {
        Logger.info('MLService', `Forecasting soil moisture`);

        try {
            let payload: any = input;

            // Map single sensorValue to expected full sensor object if provided
            if (input.sensorValue !== undefined) {
                payload = {
                    avg_pm1: 10, avg_pm2: 20, avg_pm3: 15,
                    avg_am: input.sensorValue / 100, // Normalized
                    avg_lum: 200, avg_temp: 28, avg_humd: 65, avg_pres: 101325
                };
            }

            const response = await api.post('/api/ai/soil-moisture', payload);
            return response.data?.data || null;
        } catch (error: any) {
            Logger.error('MLService', 'Soil moisture forecast failed', error);
            throw error;
        }
    },

    /**
     * Calls the Water Allocation Optimizer via Azure Proxy
     */
    optimizeAllocation: async (availableWater: number, farms: any[]): Promise<any> => {
        Logger.info('MLService', `Optimizing allocation for ${farms.length} farms`);
        try {
            const payload = {
                total_available_water_liters: availableWater,
                farms: farms.map(f => ({
                    farm_id: f.id || f.farm_id || `farm_${Math.random().toString(36).substr(2, 4)}`,
                    area_ha: f.area_acre ? f.area_acre * 0.404686 : f.area_ha || 1.0,
                    crop_type: f.crop_type || 'RICE',
                    soil_type: f.soil_type || 'DRY',
                    region: f.region || 'DESERT',
                    temperature: f.temperature || '25-35',
                    weather_condition: f.weather_condition || 'NORMAL',
                    priority_score: f.priority_score || 1
                }))
            };
            const response = await api.post('/api/ai/village-water', payload);
            return response.data?.data || null;
        } catch (error: any) {
            Logger.error('MLService', 'Allocation optimization failed', error);
            throw error;
        }
    },

    predictModel1: async (data: any): Promise<any> => {
        Logger.info('MLService', 'Calling Model 1');
        const response = await api.post('/api/ai/model1', data);
        return response.data?.data;
    },

    predictModel2: async (data: any): Promise<any> => {
        Logger.info('MLService', 'Calling Model 2');
        const response = await api.post('/api/ai/model2', data);
        return response.data?.data;
    }
};
