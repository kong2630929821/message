import { Widget } from '../../../../../pi/widget/widget';
import { perPage } from '../../../components/pagination';
import { getAllGameInfo, getAllGameList } from '../../../net/rpc';
import { deepCopy, getStore, setStore } from '../../../store/memstore';
import { rippleShow } from '../../../utils/tools';

interface Props {
    dataList:ListItem[];
    sum:number;// 数据条数
    perPage:number;// 每页显示多少条数据
    currentIndex:number;// 当前页数
    expandIndex:boolean;// 控制分页显示隐藏
    perPageIndex:number;// 每页显示多少个的下标
    showDataList:ListItem[];// 页面展示的数据
    currentData:any;// 当前操作的数据
    status:boolean;// 是否有二级页面
}

export interface ListItem {
    appid: string;
    buttonMod: number;
    desc: string;
    groupId: string;
    img: string[];
    screenMode: string;
    subtitle: string;
    title: string;
    url: string;
    webviewName: string;
    time: string;
}
/**
 * 第三方应用列表
 */
export class ThirdApplication extends Widget {
    public props:Props = {
        dataList:[],
        sum:20,
        perPage:perPage[0],
        currentIndex:0,
        expandIndex:false,
        perPageIndex:0,
        showDataList:[],
        currentData:{},
        status:false
    };

    public create() {
        super.create();
        const appList = getStore('appList',[]);
        if (appList[0]) {
            this.props.dataList = appList;
            this.props.showDataList = this.props.dataList.slice(this.props.currentIndex,this.props.perPage);
        } else {
            this.init();
        }
    }

    public init() {
        // 获取全部游戏
        getAllGameList().then(r => {
            if (r.length) {
                getAllGameInfo(r).then(r => {
                    setStore('appList',r);
                    this.props.dataList = r;
                    this.props.showDataList = this.props.dataList.slice(this.props.currentIndex,this.props.perPage);
                    this.paint();
                });
            }
        });
    }
    
    // 重置页面的展开状态
    public close() {
        this.props.expandIndex = false;
        this.paint();
    }

    // 分页变化
    public pageChange(e:any) {
        this.close();
        this.props.currentIndex = e.value;
        this.props.showDataList = this.props.dataList.slice(e.value * this.props.perPage,(e.value + 1) * this.props.perPage);
        this.paint();
    }

    // 动画效果执行
    public onShow(e:any) {
        rippleShow(e);
    }
    // 过滤器
    public expand(e:any) {
        this.close();
        this.props.expandIndex = e.value;
        this.paint();
    }
    
    // 每页展示多少数据
    public perPage(e:any) {
        this.props.perPage = e.value;
        this.props.perPageIndex = e.index;
        this.props.expandIndex = false;
        this.pageChange({ value:0 });   
        this.paint();  
    }

    /**
     * 查看应用
     * @param index 应用下标
     */
    public goAppInif(index:number) {
        this.props.currentData = deepCopy(this.props.showDataList[this.props.currentIndex * this.props.perPage + index]);
        this.props.status = true;
        this.paint();
    }

    /**
     * 二级页面返回
     */
    public goBack(e:any) {
        if (e.fg) {
            this.init();
        }
        this.props.status = false;
        this.paint();
    }
}