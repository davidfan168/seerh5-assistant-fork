import type { PetFragmentOptionRaw } from '@/views/Automation/PetFragmentLevel';
import type { DataObject } from '@sea/mod-type';
import type { ApiRouter, ModInstallOptions } from '@sea/server';
import { createTRPCClient, createWSClient, wsLink } from '@trpc/client';
import superjson from 'superjson';

const wsClient = createWSClient({
    url: `ws://localhost:${import.meta.env.VITE_BACKEND_PORT}/api`
});

const trpcClient = createTRPCClient<ApiRouter>({
    links: [wsLink({ client: wsClient, transformer: superjson })]
});

const { modRouter, configRouter } = trpcClient;

export const mod = {
    fetchList: async () => modRouter.modList.query(),
    data: async (scope: string, id: string) => modRouter.data.query({ scope, id }),
    setData: async (scope: string, id: string, data: DataObject) => modRouter.saveData.mutate({ scope, id, data }),
    config: async (scope: string, id: string) => modRouter.config.query({ scope, id }),
    setConfig: async (scope: string, id: string, data: DataObject) => modRouter.setConfig.mutate({ scope, id, data }),
    install: async (scope: string, id: string, options: ModInstallOptions) => {
        return modRouter.install.mutate({ scope, id, options });
    },
    upload: async (scope: string, id: string, modBlob: Blob, modMapBlob?: Blob) => {}
};

export type ConfigKey = 'PetGroups';
export const getConfig = async (key: ConfigKey) => {
    return configRouter.launcherConfig.query(key) as Promise<unknown>;
};

export const setConfig = async (key: ConfigKey, value: unknown) => {
    return configRouter.setLauncherConfig.mutate({ key, value });
};

export async function queryCatchTime(name: string): Promise<[string, number]>;
export async function queryCatchTime(): Promise<Map<string, number>>;
export async function queryCatchTime(name?: string) {
    return configRouter.allCatchTime.query(name);
}

export const updateAllCatchTime = async (data: Map<string, number>) => {
    return configRouter.updateAllCatchTime.mutate(data);
};

export const deleteCatchTime = async (name: string) => {
    return configRouter.deleteCatchTime.mutate(name);
};

export const addCatchTime = async (name: string, time: number) => {
    return configRouter.setCatchTime.mutate([name, time]);
};

export const getPetFragmentConfig = async () => {
    return configRouter.petFragmentLevel.query() as Promise<PetFragmentOptionRaw[]>;
};
