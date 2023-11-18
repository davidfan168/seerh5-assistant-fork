import {
    HelperLoader,
    Hook,
    Manager,
    Operator,
    SEAEventBus,
    cureAllPet,
    delay,
    matchNoBloodChain,
    matchSkillName,
    switchBag,
    toggleAutoCure,
} from '../../dist/index.js';
import env from '../env/pet.json';

var expect = chai.expect;

const startBattle = () => {
    FightManager.fightNoMapBoss(6730);
};

describe('BattleManager', function () {
    /** @type {SEAEventBus} */
    let bus;

    before(async () => {
        HelperLoader();
        bus = new SEAEventBus();
        await toggleAutoCure(true);
    });

    it('test preset strategy function', async function () {
        this.timeout('10s');

        const skn = matchSkillName(env.skill.map((v) => v.name));
        const nbc = matchNoBloodChain([env.测试精灵1.name, env.测试精灵3.name]);

        bus.hook(Hook.Battle.battleStart, Manager.resolveStrategy);
        bus.hook(Hook.Battle.roundEnd, Manager.resolveStrategy);

        await Manager.takeover(startBattle, {
            async resolveMove(state, skills, _) {
                const skillId = skn(skills);
                if (state.self.catchtime === env.测试精灵1.catchTime) {
                    expect(skillId).equal(env.skill[0].id);
                }
                if (state.self.catchtime === env.测试精灵3.catchTime) {
                    expect(skillId).equal(env.skill[1].id);
                }
                const r = await Operator.useSkill(skillId);
                expect(r).to.be.true;
                return r;
            },
            async resolveNoBlood(state, _, pets) {
                const next = nbc(pets, state.self.catchtime);
                if (state.self.catchtime === env.测试精灵1.catchTime) {
                    expect(next).equal(2);
                }
                if (state.self.catchtime === env.测试精灵3.catchTime) {
                    expect(next).equal(-1);
                }
                if (next === -1) {
                    return Operator.escape();
                }
                return Operator.switchPet(next);
            },
        });
    });

    it('should exit when current battle ends after executing the operation in NoBlood', async function () {
        this.timeout('10s');
        let noBlood = false;

        const resolve = async () => {
            try {
                await Manager.resolveStrategy();
            } catch (error) {
                expect(error).to.match(/死切/);
                Operator.escape();
            }
        };

        bus.hook(Hook.Battle.battleStart, resolve);
        bus.hook(Hook.Battle.roundEnd, resolve);

        await Manager.takeover(startBattle, {
            async resolveMove() {
                Operator.auto();
                expect(noBlood).to.be.false;
                return true;
            },
            async resolveNoBlood() {
                noBlood = true;
                return Operator.escape();
            },
        });
    });

    beforeEach(async function () {
        const cts = [env.测试精灵1, env.测试精灵2, env.测试精灵3].map((v) => v.catchTime);
        await switchBag(cts);
        cureAllPet();

        await delay(200);
        console.log(`${this.currentTest.title}: start`);
    });

    afterEach(async function () {
        bus.unmount();
        cureAllPet();

        await delay(1000);
        console.log(`${this.currentTest.title}: end`);
    });
});
