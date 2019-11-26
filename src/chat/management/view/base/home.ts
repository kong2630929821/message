/**
 * 默认数据库
 */

// ================================================ 导入
import { popNew } from '../../../../pi/ui/root';
import { Forelet } from '../../../../pi/widget/forelet';
import { Widget } from '../../../../pi/widget/widget';
import { rippleShow } from '../../utils/tools';

// ================================================ 导出
export const forelet = new Forelet();

interface Props {
    activePage: any;  // 当前活跃的页面
    pageList: any[]; // 默认过滤器
    rightBox:boolean;  // 是否显示rightbox页面
    secondaryPage:boolean;// 是否有二级页面
}
const PAGE = {
    article:'article-articleReview',// 文章审核
    complaint:'complaint-toBeProcessed',// 投诉
    official:'official-officialCertification',// 官方账号认证
    queryUser:'user-queryUser',// 查询用户
    officialUser:'user-officialUser',// 官方账号列表
    customerService:'user-customerService',// 客服管理
    changePassword:'user-changePassword',// 修改密码
    application:'application-thirdApplication',// 第三方应用管理
    recommendApplication:'application-recommendApplication',// 推荐应用
    addApplication:'application-addApplication',// 添加应用
    newArticle:'myArticle-newArticle',// 新文章
    draft:'myArticle-draft',// 草稿
    published:'myArticle-published',// 已发布
    notReviewed:'myArticle-notReviewed'// 未过审
};

// tslint:disable-next-line:completed-docs
export class Home extends Widget {
    public ok: () => void;
    public props: Props;
    constructor() {
        super();
        this.props = {
            pageList: [
                { name: '文章管理', page: PAGE.article, img:'chart.png',show:false },
                { name: '投诉管理', page: PAGE.complaint, img:'chart.png', show:false },
                { name: '官方账号认证', page: PAGE.official, img:'chart.png', show:false },
                { name: '用户管理', page: PAGE.queryUser, img:'chart.png', show:false,children:[
                    { name:'查询用户',page:PAGE.queryUser },
                    { name:'官方账号列表',page:PAGE.officialUser },
                    { name:'客服管理',page:PAGE.customerService },
                    { name:'修改密码',page:PAGE.changePassword }
                ] },
                {name:'第三方应用管理',page:PAGE.application,img:'chart.png',show:false,children:[
                    { name:'应用列表',page:PAGE.application },
                    { name:'推荐应用',page:PAGE.recommendApplication },
                    { name:'添加应用',page:PAGE.addApplication }

                ]},
                {name:'我的文章',page:PAGE.newArticle,img:'chart.png',show:false,children:[
                    { name:'新文章',page:PAGE.newArticle },
                    { name:'草稿',page:PAGE.draft },
                    { name:'已发布',page:PAGE.published },
                    { name:'未过审',page:PAGE.notReviewed }

                ]}

            ],
            activePage: {},
            rightBox:true,
            secondaryPage:false
        };
        this.props.activePage = this.props.pageList[0];
    }

    // 切换默认过滤器页面
    public changePage(num: number) {
        const res = this.props.pageList[num];
        // 是否展开子页面
        if (res.children && res.children.length > 0) {
            res.show = !res.show;
            this.props.activePage = res.children[0];
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

    public goBack() {
        this.props.secondaryPage = false;
        this.paint();
    }

    public showSecondaryPage() {
        this.props.secondaryPage = true;
        this.paint();
    }
    // 动画效果执行
    public onShow(e:any) {
        rippleShow(e);
    }

    // 退出登录
    public exit() {
        popNew('chat-management-view-base-login');
    }
}