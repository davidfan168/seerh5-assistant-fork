import { z } from 'zod';
import { SEASConfigData } from '../utils/SEASConfigData.ts';

export const LauncherConfigKeys = ['PetGroups'] as const;

export const PetGroupsSchema = z.array(z.array(z.number())).length(7);

const defaultConfig = {
    PetGroups: [[], [], [], [], [], [], []] as z.infer<typeof PetGroupsSchema>
} as const;

export type LauncherConfigType = typeof defaultConfig;

class LauncherConfig extends SEASConfigData<LauncherConfigType> {
    async loadWithDefault(configFile: string) {
        return super.loadWithDefault(configFile, defaultConfig);
    }

    async getItem<TKey extends keyof LauncherConfigType>(key: TKey) {
        const data = super.query();
        return data[key];
    }

    async setItem<TKey extends keyof LauncherConfigType>(key: TKey, value: LauncherConfigType[TKey]) {
        await super.mutate((data) => {
            data[key] = value;
        });
    }
}

export const launcherConfig = new LauncherConfig();
