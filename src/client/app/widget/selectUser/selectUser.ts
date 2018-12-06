/*
** selectUser 组件相关处理
**
*/ 

// ===========================导入
import { Widget } from "../../../../pi/widget/widget"
import { notify } from "../../../../pi/widget/event"
import { Json } from "../../../../pi/lang/type";
import { UserInfo } from '../../../../server/data/db/user.s';
import * as store from '../../data/store';

interface Props{
    uid?:number;
    // info?:Json; // 用户信息
    // avatorPath : string;// 头像
    // userName : string;//用户名
    isSelect: boolean;//是否选中
}


// ===========================导出
export class SelectUser extends Widget{
    public props : Props ={
        uid:null,
        // info:null, 
        // avatorPath : "emoji.png",
        // userName : "Evan Wood",
        isSelect : false
    };
   
    public setProps(props: Props, oldProps: Props) {
        super.setProps(props, oldProps);
        console.log("=======hhhhhh",props);
        this.props = props;
        // this.props.info = store.getStore(`userInfoMap/${this.props.uid}`,new UserInfo());
    }

    // 点击改变选中状态
    // public changeSelect(event:any){
    //     let temp = this.props.isSelect;
    //     this.props.isSelect = !temp;
    //     notify(event.node,"ev-addMember",{});
    //     this.paint();
    // }
    
}

