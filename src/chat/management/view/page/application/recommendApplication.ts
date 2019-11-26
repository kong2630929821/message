import { popNew } from '../../../../../pi/ui/root';
import { Widget } from '../../../../../pi/widget/widget';
import { buildupImgPath } from '../../../../client/app/logic/logic';
import { getAllGameInfo, getHotApp, getRecommendApp, setAppHot } from '../../../net/rpc';
import { deepCopy, getStore, setStore } from '../../../store/memstore';
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
     * 0全部 1推荐 2热门
     */
    public initData(setType:number= 0) {
        
        // 获取推荐游戏
        if (setType === 0 || setType === 1) {
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

        // 获取热门游戏
        if (setType === 0 || setType === 2) {
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
    }

    /**
     * 添加一个推荐
     */
    public addApp(setType:number) {
        popNew('chat-management-components-addApplicationModule',{},(appId:string) => {
            const arr = [];
            // 保留以前的appid
            if (setType === 1) {
                this.props.recommendApp.forEach(v => {
                    arr.push(v.appid);
                });
            } else {
                this.props.hotApp.forEach(v => {
                    arr.push(v.appid);
                });
            }

            // 加上现在添加的
            arr.push(appId);
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

    /**
     * 删除
     * @param setType 1编辑 2热门
     * @param index 要删除的下标
     */
    public delApp(setType:number,index:number) {
        let data = null;
        const appId = [];
        if (setType === 1) {
            // 编辑
            data = deepCopy(this.props.recommendApp);
        } else {
            // 热门
            data = deepCopy(this.props.hotApp);
        }
        data.splice(index,1);// 删除当前这一项
        data.forEach(v => {
            appId.push(v.appid);
        });

        setAppHot(JSON.stringify(appId),setType).then(r => {
            if (r === 1) {
                popNewMessage('删除成功');
                this.initData(setType);
            } else {
                popNewMessage('删除失败');
            }
        });
    }
}