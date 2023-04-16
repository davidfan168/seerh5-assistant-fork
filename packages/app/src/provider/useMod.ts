import { register as ModRegister } from 'seerh5-assistant-core';

export const useMod = async () => {
    let mods = await Promise.all([
        import('../mods/official/LocalPetSkin'),
        import('../mods/official/CraftSkillStone'),
        import('../mods/official/applybm'),
        import('../mods/official/sign'),
        import('../mods/module/petbag'),
        import('../mods/module/team'),
        import('../mods/official/aedk3'),
    ]);

    for (let mod of mods) {
        const modObj = mod.default;
        ModRegister(modObj);
    }
    for (let [id, mod] of sac.Mods) {
        mod.init();
    }
};
