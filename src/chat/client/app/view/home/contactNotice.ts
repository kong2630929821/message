import { popNew3, rippleShow } from '../../../../../app/utils/tools';
import { notify } from '../../../../../pi/widget/event';
import { Forelet } from '../../../../../pi/widget/forelet';
import { BScroll } from '../../../../../pi/widget/scroller/core/index';
import { PullDown } from '../../../../../pi/widget/scroller/pull-down/index';
import { PullUp } from '../../../../../pi/widget/scroller/pull-up/index';
import { Widget } from '../../../../../pi/widget/widget';
import { GENERATOR_TYPE } from '../../../../server/data/db/user.s';
import * as store from '../../data/store';
export const forelet = new Forelet();

interface Props {
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
const STATE = {
    lastChat:[]
};
/**
 * 聊天通知
 */
export class ContactNotice extends Widget {
    public props:Props = {
        beforePullDown:true,
        isPullingDown:false,
        isPullUpLoad:false,
        createPullUp:false,
        createPullDown:false
    };
    public bscroll:BScroll;// 上下拉
    public create() {
        super.create();
        this.state = STATE;
        this.bscroll = null;
    }
    /**
     * 进入聊天页面
     * @param id 好友ID或群ID
     * @param chatType 群聊或单聊
     */
    public chat(num:number,e:any) {
        // notify(e.node,'ev-chat',null);
        const value = this.state.lastChat[num];
        if (value[2] !== GENERATOR_TYPE.GROUP && value[2] !== GENERATOR_TYPE.USER) {
            popNew3('chat-client-app-view-chat-notice', { name:'消息通知' }) ;
        } else {
            const gid = value.length === 4 ? value[3] :null ;
            popNew3('chat-client-app-view-chat-chat', { id: value[0], chatType: value[2], groupId:gid }) ;
        }
        
    } 

    // 动画效果执行
    public onShow(e:any) {
        rippleShow(e);
    }

    // 下拉刷新
    public attach() {
        super.attach();
        console.log(1111111111111111111111111111);
        // 初始化上拉下拉状态
        this.props.createPullDown = true;
        this.props.createPullUp = true;
        this.initBscroll();
       
    }
 
     // 初始化组件
    public initBscroll() {
        const obj = document.querySelector('#outBox');
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
        this.bscroll.on('pullingUp', this.pullingUpHandler.bind(this));
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

store.register(`lastChat`, (r: [number, number][]) => {
    STATE.lastChat = r;
    forelet.paint(STATE);
});