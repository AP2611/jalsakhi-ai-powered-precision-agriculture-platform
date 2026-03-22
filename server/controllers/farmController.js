import farmModel from '../models/farmModel.js';

// Helper to get userId from either req.userId or req.body.userId
const getUserId = (req) => req.userId || req.body?.userId;

// List all farms for the authenticated user
export const listFarms = async (req, res) => {
    try {
        const userId = getUserId(req);
        const farms = await farmModel.find({ userId }).sort({ createdAt: -1 });
        res.json({ success: true, farms });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get a single farm by ID
export const getFarm = async (req, res) => {
    try {
        const userId = getUserId(req);
        const farm = await farmModel.findOne({ _id: req.params.id, userId });
        if (!farm) {
            return res.json({ success: false, message: 'Farm not found' });
        }
        res.json({ success: true, farm });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Create a new farm
export const createFarm = async (req, res) => {
    try {
        const userId = getUserId(req);
        const { name, crop, size, status, image } = req.body;
        const farm = new farmModel({ userId, name, crop, size, status, image });
        await farm.save();
        res.json({ success: true, message: 'Farm created', farm });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update a farm
export const updateFarm = async (req, res) => {
    try {
        const userId = getUserId(req);
        const { name, crop, size, status, image } = req.body;
        const farm = await farmModel.findOneAndUpdate(
            { _id: req.params.id, userId },
            { name, crop, size, status, image },
            { new: true }
        );
        if (!farm) {
            return res.json({ success: false, message: 'Farm not found' });
        }
        res.json({ success: true, message: 'Farm updated', farm });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Delete a farm
export const deleteFarm = async (req, res) => {
    try {
        const userId = getUserId(req);
        const farm = await farmModel.findOneAndDelete({ _id: req.params.id, userId });
        if (!farm) {
            return res.json({ success: false, message: 'Farm not found' });
        }
        res.json({ success: true, message: 'Farm deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Add an irrigation log to a farm
export const addIrrigationLog = async (req, res) => {
    try {
        const userId = getUserId(req);
        const { date, amount, duration, notes } = req.body;
        const farm = await farmModel.findOne({ _id: req.params.id, userId });
        if (!farm) {
            return res.json({ success: false, message: 'Farm not found' });
        }
        farm.irrigationLogs.push({ date, amount, duration, notes });
        await farm.save();
        res.json({ success: true, message: 'Irrigation log added', farm });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// List irrigation logs for a farm
export const listIrrigationLogs = async (req, res) => {
    try {
        const userId = getUserId(req);
        const farm = await farmModel.findOne({ _id: req.params.id, userId });
        if (!farm) {
            return res.json({ success: false, message: 'Farm not found' });
        }
        res.json({ success: true, logs: farm.irrigationLogs });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
