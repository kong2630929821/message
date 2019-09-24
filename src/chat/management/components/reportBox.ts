import { Widget } from '../../../pi/widget/widget';
import { setPunish } from '../net/rpc';
import { PENALTY, popNewMessage } from '../utils/logic';
import { rippleShow } from '../utils/tools';

interface Props {
    checkType:any;// 处罚类型
    checkedList:number;// 选中的处罚类型
    checkTime:any;// 选择时长
    checkTimeList:number;// 选中时长
    userInfo:any;// 用户信息
    state:number;// 0用户 1嗨嗨号

}

/**
 * 处罚弹框
 */
export class ReportBox extends Widget {
    public ok:() => void;
    public cancel:() => void;
    public props:Props = {
        checkType:['禁止发动态','禁止发消息','冻结用户'],
        checkedList:0,
        checkTime:['12小时','24小时','7天','30天','180天'],
        checkTimeList:0,
        userInfo:{
            id:'',// acc_id  嗨嗨号ID
            name:'',// 用户名  公众号名字
            sex:'',// 性别  0男  1女 ''未设置性别
            report_id:0,// 举报ID
            key:'',
            isPublic:false,// 是否是嗨嗨号
            uid:0// 用户iD
        },
        state:0
    };

    public setProps(props:any) {
        this.props = {
            ...this.props,
            ...props
        };
        super.setProps(this.props);
        if (this.props.state === 1) {
            this.props.checkType = ['冻结嗨嗨号'];
        }
    }

    // 选择处罚类型
    public btnCheckType(index:number) {
        this.props.checkedList = index;
        this.paint();
    }

    // 处罚时间选择
    public btnCheckTime(index:number) {
        this.props.checkTimeList = index;
        this.paint();
    }
    // 取消
    public btnCancel() {
        this.cancel && this.cancel();
    }

    // 确认
    public btnOk() {
        const timeList = [0.5,1,7,30,180];
        const time = timeList[this.props.checkTimeList] * 24 * 60 * 60 * 1000;
        if (this.props.state === 0) {
            // 惩罚用户
            this.punishUser(time);
        } else if (this.props.state === 1) {
            // 惩罚嗨嗨号
            this.punishHaiHai(time);
        }
        
        this.ok && this.ok();
    }

    // 惩罚用户
    public punishUser(time:number) {
        let punish = 0;
        if (this.props.checkedList === 0) {
            punish = PENALTY.BAN_POST ;
        } else if (this.props.checkedList === 1) {
            punish = PENALTY.BAN_MESAAGE;
        } else {
            punish = PENALTY.FREEZE;
        }
        const key = this.props.userInfo.key;
        setPunish(key,this.props.userInfo.report_id,punish,time).then((r:any) => {
            if (!isNaN(r)) {
                popNewMessage('处理成功');
            } else {
                popNewMessage('处理失败');
            }
        });
    }

    // 惩罚嗨嗨号
    public punishHaiHai(time:number) {
        const punish = PENALTY.FREEZE;
        const key = this.props.userInfo.key;
        setPunish(key,this.props.userInfo.report_id,punish,time).then((r:any) => {
            if (!isNaN(r)) {
                popNewMessage('处理成功');
            } else {
                popNewMessage('处理失败');
            }
        });
    }

    // 动画效果执行
    public onShow(e:any) {
        rippleShow(e);
    }
}