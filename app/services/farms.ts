import api from '../utils/api';
import { Logger } from '../utils/Logger';

export interface Farm {
  id: string;
  name: string;
  crop: string;
  size: string;
  status?: string;
  image?: string;
}

export interface IrrigationLog {
  id?: string;
  farmId: string;
  date: string;
  amount: number;
  duration?: string;
  notes?: string;
}

export const FarmsService = {
  /**
   * List all farms for the authenticated user.
   */
  async list(): Promise<Farm[]> {
    try {
      const response = await api.get('/api/farms');
      if (response.data.success) {
        Logger.info('FarmsService', `Successfully fetched ${response.data.farms.length} farms`);
        return response.data.farms.map((f: any) => ({
          id: f._id,
          name: f.name,
          crop: f.crop,
          size: f.size,
          status: f.status,
          image: f.image,
        }));
      }
      Logger.warn('FarmsService', 'Failed to fetch farms');
      return [];
    } catch (e) {
      Logger.error('FarmsService', 'list', e);
      return [];
    }
  },

  /**
   * Get a single farm by ID.
   */
  async get(id: string): Promise<Farm | undefined> {
    try {
      const response = await api.get(`/api/farms/${id}`);
      if (response.data.success) {
        Logger.info('FarmsService', `Successfully fetched farm: ${id}`);
        const f = response.data.farm;
        return {
          id: f._id,
          name: f.name,
          crop: f.crop,
          size: f.size,
          status: f.status,
          image: f.image,
        };
      }
      Logger.warn('FarmsService', `Farm not found: ${id}`);
      return undefined;
    } catch (e) {
      Logger.error('FarmsService', 'get', e);
      return undefined;
    }
  },

  /**
   * Create a new farm.
   */
  async create(farm: Omit<Farm, 'id'>): Promise<Farm | null> {
    try {
      const response = await api.post('/api/farms', farm);
      if (response.data.success) {
        Logger.info('FarmsService', `Successfully created farm: ${farm.name}`);
        const f = response.data.farm;
        return {
          id: f._id,
          name: f.name,
          crop: f.crop,
          size: f.size,
          status: f.status,
          image: f.image,
        };
      }
      Logger.warn('FarmsService', `Failed to create farm: ${farm.name}`);
      return null;
    } catch (e) {
      Logger.error('FarmsService', 'create', e);
      return null;
    }
  },

  /**
   * Update a farm.
   */
  async update(id: string, patch: Partial<Farm>): Promise<void> {
    try {
      await api.put(`/api/farms/${id}`, patch);
    } catch (e) {
      Logger.error('FarmsService', 'update', e);
    }
  },

  /**
   * Delete a farm.
   */
  async remove(id: string): Promise<void> {
    try {
      await api.delete(`/api/farms/${id}`);
    } catch (e) {
      Logger.error('FarmsService', 'remove', e);
    }
  },

  /**
   * List irrigation logs for a farm.
   */
  async listIrrigation(farmId: string): Promise<IrrigationLog[]> {
    try {
      const response = await api.get(`/api/farms/${farmId}/irrigation`);
      if (response.data.success) {
        return response.data.logs.map((l: any) => ({
          id: l._id,
          farmId,
          date: l.date,
          amount: l.amount,
          duration: l.duration,
          notes: l.notes,
        }));
      }
      return [];
    } catch (e) {
      Logger.error('FarmsService', 'listIrrigation', e);
      return [];
    }
  },

  /**
   * Add an irrigation log to a farm.
   */
  async addIrrigation(log: IrrigationLog): Promise<void> {
    try {
      await api.post(`/api/farms/${log.farmId}/irrigation`, {
        date: log.date,
        amount: log.amount,
        duration: log.duration,
        notes: log.notes,
      });
    } catch (e) {
      Logger.error('FarmsService', 'addIrrigation', e);
    }
  },
};
