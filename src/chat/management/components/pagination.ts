/**
 * 分页
 */
// ===========================导入=================
import { notify } from '../../../pi/widget/event';
import { Widget } from '../../../pi/widget/widget';
import { rippleShow } from '../utils/tools';

// =================================导出==============
interface Props {
    currentIndex:number; // 初始页
    pagesList:number[]; // 默认页数
    pages:number; // 总共页数
    numberCheck:any;// 每页展示多少条数据
    numberCheckActiveIndex:number;// 状态筛选当前下标
    expand:boolean;
    perPageIndex:number;// 每页多少个下标 
}
// 每页多少数据
export const perPage = [20,50,100];
// tslint:disable-next-line:completed-docs
export class Pagination extends Widget {
    public props:Props = {
        currentIndex:0,
        pagesList:[0,1,2,3,4],
        pages:1,
        numberCheck:[],
        numberCheckActiveIndex:0,
        expand:false,
        perPageIndex:0
    };
    // 创建判断显示的页数
    public setProps(props:any) {
        this.props = {
            ...this.props,
            ...props
        };
        super.setProps(this.props);
        this.props.pagesList = [0,1,2,3,4];
        if (this.props.pages < 4) {
            this.props.pagesList.splice(this.props.pages);
        } else if (this.props.currentIndex > 4) {
            this.props.pagesList = [this.props.currentIndex];
            for (let i = 1;i < 5;i++) {
                this.props.pagesList.unshift(this.props.currentIndex - i);
            }
        } 
        const timeType = [
            {
                status:0,
                text:perPage[0]
            },{
                status:1,
                text:perPage[1]
            },{
                status:2,
                text:perPage[2]
            }
        ];
        this.props.numberCheck = timeType;
        console.log('=============总页数',this.props);
    }
    // 上一页
    public prep(event:any) {
        if (this.props.currentIndex === 0) {
            return;
        } else if (this.props.currentIndex <= this.props.pagesList[0]) {
            this.props.currentIndex--;
            this.props.pagesList.pop();
            this.props.pagesList.unshift(this.props.currentIndex);
        } else {
            this.props.currentIndex--;
        }
        notify(event.node,'ev-changeCurrent',{ value:this.props.currentIndex });
        this.paint();
    }

    // 下一页
    public next(event:any) {
        if (this.props.currentIndex + 1 === this.props.pages) {
     
            return;
        } else if (this.props.currentIndex >= 4 && this.props.pagesList.indexOf(this.props.currentIndex + 1) === -1) {
            this.props.currentIndex++;
            this.props.pagesList.shift();
            this.props.pagesList.push(this.props.currentIndex);
        } else {
            this.props.currentIndex++;
        }
        notify(event.node,'ev-changeCurrent',{ value:this.props.currentIndex });
        this.paint();
        
    }

    // 点击页数
    public currentClick(event:any,index:number) {
        this.props.currentIndex = index;
        notify(event.node,'ev-changeCurrent',{ value:this.props.currentIndex });
        this.paint();
    }

    // 首页尾页
    public goto(fg:number,e:any) {
        let index = 0;
        let t = this.props.pages - 1;
        if (fg === 1) {
            // 首页
            let j = 0;
            this.props.pagesList = [];
            for (let i = 0;i < 5;i++) {
                if (j > t || j > 4) {
                    break; 
                }
                this.props.pagesList.push(j++);
                this.paint();
            }
        }
        if (fg === 2) {
            // 尾页
            index = this.props.pages - 1;
            this.props.pagesList = [];
            for (let i = 0;i < 5;i++) {
                if (t < 0) {
                    break; 
                }
                this.props.pagesList.unshift(t--);
            }
            this.paint();
        }
        this.currentClick(e,index);
    }
    
    // 每页多少条数据
    public filterTimeType(e:any) {
        this.props.currentIndex = 0;
        this.paint();
        notify(e.node,'ev-perPage',{ value:perPage[e.activeIndex],index:e.activeIndex });
    }

    // 过滤器
    public expand(e:any) {
        notify(e.node,'ev-expand',{ value:e.value });
        this.paint();
    }

    // 动画效果执行
    public onShow(e:any) {
        rippleShow(e);
    }
}