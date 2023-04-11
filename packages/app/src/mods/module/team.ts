import { Mod, ModuleSubscriber, SAEngine, SAEventHandler } from 'seerh5-assistant-core';

class TeamTechCenter extends Mod {
    subscriber: ModuleSubscriber<team.TeamTech> = {
        load() {
            team.TeamTech.prototype.onClickEnhance = async function () {
                const index = this.list_attr.selectedIndex;
                if (null == this._petInfo) {
                    Alarm.show('先选择你要进行强化的精灵哦！');
                    return;
                }
                if (this.getMax(index) <= this._petInfo.getTeamTechAdd(index)[0]) {
                    BubblerManager.getInstance().showText('已完成该项属性值的战队加成！');
                    return;
                }
                if (this.getNeedCost(index) > this._costNum) {
                    BubblerManager.getInstance().showText('你的战队贡献值不足！');
                    return;
                }

                const updateOnce = (): Promise<void> =>
                    SAEngine.Socket.sendByQueue(CommandID.NEW_TEAM_PET_RISE, [this._petInfo.catchTime, index])
                        .then(() => PetManager.UpdateBagPetInfoAsynce(this._petInfo.catchTime))
                        .then((petInfo) => {
                            this._petInfo = petInfo;
                            this.updateData();
                            this.showPetDetail();
                            this.onTouchAttr();
                            if (this.getMax(index) > this._petInfo.getTeamTechAdd(index)[0]) {
                                return updateOnce();
                            } else {
                                BubblerManager.getInstance().showText('一键强化成功！');
                                return;
                            }
                        });
                await updateOnce();
            };
        },
    };
    init() {
        SAEventHandler.SeerModuleStatePublisher.attach(this.subscriber, 'team');
    }
    destroy() {
        SAEventHandler.SeerModuleStatePublisher.detach(this.subscriber, 'team');
    }
    meta = { description: '战队模块', id: 'team' };
}

export default TeamTechCenter;
