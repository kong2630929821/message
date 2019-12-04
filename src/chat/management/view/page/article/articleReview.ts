import { popNew } from '../../../../../pi/ui/root';
import { Widget } from '../../../../../pi/widget/widget';
import { buildupImgPath } from '../../../../client/app/logic/logic';
import { perPage } from '../../../components/pagination';
import { getAllPostList } from '../../../net/rpc';
import { rippleShow } from '../../../utils/tools';

interface Props {
    sum:number;// 总页数
    perPage:number;// 每页显示多少条数据
    currentIndex:number;// 当前页数
    expandIndex:boolean;// 控制分页显示隐藏
    perPageIndex:number;// 每页显示多少个的下标
    showDataList:ActiveData[];// 数据列表
    activeData:ActiveData;// 右侧选中的文章
    dataList:ActiveData[];// 全部文章
    active:number;// 左侧选中
    buildupImgPath:Function;// 图片路径
}

interface ActiveData {
    avatar:string;// 头像
    banner:string;// bannner图
    body:string;// 内容
    createtime:string;// 创建时间
    key:{id:number;num:string};
    name:string;// 发布者名
    num:string;// 社区号
    owner:number;// 发布者uid
    post_type:number;// 类型
    state:number;// 文章状态
    title:string;// 标题
}
/**
 * 文章审核
 */
export class ArticleReview extends Widget {
    public props:Props = {
        sum:20,
        perPage:perPage[0],
        currentIndex:0,
        expandIndex:false,
        perPageIndex:0,
        showDataList:[],
        activeData:{
            avatar: '',
            banner:'',
            name:'',
            num:'',
            body: '',
            createtime: '',
            key: { id: 0, num: '0' },
            owner: 0,
            post_type: 0,
            state: 0,
            title: ''
        },
        dataList:[],
        active:0,
        buildupImgPath:buildupImgPath
    };

    public create() {
        super.create();
        // 获取数据
        this.initData(0,'');
    }

    /**
     * 初始化数据
     */
    public initData(id:number,num:string) {
        getAllPostList(900000,id,num).then((r:any) => {
            // 全部数据
            this.props.dataList = r.list;
            // 获取第一页数据
            this.props.showDataList = this.props.dataList.slice(0,this.props.perPage);
            // 数据总数
            this.props.sum = r.total;
            // 右侧数据详情
            this.props.activeData = this.props.showDataList[0];
            this.paint();
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

    // 点击审核
    public review(index:number) {
        const data = this.props.showDataList[index];
        // 弹框处理
        popNew('chat-management-components-modalBox',{ key:data.key,name:data.name,avatar:data.avatar,title:data.title },() => {
            // 审核后刷新数据
            this.initData(0,'');
            this.paint();
        });
    }

    // 选中
    public checkedItem(index:number) {
        this.props.active = index;
        this.props.activeData = this.props.showDataList[index];
        this.paint();
    }

}