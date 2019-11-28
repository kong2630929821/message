import { Widget } from '../../../../../pi/widget/widget';
import { perPage } from '../../../components/pagination';
import { getPubActicle } from '../../../net/rpc';
import { getStore } from '../../../store/memstore';
import { rippleShow } from '../../../utils/tools';

interface Props {
    showDataList:DraftItem[];// 展示数据
    dataList:DraftItem[];
    sum:number;// 数据条数
    perPage:number;// 每页显示多少条数据
    currentIndex:number;// 当前页数
    expandIndex:boolean;// 控制分页显示隐藏
    perPageIndex:number;// 每页显示多少个的下标
    status:boolean;// true列表 false详情
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
            {
                banner:'../../../res/images/xianzhixiadao.png',
                title:'多元化的内容生态离不开每一位创作者的直播梦想和辛勤创作。',
                time:'2019-10-10',
                commentCount:12,
                likeCount:33
            },
            {
                banner:'../../../res/images/xianzhixiadao.png',
                title:'多元化的内容生态离不开每一位创作者的直播梦想和辛勤创作。',
                time:'2019-10-10',
                commentCount:12,
                likeCount:33
            },
            {
                banner:'../../../res/images/xianzhixiadao.png',
                title:'多元化的内容生态离不开每一位创作者的直播梦想和辛勤创作。',
                time:'2019-10-10',
                commentCount:12,
                likeCount:33
            },
            {
                banner:'../../../res/images/xianzhixiadao.png',
                title:'多元化的内容生态离不开每一位创作者的直播梦想和辛勤创作。',
                time:'2019-10-10',
                commentCount:12,
                likeCount:33
            },
            {
                banner:'../../../res/images/xianzhixiadao.png',
                title:'多元化的内容生态离不开每一位创作者的直播梦想和辛勤创作。',
                time:'2019-10-10',
                commentCount:12,
                likeCount:33
            },
            {
                banner:'../../../res/images/xianzhixiadao.png',
                title:'多元化的内容生态离不开每一位创作者的直播梦想和辛勤创作。',
                time:'2019-10-10',
                commentCount:12,
                likeCount:33
            }
        ],
        sum:20,
        perPage:perPage[0],
        currentIndex:0,
        expandIndex:false,
        perPageIndex:0,
        showDataList:[],
        status:false
    };

    public create() {
        super.create();
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

        getPubActicle(10,0,num).then((res:any) => {
            console.log(res.list[0].title);
            this.props.dataList = res.list;
            console.log(this.props.dataList);
            this.paint();
        });
    }
}