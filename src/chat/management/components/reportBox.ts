import { popNew } from '../../../pi/ui/root';
import { Widget } from '../../../pi/widget/widget';
import { setPunish, setReportHandled } from '../net/rpc';
import { PENALTY, popNewMessage } from '../utils/logic';
import { rippleShow } from '../utils/tools';

interface Props {
    checkType:any;// 处罚类型
    checkedList:number;// 选中的处罚类型
    checkTime:any;// 选择时长
    checkTimeList:number;// 选中时长
    userInfo:any;// 用户信息
    state:number;// 0用户 1嗨嗨号
    msg:string;// 客服回复的话
    punishment:string;// 当前惩罚

}

/**
 * 处罚弹框
 */
export class ReportBox extends Widget {
    public ok:() => void;
    public cancel:() => void;
    public props:Props = {
        checkType:['禁言','冻结账户'],
        checkedList:0,
        checkTime:['12小时','24小时','7天','30天','180天','永久'],
        checkTimeList:0,
        userInfo:{
            id:'',
            name:'',// 用户名  公众号名字
            sex:'',// 性别  0男  1女 ''未设置性别
            key:''
        },
        state:0,
        msg:'',
        punishment:''
    };

    public setProps(props:any) {
        this.props = {
            ...this.props,
            ...props
        };
        super.setProps(this.props);
        this.props.msg = `您的账号因被多人举报，经核实，对该账号进行"禁言${this.props.checkTime[this.props.checkTimeList]}"的处理，期间您将不能进行动态、评论、聊天等相关操作`;
        if (this.props.state === 1) {
            this.props.checkType = ['冻结嗨嗨号'];
        }
    }

    // 选择处罚类型
    public btnCheckType(index:number) {
        this.props.checkedList = index;
        if (this.props.checkedList === 0) {
            this.props.msg = `您的账号因被多人举报，经核实，对该账号进行"禁言${this.props.checkTime[this.props.checkTimeList]}"的处理，期间您将不能进行动态、评论、聊天等相关操作`;
        } else {
            this.props.msg = `您的账号因被多人举报，经核实，对该账号进行"冻结${this.props.checkTime[this.props.checkTimeList]}"的处理，期间您将不能登录`;
        }
        this.paint();
    }

    // 处罚时间选择
    public btnCheckTime(index:number) {
        this.props.checkTimeList = index;
        if (this.props.checkedList === 0) {
            this.props.msg = `您的账号因被多人举报，经核实，对该账号进行"禁言${this.props.checkTime[this.props.checkTimeList]}"的处理，期间您将不能进行动态、评论、聊天等相关操作`;
        } else {
            this.props.msg = `您的账号因被多人举报，经核实，对该账号进行"冻结${this.props.checkTime[this.props.checkTimeList]}"的处理，期间您将不能登录`;
        }
        
        this.paint();
    }
    // 取消
    public btnCancel() {
        this.cancel && this.cancel();
    }

    // 确认
    public btnOk() {
        const timeList = [0.5,1,7,30,180,-1];
        let time = null;
        if (this.props.checkTimeList === 5) {
            time = -1;
        } else {
            time = timeList[this.props.checkTimeList] * 24 * 60 * 60 * 1000;
        }
        if (this.props.state === 0) {
            // 惩罚用户
            if (this.props.punishment === '无') {
                this.punishUser(time);
            } else {
                // 覆盖当前惩罚
                popNew('chat-management-components-confirmBox',{ title:'对方正在被惩罚',content:'确认处理会覆盖之前的惩罚',invalid:-1 },() => {
                    this.punishUser(time);
                });
            }
            
        } else if (this.props.state === 1) {
            // 惩罚嗨嗨号
            this.punishHaiHai(time);
        }
    }

    // 惩罚用户
    public punishUser(time:number) {
        let punish = 0;
        if (this.props.checkedList === 0) {
            punish = PENALTY.FREEZE ;
        } else if (this.props.checkedList === 1) {
            punish = PENALTY.FREEZE;
        }
        const key = this.props.userInfo.key;
        setPunish(key,punish,time).then((r:any) => {
            if (!isNaN(r)) {
                setReportHandled(key).then(res => {
                    if (key === res) {
                        popNewMessage('处理成功');
                        this.ok && this.ok();
                    } else {
                        popNewMessage('处理失败');
                        this.ok && this.ok();
                    } 
                });
            } else {
                popNewMessage('处理失败');
                this.ok && this.ok();
            }
           
        });
    }

    // 惩罚嗨嗨号
    public punishHaiHai(time:number) {
        const punish = PENALTY.FREEZE;
        const key = this.props.userInfo.key;
        setPunish(key,punish,time).then((r:any) => {
            if (!isNaN(r)) {
                popNewMessage('处理成功');
            } else {
                popNewMessage('处理失败');
            }
            this.ok && this.ok();
        });
    }

    // 动画效果执行
    public onShow(e:any) {
        rippleShow(e);
    }
}