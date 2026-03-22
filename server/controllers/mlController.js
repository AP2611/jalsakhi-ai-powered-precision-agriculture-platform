import axios from 'axios';

/**
 * AI/ML Controller
 * This controller acts as a robust proxy between the mobile client and the specialized AI services (Python/FastAPI).
 * It includes production-grade error handling, timeouts, and validation.
 */

// Placeholder for Logger if not defined elsewhere.
// In a real application, this would be imported from a logging utility.
const Logger = {
    info: (...args) => console.log('INFO:', ...args),
    error: (...args) => console.error('ERROR:', ...args),
};

/**
 * Model 1 (Internal) - Experimental
 */
export const predictModel1 = async (req, res) => {
    Logger.info('MLController', 'Predicting Model 1');
    try {
        const response = await mlHttpClient.post('/model1', req.body);
        return res.json({ success: true, data: response.data });
    } catch (error) {
        Logger.error('MLController', 'Model 1 prediction failed', error);
        return res.status(error.response?.status || 500).json({
            success: false,
            message: 'Model 1 service failure',
            error: error.message
        });
    }
};

/**
 * Model 2 (Internal) - Experimental
 */
export const predictModel2 = async (req, res) => {
    Logger.info('MLController', 'Predicting Model 2');
    try {
        const response = await mlHttpClient.post('/model2', req.body);
        return res.json({ success: true, data: response.data });
    } catch (error) {
        Logger.error('MLController', 'Model 2 prediction failed', error);
        return res.status(error.response?.status || 500).json({
            success: false,
            message: 'Model 2 service failure',
            error: error.message
        });
    }
};

// Configure an axios instance for the ML Gateway
const mlHttpClient = axios.create({
    baseURL: process.env.ML_GATEWAY_URL || 'http://localhost:5000',
    timeout: 30000, // 30 seconds timeout for AI processing
});

/**
 * Generic proxy function with error handling
 */
const proxyRequest = async (res, endpoint, data, apiKeyHeader = 'x-internal-key') => {
    try {
        const config = {};
        if (process.env.ML_API_KEY) {
            config.headers = { [apiKeyHeader]: process.env.ML_API_KEY };
        }

        const response = await mlHttpClient.post(endpoint, data, config);
        return res.json({ success: true, data: response.data });
    } catch (error) {
        console.error(`AI Proxy Error [${endpoint}]:`, error.message);

        let status = 502; // Bad Gateway by default
        let message = 'AI Service is temporarily unavailable. Please try again later.';

        if (error.code === 'ECONNABORTED') {
            status = 504; // Gateway Timeout
            message = 'AI Service took too long to respond. Please try again.';
        } else if (error.response) {
            // The service responded with an error
            status = error.response.status;
            message = error.response.data?.detail || error.response.data?.message || message;
        } else if (error.code === 'ECONNREFUSED' || error.request) {
            // Service is completely down
            status = 503; // Service Unavailable
        }

        return res.status(status).json({
            success: false,
            message,
            debug: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

/**
 * Multi-lingual Chatbot Service
 * Proxies to /chatbot/chat
 */
export const chat = async (req, res) => {
    const { message, language } = req.body;
    if (!message) {
        return res.status(400).json({ success: false, message: 'Message is required' });
    }
    // Note: Proxies to the unified gateway's /chatbot mount
    return proxyRequest(res, '/chatbot/chat', { message, language: language || 'English' });
};

/**
 * Crop Water Requirement Model
 */
export const predictCropWater = async (req, res) => {
    // Expected fields: crop_type, soil_type, region, temperature, weather_condition
    if (!req.body.crop_type) {
        return res.status(400).json({ success: false, message: 'crop_type is required' });
    }
    return proxyRequest(res, '/crop-water/predict', req.body);
};

/**
 * Soil Moisture Forecast Model
 */
export const predictSoilMoisture = async (req, res) => {
    // Supports both 'sensor' and 'location' paths depending on payload
    const endpoint = req.body.sm_history ? '/soil-moisture/predict/location' : '/soil-moisture/predict/sensor';
    return proxyRequest(res, endpoint, req.body);
};

/**
 * Village Water Allocation Model
 */
export const optimizeWaterAllocation = async (req, res) => {
    if (!req.body.total_available_water_liters || !req.body.farms) {
        return res.status(400).json({ success: false, message: 'Missing allocation parameters' });
    }
    return proxyRequest(res, '/village-water/optimize', req.body);
};
