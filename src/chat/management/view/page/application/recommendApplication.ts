import { popNew } from '../../../../../pi/ui/root';
import { Widget } from '../../../../../pi/widget/widget';
import { buildupImgPath } from '../../../../client/app/logic/logic';
import { getAllGameInfo, getHotApp, getRecommendApp, setAppHot } from '../../../net/rpc';
import { getStore, setStore } from '../../../store/memstore';
import { popNewMessage } from '../../../utils/logic';

interface Props {
    hotApp:any[];// 热门
    recommendApp:any[];// 推荐
    buildupImgPath:any;// 图片拼接地址
}
/**
 * 推荐应用
 */
export class RecommendApplication extends Widget {

    public props:Props = {
        hotApp:[],
        recommendApp:[],
        buildupImgPath:buildupImgPath
    };

    public create() {
        super.create();
        const hotApp = getStore('hotApp',[]);
        const recommend = getStore('recommendApp',[]);
        if (hotApp.length && recommend.length) {
            this.props.hotApp = hotApp;
            this.props.recommendApp = recommend;
        } else {
            this.initData();
        }
    }

    /**
     * 初始化数据
     * 0全部 1热门 2推荐
     */
    public initData(setType:number= 0) {

        // 获取热门游戏
        if (setType === 0 || setType === 1) {
            getHotApp().then(r => {
                if (r) {
                    getAllGameInfo(r).then(res => {
                        setStore('hotApp',res);
                        this.props.hotApp = res;
                        console.log('获取热门游戏',res);
                        this.paint();
                    });
                }
            });
        }

        // 获取推荐游戏
        if (setType === 0 || setType === 2) {
            getRecommendApp().then(r => {
                if (r) {
                    getAllGameInfo(r).then(res => {
                        setStore('recommendApp',res);
                        console.log('获取推荐游戏',res);
                        this.props.recommendApp = res;
                        this.paint();
                    });
                }
            });
        }
       
    }
    /**
     * 添加一个推荐
     */
    public addApp(setType:number) {
        popNew('chat-management-components-addApplicationModule',{},(appId:string) => {
            const arr = [appId];
            setAppHot(JSON.stringify(arr),setType).then(r => {
                if (r === 1) {
                    popNewMessage('添加成功');
                    this.initData(setType);
                } else {
                    popNewMessage('添加失败');
                }
            });
        });
    }
}