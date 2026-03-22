import React, { createContext, useContext, useState, useCallback } from 'react';
import { FarmsService, Farm, IrrigationLog } from '../services/farms';
import { Logger } from '../utils/Logger';

interface AppContextType {
    // Farms state
    farms: Farm[];
    farmsLoading: boolean;
    loadFarms: () => Promise<void>;
    getFarm: (id: string) => Promise<Farm | undefined>;
    createFarm: (farm: Omit<Farm, 'id'>) => Promise<Farm | null>;
    updateFarm: (id: string, patch: Partial<Farm>) => Promise<void>;
    deleteFarm: (id: string) => Promise<void>;

    // Irrigation
    irrigationLogs: Record<string, IrrigationLog[]>;
    loadIrrigationLogs: (farmId: string) => Promise<void>;
    addIrrigationLog: (log: IrrigationLog) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [farms, setFarms] = useState<Farm[]>([]);
    const [farmsLoading, setFarmsLoading] = useState(false);
    const [irrigationLogs, setIrrigationLogs] = useState<Record<string, IrrigationLog[]>>({});

    // ---- Farms ----
    const loadFarms = useCallback(async () => {
        setFarmsLoading(true);
        try {
            const list = await FarmsService.list();
            setFarms(list);
        } catch (e) {
            Logger.error('AppContext', 'loadFarms', e);
        } finally {
            setFarmsLoading(false);
        }
    }, []);

    const getFarm = useCallback(async (id: string) => {
        // Check local cache first
        const cached = farms.find(f => f.id === id);
        if (cached) return cached;
        // Otherwise fetch from server
        return FarmsService.get(id);
    }, [farms]);

    const createFarm = useCallback(async (farm: Omit<Farm, 'id'>) => {
        try {
            const created = await FarmsService.create(farm);
            if (created) {
                setFarms(prev => [created, ...prev]);
            }
            return created;
        } catch (e) {
            Logger.error('AppContext', 'createFarm', e);
            return null;
        }
    }, []);

    const updateFarm = useCallback(async (id: string, patch: Partial<Farm>) => {
        try {
            await FarmsService.update(id, patch);
            setFarms(prev => prev.map(f => f.id === id ? { ...f, ...patch } : f));
        } catch (e) {
            Logger.error('AppContext', 'updateFarm', e);
        }
    }, []);

    const deleteFarm = useCallback(async (id: string) => {
        try {
            await FarmsService.remove(id);
            setFarms(prev => prev.filter(f => f.id !== id));
        } catch (e) {
            Logger.error('AppContext', 'deleteFarm', e);
        }
    }, []);

    // ---- Irrigation ----
    const loadIrrigationLogs = useCallback(async (farmId: string) => {
        try {
            const logs = await FarmsService.listIrrigation(farmId);
            setIrrigationLogs(prev => ({ ...prev, [farmId]: logs }));
        } catch (e) {
            Logger.error('AppContext', 'loadIrrigationLogs', e);
        }
    }, []);

    const addIrrigationLog = useCallback(async (log: IrrigationLog) => {
        try {
            await FarmsService.addIrrigation(log);
            // Refresh that farm's logs
            const logs = await FarmsService.listIrrigation(log.farmId);
            setIrrigationLogs(prev => ({ ...prev, [log.farmId]: logs }));
        } catch (e) {
            Logger.error('AppContext', 'addIrrigationLog', e);
        }
    }, []);

    return (
        <AppContext.Provider
            value={{
                farms,
                farmsLoading,
                loadFarms,
                getFarm,
                createFarm,
                updateFarm,
                deleteFarm,
                irrigationLogs,
                loadIrrigationLogs,
                addIrrigationLog,
            }}
        >
            {children}
        </AppContext.Provider>
    );
};

export const useApp = () => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useApp must be used within an AppProvider');
    }
    return context;
};
