import { uploadFile } from '../../../../../app/net/pull';
import { registerStoreData } from '../../../../../app/postMessage/listenerStore';
import { getUserInfo, popNewMessage } from '../../../../../app/utils/pureUtils';
import { imgResize } from '../../../../../app/utils/tools';
import { popNew } from '../../../../../pi/ui/root';
import { Forelet } from '../../../../../pi/widget/forelet';
import { Widget } from '../../../../../pi/widget/widget';
import { CommunityBase } from '../../../../server/data/db/community.s';
import { UserInfo } from '../../../../server/data/db/user.s';
import { CommUserInfo } from '../../../../server/data/rpc/community.s';
import * as store from '../../data/store';
import { buildupImgPath } from '../../logic/logic';
import { selectImage } from '../../logic/native';
import { changePublic, openPublic } from '../../net/rpc';
export const forelet = new Forelet();

interface Props {
    chooseImage:boolean;// 选择图片
    avatar:string;// 头像
    avatarHtml:string;
    publicName:string;// 公众号名字
    contentInput:string;// 秒速
    userProtocolReaded:boolean;
    userInfo:any;
    changePublic:boolean;
    publicInfo:any;// 公众号信息
    pubNum:string;// 公众号ID
}
const STATE = {
    phone:''
};
/**
 * 申请公众号
 */
export class OpenPublic extends Widget {
    public ok:(r?:any) => void;
    public props:Props = {
        chooseImage:false,
        avatar:'',
        avatarHtml:'',
        publicName:'',
        contentInput:'',
        userProtocolReaded:true,
        userInfo:{},
        changePublic:false,
        publicInfo:{},
        pubNum:''

    };
    public setProps(props:any) {
        this.props = {
            ...this.props,
            ...props
        };
        super.setProps(this.props);
        this.state = STATE;
        this.init();
    }

    public init() {
        let publicInfo = null;
        // 申请
        if (this.props.pubNum) {
            const pub =  store.getStore('communityInfoMap',[]);
            publicInfo = pub.size ? pub.get(this.props.pubNum).comm_info :{};
        } 
        this.props.publicInfo = publicInfo;
        const userInfo = this.props.userInfo;
        this.props.avatar = publicInfo ? buildupImgPath(publicInfo.avatar) :'';
        this.props.contentInput = publicInfo ? publicInfo.desc :'';
        this.props.publicName = publicInfo ? publicInfo.name :'';
        if (userInfo.tel) {
            const str = String(userInfo.tel).substr(3, 6);
            this.state.phone = userInfo.tel.replace(str, '******');
        }
    }
    // 上传头像
    public uploadAvatar() {
        const imagePicker = selectImage((width, height, url) => {
            console.log('selectImage url = ',url);
            // tslint:disable-next-line:max-line-length
            this.props.avatarHtml = `<div style="background-image: url(${url});width: 120px;height: 120px;background-size: cover;background-position: center;background-repeat: no-repeat;border-radius:50%"></div>`;
            this.props.chooseImage = true;
            this.props.avatar = url;
            this.paint();
            imagePicker.getContent({
                quality:70,
                success(buffer:ArrayBuffer) {
                    imgResize(buffer,(res) => {
                        uploadFile(res.base64);
                    });

                    imagePicker.close({
                        success:res => {
                            console.log('imagePicker close',res);
                        }
                    });
                }
            });
        });
    }

    /**
     * 绑定手机号
     */
    public changePhone() {
        // 修改公众号不需要绑定手机号码
        if (this.props.changePublic) {
            return ;
        }
        if (!this.state.phone) {  // 绑定
            popNew('app-view-mine-setting-phone');
        } else { // 重新绑定
            popNew('app-view-mine-setting-unbindPhone');
        }
        
    }

    // 公众号名字
    public publicNameChange(e:any) {
        this.props.publicName = e.value;
        this.paint();
    }

    // 公众号描述
    public infoArea(e:any) {
        this.props.contentInput = e.value;
        this.paint();
    }

    // 点击申请
    public createClick() {
        if (!this.state.phone) {
            popNewMessage('请绑定手机号码');
            
            return;
        }
        if (!this.props.publicName) {
            popNewMessage('请输入名字');

            return;
        }
        if (!this.props.contentInput) {
            popNewMessage('请输入公众号描述');

            return;
        }
        openPublic(this.props.publicName,this.props.contentInput,this.props.avatar).then(r => {
            console.log(r);
            if (r === 'repeat name') {
                popNewMessage('已存在该名字');
            } else {
                popNewMessage('开通成功');
                store.setStore('pubNum',r);
                this.ok && this.ok(r);
            }
        });
    }
    // 返回
    public goBack() {
        this.ok && this.ok();
    }

    /**
     * 修改公众号
     */
    public changePublic() {
        if (!this.props.publicName) {
            popNewMessage('请输入名字');

            return;
        }
        if (!this.props.contentInput) {
            popNewMessage('请输入公众号描述');

            return;
        }
        changePublic(this.props.publicName,this.props.contentInput,this.props.avatar,this.props.pubNum).then(r => {
            if (r === 'repeat name') {
                popNewMessage('已存在该名字');
            } else {
                popNewMessage('修改成功');
                const val = store.getStore('communityInfoMap',new Map());
                const commUserInfo = new CommUserInfo();
                const userinfo:UserInfo = this.props.userInfo;
                const community:CommunityBase = val.get(this.props.pubNum);
                community.name = this.props.publicName;
                community.desc = this.props.contentInput;
                community.avatar = this.props.avatar; 
                commUserInfo.user_info = userinfo;
                commUserInfo.comm_info = community;
                val.set(this.props.pubNum,commUserInfo);
                this.ok && this.ok(community);
            }
        });
    }
}

registerStoreData('user/info', () => {
    getUserInfo().then(userInfo => {
        STATE.phone = userInfo.phoneNumber;
        if (userInfo.tel) {
            const str = String(userInfo.tel).substr(3, 6);
            STATE.phone = userInfo.tel.replace(str, '******');
        }
        forelet.paint(STATE);
    });
});