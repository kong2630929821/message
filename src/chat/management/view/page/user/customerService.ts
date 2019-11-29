import { Widget } from '../../../../../pi/widget/widget';
import { REPORTREPLY, WELCOME } from '../../../config';
import { getAllUser, getMessageReply, setAccMsgReply, setHaoHaiAcc } from '../../../net/rpc';
import { getStore } from '../../../store/memstore';
import { popNewMessage } from '../../../utils/logic';
import { rippleShow } from '../../../utils/tools';

interface Props {
    active:number;// 当前的tab
    newUserInput:string;//
    reportInput:string;
    userStatus:boolean;// 是否编辑新用户回复
    reportStatus:boolean;// 是否编辑举报内容
    isHaveCus:number;// 0没有好嗨客服 1修改好嗨客服 2保存
    haohaiId:string;// 好嗨ID
    haoHaiPass:string;// 好嗨密码
    isShowHaoHai:boolean;// 判断权限 是否展示添加修改好嗨客服
}

let user = '';// 账号
let pwd = '';// 密码
let newUserInput = '';// 首次登陆客服回复
let reportInput = '';// 举报内容回复
/**
 * 客服设置
 */
export class CustomerService extends Widget {
    public props:Props = {
        active :0,
        newUserInput:'',
        reportInput:'',
        userStatus:true,
        reportStatus:true,
        isHaveCus:0,
        haohaiId:'',
        haoHaiPass:'',
        isShowHaoHai:false
    };

    public create() {
        super.create();
        this.initData();
    }

    public initData() {

        const account = getStore('flags',{}).account;
        if (/^[0-9]+$/.test(account)) {
            // 当前账号是好嗨客服
            this.props.isShowHaoHai = false;
        } else {
            // 当前账号是管理员
            this.props.isShowHaoHai = true;
            // 获取好嗨客服
            getAllUser().then((r:any) => {
            // 全为数字则是好嗨客服
                r.list.forEach(v => {
                    if (/^[0-9]+$/.test(v.user)) {
                        this.props.haohaiId = v.user;
                        user = v.user;
                        this.props.haoHaiPass = v.pwd;
                        pwd = v.pwd;
                        this.props.isHaveCus = 1;
                        this.paint();
                    }
                });
            });
        }
        
        // 获取首次登陆客服回复
        getMessageReply(WELCOME).then((r:any) => {
            this.props.newUserInput = r.msg;
            newUserInput = r.msg;
            this.paint();
        });
        
        // 获取举报内容回复
        getMessageReply(REPORTREPLY).then((r:any) => {
            this.props.reportInput = r.msg;
            reportInput = r.msg;
            this.paint();
        });

    }
    /**
     * 切换tab
     */
    public changeTab(index:number) {
        this.props.active = index;
        this.paint();
    }

    /**
     * 是否可编辑
     */
    public onChange(index:number) {
        if (index) {
            this.props.reportStatus = false; 
        } else {
            this.props.userStatus = false;
        }
        this.paint();
    }

    /**
     * 保存修改
     */
    public saveChange(index:number) {
        if (index === 0) {
            // 好嗨客服设置
            this.isHaveCusChange(0);
        } else {
            // 好嗨客服回复内容设置
            let key = '';
            let input = '';
            if (index === 1) {
                 // 新用户回复
                if (!this.props.newUserInput) {
                    popNewMessage('请输入新用户自动回复内容');
    
                    return;
                }
                key = WELCOME;
                input = this.props.newUserInput;
                
            } else {
               // 举报
                if (!this.props.reportInput) {
                    popNewMessage('请输入举报回复内容');

                    return;
                }
                key = REPORTREPLY;
                input = this.props.reportInput;
            }
            setAccMsgReply(key,input).then(r => {
                if (r === 1) {
                    popNewMessage('设置成功');
                    if (index === 1) {
                        this.props.userStatus = true;
                        newUserInput = input;
                    } else {
                        this.props.reportStatus = true;
                        reportInput = input;
                    }
                    this.paint();
                } else {
                    popNewMessage('设置失败');
                }
            });

        }
    }

    /**
     * 取消修改
     */
    public cancelChange(index:number) {
        if (index === 0) {
            // 好嗨客服
            this.props.haohaiId = user;
            this.props.haoHaiPass = pwd;
            this.props.isHaveCus = 1;
        } else if (index === 1) {
            // 新用户
            this.props.userStatus = true;
            this.props.newUserInput = newUserInput;
        } else {
            // 举报
            this.props.reportStatus = true;
            this.props.reportInput = reportInput;
        }
        this.paint();
    }

    /**
     * 
     * @param index 0添加好嗨客服 1修改好嗨客服
     */
    public isHaveCusChange(index:number) {
        if (index === 0) {
            // 添加
            if (!this.props.haohaiId) {
                popNewMessage('请输入好嗨ID');

                return;
            }

            if (!this.props.haoHaiPass) {
                popNewMessage('请输入客服密码');

                return;
            }

            setHaoHaiAcc(this.props.haohaiId,this.props.haoHaiPass).then(r => {
                if (r === 1) {
                    popNewMessage('设置成功');
                    user = this.props.haohaiId;
                    pwd = this.props.haoHaiPass;
                    this.props.isHaveCus = 1;
                    this.paint();
                } else {
                    popNewMessage('设置失败');
                }
            });
        } else {
            this.props.isHaveCus = 2;
            this.paint();
        }
        
    }
    public userChange(e:any) {
        this.props.newUserInput = e.value;
    }

    public reportChange(e:any) {
        this.props.reportInput = e.value;
    }

    public inputChangeId(e:any) {
        this.props.haohaiId = e.value;
    }

    public inputChangePass(e:any) {
        this.props.haoHaiPass = e.value;
    }

    // 动画效果执行
    public onShow(e:any) {
        rippleShow(e);
    }
}