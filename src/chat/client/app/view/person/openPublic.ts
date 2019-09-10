import { uploadFile } from '../../../../../app/net/pull';
import { getUserInfo, imgResize, popNewMessage } from '../../../../../app/utils/tools';
import { registerStoreData } from '../../../../../app/viewLogic/common';
import { selectImage } from '../../../../../app/viewLogic/native';
import { popNew } from '../../../../../pi/ui/root';
import { Forelet } from '../../../../../pi/widget/forelet';
import { Widget } from '../../../../../pi/widget/widget';
import * as store from '../../data/store';
import { openPublic } from '../../net/rpc';
export const forelet = new Forelet();

interface Props {
    chooseImage:boolean;
    avatar:string;
    avatarHtml:string;
    publicName:string;
    contentInput:string;
    userProtocolReaded:boolean;
    userInfo:any;
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
        userInfo:{}
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
        const userInfo = this.props.userInfo;
        this.props.avatar = userInfo.avatar ? userInfo.avatar :'../../res/images/user_avatar.png';
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
                }
            });
        });
    }

    /**
     * 绑定手机号
     */
    public changePhone() {
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
}

registerStoreData('user/info', () => {
    getUserInfo().then(userInfo => {
        STATE.phone = userInfo.phoneNumber;
        const str = String(userInfo.tel).substr(3, 6);
        STATE.phone = userInfo.tel.replace(str, '******');
        forelet.paint(STATE);
    });
});