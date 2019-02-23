/**
 * 创建群聊
 */

// ================================================ 导入
import { popNew } from '../../../../../pi/ui/root';
import { Forelet } from '../../../../../pi/widget/forelet';
import { Widget } from '../../../../../pi/widget/widget';
import { GroupInfo } from '../../../../server/data/db/group.s';
import { Contact } from '../../../../server/data/db/user.s';
import { Result } from '../../../../server/data/rpc/basic.s';
import { createGroup, inviteUsers } from '../../../../server/data/rpc/group.p';
import { GroupCreate, Invite, InviteArray } from '../../../../server/data/rpc/group.s';
import { Logger } from '../../../../utils/logger';
import { delValueFromArray } from '../../../../utils/util';
import * as store from '../../data/store';
import { bottomNotice } from '../../logic/logic';
import { selectImage } from '../../logic/native';
import { clientRpcFunc } from '../../net/init';
import { createGroup as createNPGroup } from '../../net/rpc';
import { arrayBuffer2File, imgResize, uploadFile } from '../../net/upload';

// ================================================ 导出
// tslint:disable-next-line:no-reserved-keywords
declare var module;
const WIDGET_NAME = module.id.replace(/\//g, '-');
const logger = new Logger(WIDGET_NAME);
export const forelet = new Forelet();

export class SetGroupChat extends Widget {
    public props:Props;
    public ok:() => void;
    constructor() {
        super();
        this.props = {
            name:'',
            inviteMembers:[],
            inviteUserName:[],
            isSelect:false,
            avatarHtml:''
        };
        this.state = new Map();
    }
    public create() {
        super.create();
        const sid = store.getStore('uid').toString();
        this.state = store.getStore('contactMap',new Contact()).get(sid);
    }
    
    // 返回上一页
    public back() {
        this.ok();
    }

    /**
     * 选择群头像
     */
    public selectImageClick() {
        const imagePicker = selectImage((width, height, url) => {
            console.log('selectImage url = ',url);
            // tslint:disable-next-line:max-line-length
            this.props.avatarHtml = `<div style="background-image: url(${url});width: 120px;height: 120px;background-size: cover;background-position: center;background-repeat: no-repeat;border-radius:50%"></div>`;
            this.paint();

            const loading = popNew('app-components1-loading-loading', { text:'图片上传中' });
            imagePicker.getContent({
                success(buffer:ArrayBuffer) {
                    imgResize(buffer,(res) => {
                        uploadFile(arrayBuffer2File(res.ab),(url) => {
                            bottomNotice('图片上传成功');
                            avatarUrl = url;
                            loading.callback(loading.widget);
                        });
                    });
                }
            });
        });
    }

    // 点击完成
    public completeClick() {
        if (!this.props.name) {
            bottomNotice('群名不能为空');

            return;          
        } 
        if (this.props.inviteMembers.length === 0) {
            bottomNotice('请至少选择一位好友');

            return;
        }
       
        const groupInfo = new GroupCreate();
        groupInfo.name = this.props.name;
        groupInfo.note = '';
        groupInfo.avatar = avatarUrl;
        groupInfo.need_agree = true; // 入群需要同意
        clientRpcFunc(createGroup, groupInfo, (r: GroupInfo) => {
            if (r.gid === -1) {
                bottomNotice(`创建群组失败`);

                return;
            }
            store.setStore(`groupInfoMap/${r.gid}`, r);

            // 邀请好友进群
            if (this.props.inviteMembers.length > 0) {
                const invites = new InviteArray();
                invites.arr = [];
                this.props.inviteMembers.forEach((id) => {
                    const invite = new Invite();
                    invite.gid = r.gid;
                    invite.rid = id;
                    invites.arr.push(invite);
                });

                clientRpcFunc(inviteUsers, invites, (r: Result) => {
                    if (r.r !== 1) {
                        bottomNotice(`邀请好友入群失败`);
                    }
                });
            }
        });
        this.ok();
    }

    /**
     * 创建入群无需同意的群组
     * 暂留接口
     */
    public createNPG() {
        if (this.props.name) {
            createNPGroup(this.props.name,'','',false);
        } else {
            bottomNotice('请输入群名');
        }
    }

    public inputName(e:any) {
        this.props.name = e.value;
        this.props.isSelect = e.value !== '' && this.props.inviteMembers.length > 0;
        this.paint();
    }

    public addMember(e:any) {
        const uid = e.value;
        logger.debug('=========创建群聊',uid);
        if (this.props.inviteMembers.findIndex(item => item === uid) === -1) {
            this.props.inviteMembers.push(uid);
            this.props.inviteUserName.push(e.name);
        } else {
            this.props.inviteMembers = delValueFromArray(uid, this.props.inviteMembers);
            this.props.inviteUserName = delValueFromArray(e.name, this.props.inviteUserName);
        }
        logger.debug(`inviteMembers is : ${JSON.stringify(this.props.inviteMembers)}`);
        this.props.name = this.props.inviteUserName.slice(0,3).join('，');
        this.props.isSelect = e.value !== '' && this.props.inviteMembers.length > 0;
        this.paint();
    }
}

// ================================================ 本地
interface Props {
    name:string;// 群组名
    inviteMembers:number[];// 被邀请的成员uid
    inviteUserName:string[];// 被邀请的成员名字
    isSelect:boolean;// 是否被选择
    avatarHtml:string; // 群头像展示
}
let avatarUrl;  // 群头像链接
store.register('contactMap', (r: Map<number, Contact>) => {
    // 这是一个特别的map，map里一定只有一个元素,只是为了和后端保持统一，才定义为map
    for (const value of r.values()) {
        forelet.paint(value);
    }    
});