/**
 * 默认数据库
 */

// ================================================ 导入
import { Forelet } from '../../../../pi/widget/forelet';
import { Widget } from '../../../../pi/widget/widget';
import { rippleShow } from '../../utils/tools';

// ================================================ 导出
export const forelet = new Forelet();

interface Props {
    activePage: any;  // 当前活跃的页面
    pageList: any[]; // 默认过滤器
    rightBox:boolean;  // 是否显示rightbox页面
}
const PAGE = {
    articleReview:'articleReview',// 文章审核
    toBeProcessed:'toBeProcessed',// 待处理
    processed:'processed'// 已处理
};

// tslint:disable-next-line:completed-docs
export class Home extends Widget {
    public ok: () => void;
    public props: Props;
    constructor() {
        super();
        this.props = {
            pageList: [
                { name: '文章管理', page: PAGE.articleReview, img:'chart.png',children:[
                    { name:'文章审核',page:PAGE.articleReview }],
                    show:true 
                },
                { name: '投诉管理', page: PAGE.toBeProcessed, img:'chart.png',children:[
                    { name:'待处理',page:PAGE.toBeProcessed },
                    { name:'已处理',page:PAGE.processed }
                ],
                    show:false 
                }
            ],
            activePage: {},
            rightBox:true
        };
        this.props.activePage = this.props.pageList[0];
    }

    // 切换默认过滤器页面
    public changePage(num: number) {
        const res = this.props.pageList[num];
        // 是否展开子页面
        if (res.children && res.children.length > 0) {
            res.show = !res.show;
        } else {
            this.props.activePage = res;
        }
        this.paint();
    }

    // 切换过滤器的子页面
    public changeChildrenPage(num:number,index:number) {
        this.props.activePage = this.props.pageList[num].children[index];
        this.paint();
    }
        // 动画效果执行
    public onShow(e:any) {
        rippleShow(e);
    }
}