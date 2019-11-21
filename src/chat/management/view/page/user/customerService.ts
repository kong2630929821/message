import { Widget } from '../../../../../pi/widget/widget';
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
}

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
        haoHaiPass:''
    };

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
            // 好嗨客服
            this.props.isHaveCus = 1;
        } else if (index === 1) {
            // 举报
            this.props.userStatus = true;
        } else {
            // 新用户
            this.props.reportStatus = true;
        }
        this.paint();
    }

    /**
     * 取消修改
     */
    public cancelChange(index:number) {
        if (index === 0) {
            // 好嗨客服
            this.props.isHaveCus = 1;
        } else if (index === 1) {
            // 举报
            this.props.userStatus = true;
        } else {
            // 新用户
            this.props.reportStatus = true;
        }
        this.paint();
    }

    /**
     * 
     * @param index 0添加好嗨客服 1修改好嗨客服
     */
    public isHaveCusChange(index:number) {
        this.props.isHaveCus = index ? 2 :1;
        this.paint();
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