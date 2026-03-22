import express from 'express';
import * as mlController from '../controllers/mlController.js';
import userAuth from '../middleware/userAuth.js';

const mlRouter = express.Router();

/**
 * AI/ML Service Routes
 * All routes are protected by user authentication middleware
 */

// Multi-lingual Chatbot
mlRouter.post('/chat', userAuth, mlController.chat);

// Crop Water Requirement Prediction
mlRouter.post('/crop-water', userAuth, mlController.predictCropWater);

// Soil Moisture Forecast
mlRouter.post('/soil-moisture', userAuth, mlController.predictSoilMoisture);

// Village Water Allocation Optimization (Admin usually, but open for experimentation during dev)
mlRouter.post('/village-water', userAuth, mlController.optimizeWaterAllocation);

// Experimental/Internal Models
mlRouter.post('/model1', userAuth, mlController.predictModel1);
mlRouter.post('/model2', userAuth, mlController.predictModel2);

export default mlRouter;
