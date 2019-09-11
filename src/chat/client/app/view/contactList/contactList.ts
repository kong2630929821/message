/**
 * 通讯录
 */

 // ================================================ 导入
import { popNew3 } from '../../../../../app/utils/tools';
import { Forelet } from '../../../../../pi/widget/forelet';
import { BScroll } from '../../../../../pi/widget/scroller/core/index';
import { PullDown } from '../../../../../pi/widget/scroller/pull-down/index';
import { PullUp } from '../../../../../pi/widget/scroller/pull-up/index';
import { Widget } from '../../../../../pi/widget/widget';
import * as store from '../../data/store';
import { rippleShow } from '../../logic/logic';
// ================================================ 导出
export const forelet = new Forelet();

interface Props {
    sid:number;  // uid
    newApply:number;  // 新申请消息数
    beforePullDown:boolean;// 下拉前样式
    isPullingDown:boolean;// 是否开始下拉
    isPullUpLoad:boolean;// 是否已经下拉
    createPullUp:boolean;// 上拉创建时样式
    createPullDown:boolean;// 下拉创建时样式
}
BScroll.use(PullDown);
BScroll.use(PullUp);
const TIME_BOUNCE = 800;
const TIME_STOP = 600;
const THRESHOLD = 70;
const STOP = 56;

// tslint:disable-next-line:completed-docs
export class ContactList extends Widget {
    public ok:() => void;
    public props:Props = {
        sid:0,
        newApply:0,
        beforePullDown:true,
        isPullingDown:false,
        isPullUpLoad:false,
        createPullUp:false,
        createPullDown:false
    }; 
    public bscroll:BScroll;// 上下拉

    public create() {
        super.create();
        this.props.isPullingDown = false;
        this.props.isPullUpLoad = false;
        this.bscroll = null;
    }

    public setProps(props:any) {
        super.setProps(props);
        this.props.sid = store.getStore('uid',0);
    }

    public firstPaint() {
        super.firstPaint();
        store.register('uid',() => {  // 聊天用户登陆成功
            this.setProps(this.props);
        });
    }

    // 返回上一页
    public goBack() {
        this.ok();
    }

    public goNext(i:number,uid:number) {
        switch (i) {
            case 0:
                popNew3('chat-client-app-view-contactList-newFriend'); // 新好友验证
                break;
            case 1:
                popNew3(`chat-client-app-view-group-groupList`);  // 群聊列表
                break;
            case 2:
                popNew3('chat-client-app-view-contactList-blacklist',{ title:'公众号' ,addType:'' });
                break;
            case 3:case 4:
                popNew3('chat-client-app-view-info-userDetail',{ uid:uid }); // 本人信息
                break;
            default:
        }
    }
    
    // 动画效果执行
    public onShow(e:any) {
        rippleShow(e);
    }

     // 下拉刷新
    public attach() {
        // 初始化上拉下拉状态
        this.props.createPullDown = true;
        this.props.createPullUp = true;
        this.initBscroll();
    }
 
     // 初始化组件
    public initBscroll() {
        const obj = document.querySelector('#newBox');
        this.bscroll = new BScroll(<HTMLElement>obj, {
            scrollY: true,
            bounceTime: TIME_BOUNCE,
            pullUpLoad: true,
            pullDownRefresh: {
                threshold: THRESHOLD,
                stop: STOP
            }
        });
 
        this.bscroll.on('pullingDown', this.pullingDownHandler.bind(this));
    }
    public async pullingDownHandler() {
        this.props.beforePullDown = false;
        this.props.isPullingDown = true;
        this.paint();
 
        await this.requestData(true);
 
        this.props.isPullingDown = false;
        this.paint();
        this.finishPullDown();
    }
 
    public async pullingUpHandler() {
        this.props.isPullUpLoad = true;
        await this.requestData(false);
        this.paint();
        setTimeout(() => {
            this.bscroll.finishPullUp();
            this.bscroll.refresh();
            this.props.isPullUpLoad = false;
        }, 50);
    }
    public async finishPullDown() {
        const stopTime = TIME_STOP;
        await new Promise(resolve => {
            setTimeout(() => {
                this.bscroll.finishPullDown();
                resolve();
            }, stopTime);
        });
        setTimeout(() => {
            this.props.beforePullDown = true;
            this.paint();
            this.bscroll.refresh();
        }, TIME_BOUNCE);
    }
   
    public async requestData(fg:boolean) {
        try {
            if (fg) {
                 // 下拉刷新
                const newData = await this.ajaxGet(/* url */);
            } else {
                const newData = await this.ajaxGet(/* url */);
            }
             
        } catch (err) {
             // handle err
            console.log(err);
        }
    }

    public ajaxGet(/* url */) {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]);
            }, 1000);
        });
    }
 
}

 // ================================================ 本地
store.register('contactMap', (r) => {
    for (const value of r.values()) {
        forelet.paint(value);
    }  
});