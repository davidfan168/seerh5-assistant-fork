import { MOD_BUILTIN_UPDATE_STRATEGY, MOD_SCOPE_BUILTIN } from '@/constants';
import * as endpoints from '@/service/endpoints';
import { SEAModLogger } from '@/utils/logger';
import type { SEAModExport, SEAModMetadata } from '@sea/mod-type';
import type { ModInstallOptions } from '@sea/server';
import { ModMetadataSchema } from './schema';
import { buildDefaultConfig, buildMetadata } from './utils';

export async function installModFromUrl(url: string, mapUrl?: string) {
    try {
        const modImport: { default: SEAModExport; metadata: SEAModMetadata } = await import(/* @vite-ignore */ url);
        const { metadata: _metadata } = modImport;
        ModMetadataSchema.parse(_metadata);
        const metadata = buildMetadata(_metadata);
        const options: ModInstallOptions = {
            builtin: false,
            preload: metadata.preload,
            config: metadata.configSchema ? buildDefaultConfig(metadata.configSchema) : undefined,
            data: metadata.data,
            update: false
        };

        const modBlob = await fetch(url).then((res) => res.blob());
        const modMapBlob = mapUrl ? await fetch(mapUrl).then((res) => res.blob()) : undefined;

        await endpoints.mod.upload(metadata.scope, metadata.id, modBlob, modMapBlob);

        endpoints.mod.install(metadata.scope, metadata.id, options);
    } catch (err) {
        SEAModLogger.error(`Failed to install mod: ${url}`, err);
    }
}

export async function installBuiltinMods() {
    const builtinExports = await Promise.all([
        import('@/builtin/preload'),
        import('@/builtin/strategy'),
        import('@/builtin/battle'),
        import('@/builtin/realm'),
        import('@/builtin/petFragment'),
        import('@/builtin/command')
    ]);

    await Promise.all(
        builtinExports.map(async (exports) => {
            const metadata = ModMetadataSchema.parse(exports.metadata) as SEAModMetadata;
            const options: ModInstallOptions = {
                builtin: true,
                preload: metadata.preload,
                config: metadata.configSchema ? buildDefaultConfig(metadata.configSchema) : undefined,
                data: metadata.data,
                update: MOD_BUILTIN_UPDATE_STRATEGY === 'always'
            };
            await endpoints.mod.install(MOD_SCOPE_BUILTIN, metadata.id, options);
        })
    );
}
