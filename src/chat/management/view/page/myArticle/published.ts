import { Widget } from '../../../../../pi/widget/widget';
import { buildupImgPath } from '../../../../client/app/logic/logic';
import { perPage } from '../../../components/pagination';
import { getPubActicle } from '../../../net/rpc';
import { deepCopy, getStore } from '../../../store/memstore';
import { timestampFormat } from '../../../utils/logic';
import { rippleShow } from '../../../utils/tools';

interface Props {
    resData: any[]; // 保存获取到的帖子原始数据
    showDataList:DraftItem[];// 展示数据
    dataList:DraftItem[]; // 处理后的全部帖子数据
    sum:number;// 数据条数
    perPage:number;// 每页显示多少条数据
    currentIndex:number;// 当前页数
    expandIndex:boolean;// 控制分页显示隐藏
    perPageIndex:number;// 每页显示多少个的下标
    status:boolean;// true列表 false详情
    isDetail:boolean; // 是否进入详情页面
    currentData:{}; // 当前操作的数据
    tempData : DraftItem[]; // 临时存储返回后的值
    buildupImgPath:Function; // 解析图片地址
}

interface DraftItem {
    banner:string;
    title:string;
    time:string;
    commentCount:number;
    likeCount:number;
    
}
/**
 * 草稿
 */
export class Published extends Widget {
    public props:Props = {
        dataList:[
            
        ],
        sum:20,
        perPage:perPage[0],
        currentIndex:0,
        expandIndex:false,
        perPageIndex:0,
        showDataList:[],
        status:false,
        isDetail:false,
        currentData:{},
        tempData:[],
        buildupImgPath:buildupImgPath,
        resData:[]
        
    };

    public create() {
        super.create();
        this.getPosts();
      
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
    
    // 获取当前登录账号所发布的所有帖子
    public getPosts() {
        const num = getStore('flags/num');

        getPubActicle(99999,0,num,1).then((res:any) => {
            this.props.resData = res.list;
            res.list.forEach(element => {
                const tempData = {
                    bannerImg : (JSON.parse(element.body).imgs).toString(),
                    title : element.title,
                    time : timestampFormat(element.createtime),
                    commentCount : element.commentCount,
                    likeCount : element.likeCount
                };
                this.props.dataList.push(tempData);
            });
            // this.props.dataList = res.list;
            console.log(this.props.dataList);
            // const data = deepCopy(this.props.list[this.props.currentIndex * this.props.perPage + index]);
            this.props.showDataList = this.props.dataList.slice(0,this.props.perPage);
            this.paint();
        });
    }

    // 进入已发布帖子详情
    public goDataills(k:any) {
        console.log('进入帖子详情');
        this.props.isDetail = !this.props.isDetail;
        this.props.currentData = deepCopy(this.props.resData[this.props.currentIndex * this.props.perPage + k]);
        // this.props.currentData = this.props.dataList[k];
        this.paint();

    }
    // 返回
    public goBack(e:any) {
        // fg判斷是否需要刷新頁面數據
        if (e.fg) {
            this.getPosts();
        }
        this.props.isDetail = false;
        this.paint();
    }
}