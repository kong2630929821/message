/**
 * 新朋友验证状态
 */

// ================================================ 导入
import { Widget } from "../../../../pi/widget/widget";
import { Forelet } from "../../../../pi/widget/forelet";
import { popNew } from "../../../../pi/ui/root";
import { UserInfo } from "../../../../server/data/db/user.s";
import { Logger } from '../../../../utils/logger';
import { factorial } from "../../../../pi/util/math";
import { create } from "../../../../pi/net/rpc";
import { getUsersBasicInfo } from "../../../app/net/rpc"
import { UserArray } from "../../../../server/data/rpc/basic.s"
import { ConState } from "../../../../pi/ui/con_mgr";

declare var module;
const WIDGET_NAME = module.id.replace(/\//g, '-');
const logger = new Logger(WIDGET_NAME);

// ================================================ 导出
export class NewFriend extends Widget {
    props = {
        sid:null,
        applyUserIds:[],
        applyUserList:[]
    } as Props
    public setProps(props,oldProps){
        super.setProps(props,oldProps);
        console.log("=hhhhhhhhhh",props)
        this.props = {
            sid:null,
            applyUserIds:props.applyUserIds,
            applyUserList:[]
        }

        this.getNewApplyFriend();
        console.log("===========验证消息状态",this.props.applyUserList)
        // this.props.applyUserList = [{
        //     avatorPath : "emoji.png",
        //     userName : "好友用户名",
        //     applyInfo : "填写验证信息",
        //     isAgree : true
        // },
        // {
        //     avatorPath : "emoji.png",
        //     userName : "好友用户名",
        //     applyInfo : "填写验证信息",
        //     isAgree : true
        // },
        // {
        //     avatorPath : "emoji.png",
        //     userName : "好友用户名",
        //     applyInfo : "填写验证信息",
        //     isAgree : false
        // }];
    }
    attach(){
        console.log("============attach",this.props.applyUserIds); 
    }

    public getNewApplyFriend(){
        getUsersBasicInfo(this.props.applyUserIds,(r:UserArray) => {
            console.log("===好友申请人信息===",r)
            r.arr.map( item => {
                let obj = {
                    uid :item.uid,
                    avatorPath : "emoji.png",
                    userName:item.uid.toString(),
                    applyInfo : "填写验证信息",
                };
                this.props.applyUserList.push(obj);
            });
            this.paint();                    
        })
    }
}

// ================================================ 本地
interface ApplyUserList{
    uid:number;//id
    avatorPath : string;// 头像
    userName : string;//用户名
    applyInfo : string; // 其他
}
interface Props {
    sid: number,
    applyUserIds:Array<number>,
    applyUserList : ApplyUserList[];
}
