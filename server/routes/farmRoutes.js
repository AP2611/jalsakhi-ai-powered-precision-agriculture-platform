import express from 'express';
import userAuth from '../middleware/userAuth.js';
import {
    listFarms,
    getFarm,
    createFarm,
    updateFarm,
    deleteFarm,
    addIrrigationLog,
    listIrrigationLogs
} from '../controllers/farmController.js';

const farmRouter = express.Router();

farmRouter.get('/', userAuth, listFarms);
farmRouter.get('/:id', userAuth, getFarm);
farmRouter.post('/', userAuth, createFarm);
farmRouter.put('/:id', userAuth, updateFarm);
farmRouter.delete('/:id', userAuth, deleteFarm);
farmRouter.post('/:id/irrigation', userAuth, addIrrigationLog);
farmRouter.get('/:id/irrigation', userAuth, listIrrigationLogs);

export default farmRouter;
