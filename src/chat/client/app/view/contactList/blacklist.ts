import { uploadFileUrlPrefix } from '../../../../../app/publicLib/config';
import { popNewMessage } from '../../../../../app/utils/tools';
import { Widget } from '../../../../../pi/widget/widget';
import { removeFromBlackList } from '../../../../server/data/rpc/user.p';
import * as store from '../../data/store';
import { clientRpcFunc } from '../../net/init';

interface Props {
    name:string;// 标题
    blackList:any;// 黑名单
    urlPath:string;// 图片路径
}

/**
 * 黑名单管理
 */
export class BlackList extends Widget {
    public props:Props = {
        name:'',
        blackList:[],
        urlPath:uploadFileUrlPrefix
    };

    public ok:() => void;

    public setProps(props:any) {
        this.props = {
            ...this.props,
            ...props
        };
        super.setProps(this.props);
        this.initData();
    }

    // 初始化数据
    public initData() {
        const data =  store.getStore('contactMap',[]);
        const uid = store.getStore('uid');
        const blackList = data.size ? data.get(`${uid}`).blackList :[];
        const friends = store.getStore('userInfoMap',[]);
        friends.forEach(v => {
            if (blackList.indexOf(v.uid) !== -1) {
                const avatar = v.avatar ? this.props.urlPath + v.avatar :'../../res/images/user_avatar.png';
                const note = v.note ? v.note :'没有简介';
                this.props.blackList.push({ text:v.name,uid:v.uid,img:avatar,msg:note,sex:v.gender });
            }
        });
    }

    // 返回
    public goBack() {
        this.ok && this.ok();
    }

    // 移除黑名单
    public remove(index:number) {
        const uid = this.props.blackList[index].uid;
        clientRpcFunc(removeFromBlackList, uid, (r) => {
            if (r && r.r === 1) {
                popNewMessage('移出黑名单');
                this.props.blackList.splice(index,1);
                this.paint();
            }
        });
    }
}