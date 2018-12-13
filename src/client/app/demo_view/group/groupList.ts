/**
 * 群聊列表
 */

// ================================================ 导入
import { popNew } from '../../../../pi/ui/root';
import { Widget } from '../../../../pi/widget/widget';
import { GroupInfo } from '../../../../server/data/db/group.s';
import { getAnnoucements } from '../../../../server/data/rpc/basic.p';
import { AnnouceIds, AnnounceHistoryArray } from '../../../../server/data/rpc/basic.s';
import { applyJoinGroup } from '../../../../server/data/rpc/group.p';
import { Logger } from '../../../../utils/logger';
import * as store from '../../data/store';
import { clientRpcFunc } from '../../net/init';
import * as subscribedb from '../../net/subscribedb';

// ================================================ 导出
// tslint:disable-next-line:no-reserved-keywords
declare var module;
const WIDGET_NAME = module.id.replace(/\//g, '-');
const logger = new Logger(WIDGET_NAME);

export class GroupListt extends Widget {
    public ok:() => void;
    public props:Props = {
        inputGid:null,
        groups:[]
    };
    public goBack() {
        this.ok();
    }
    public setProps(props:Props) {
        super.setProps(props);
        this.props.groups = props.groups;
    }
    // 点击查看群的详细信息
    public showInfo(gid:number) {
        popNew('client-app-demo_view-group-groupInfo', { gid:gid });
        // 监听群组表的变化
        subscribedb.subscribeGroupInfo(gid,(r:GroupInfo) => {
            logger.debug('after ===================',r);
        },(r:GroupInfo) => {
            logger.debug('before ===================',r);
            updateAnnounce(r,gid);
        });
    }
    // 输入要添加群聊的Gid
    public inputGid(e:any) {
        this.props.inputGid = parseInt(e.value,10);
    }
    // 主动添加群聊
    public applyGroup() {
        clientRpcFunc(applyJoinGroup, this.props.inputGid, ((r) => {
            logger.debug('===========主动添加群聊返回',r);
        }));
    }
    
}

// ================================================ 本地
interface Props {
    inputGid:number; // 用户输入的要添加的群组id
    groups:number[]; // 群组列表
}

/**
 * 更新群组公告相关信息
 * @param r 群组信息
 * @param gid 当前群组id
 */
const updateAnnounce = (r:GroupInfo,gid:number) => {
    const oldAnnounce = store.getStore(`groupInfoMap/${gid}`, new GroupInfo()).annoceids;
    logger.debug('oldAnnounce===========',oldAnnounce);
    const addAnnounce = r.annoceids.filter(aid => {
        return oldAnnounce.findIndex(item => item === aid) === -1;
    });
    logger.debug('addAnnounce===========',addAnnounce);
    if (addAnnounce.length === 0) {
        addAnnounce.push(oldAnnounce[oldAnnounce.length - 1]);
    }
    const aids = new AnnouceIds();
    aids.arr = addAnnounce;
    clientRpcFunc(getAnnoucements,aids,(r:AnnounceHistoryArray) => {
        logger.debug('===============success',r);
        if (r && r.arr) {
            r.arr.forEach(item => {
                store.setStore(`announceHistoryMap/${item.aIncId}`,item);  
            });
        }
    });
};