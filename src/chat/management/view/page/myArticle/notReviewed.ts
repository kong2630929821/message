import { Widget } from '../../../../../pi/widget/widget';
import { buildupImgPath } from '../../../../client/app/logic/logic';
import { perPage } from '../../../components/pagination';
import { getPubActicle } from '../../../net/rpc';
import { deepCopy, getStore } from '../../../store/memstore';
import { timestampFormat } from '../../../utils/logic';
import { rippleShow } from '../../../utils/tools';

interface Props {
    resData: any[]; // 保存返回帖子的原始数据
    showDataList:DraftItem[];// 展示数据
    dataList:DraftItem[]; // 处理后帖子的全部数据
    sum:number;// 数据条数
    perPage:number;// 每页显示多少条数据
    currentIndex:number;// 当前页数
    expandIndex:boolean;// 控制分页显示隐藏
    perPageIndex:number;// 每页显示多少个的下标
    status:boolean;// true列表 false详情
    buildupImgPath:Function; // 还原照片路径
    currentData:object; // 当前操作的对象,
    reEdit:boolean; // 是否重新编辑
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
export class NotReviewed extends Widget {
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
        resData:[],
        buildupImgPath:buildupImgPath,
        currentData:{},
        reEdit:false
    };

    public create() {
        super.create();
        this.getPosts();
        this.props.showDataList = this.props.dataList.slice(0,this.props.perPage);
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
        getPubActicle(10,0,num,2).then((res:any) => {
            this.props.resData = res.list;
            res.list.forEach(element => {
                const tempData = {
                    bannerImg : (JSON.parse(element.body).imgs).toString(),
                    title : element.title,
                    time : timestampFormat(element.createtime),
                    commentCount : element.commentCount,
                    likeCount : element.likeCount
                };

                // this.props.tempData = [];
                // this.props.tempData.bannerImg = (JSON.parse(element.body).imgs).toString();
                // this.props.tempData.title = element.title;
                // this.props.tempData.time = timestampFormat(element.createtime);
                // console.log(this.props.tempData.time);
                // this.props.tempData.commentCount = element.commentCount;
                // this.props.tempData.likeCount = element.likeCount;
                this.props.dataList.push(tempData);
            });
            // this.props.dataList = res.list;
            console.log(res.list);
            // const data = deepCopy(this.props.list[this.props.currentIndex * this.props.perPage + index]);
            this.props.showDataList = this.props.dataList.slice(0,this.props.perPage);
            this.paint();
        });
    }

    // 未审核的帖子再次编辑 
    public goDetail(k:number) {
        console.log('再次编辑');
        this.props.currentData = deepCopy(this.props.dataList[this.props.currentIndex * this.props.perPage + k]);
        this.props.currentData.body = this.props.resData[this.props.currentIndex * this.props.perPage + k].body;
        console.log(this.props.currentData);
        this.props.reEdit = true;
        this.paint();
    }
    // 返回
    public goBack(e:any) {
        // fg判斷是否需要刷新頁面數據
        this.props.reEdit = false;
        this.paint();
    }
}