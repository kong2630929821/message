// tslint:disable-next-line:missing-jsdoc
import { notify } from '../../../pi/widget/event';
import { Widget } from '../../../pi/widget/widget';
import { rippleShow } from '../utils/tools';

interface Props {
    title:any[];// 表格标题
    datas:any[];// 表数据
    selectList:any[];// 选择框列表
    allChecked:boolean;// 全选
    needCheckBox:boolean; // 是否需要选择框
    btn1:string;
    btn2:string;
    inlineBtn1:string;
    inlineBtn2:string;
    inlineBtn3:string;
    inputFile:string;
    color:boolean;
    auto:boolean;
    img:boolean;
    btnGroup:any;
}
// tslint:disable-next-line:completed-docs
export class Table extends Widget {
    public props:Props = {
        title:[],
        datas:[],
        selectList:[],
        allChecked:false,
        needCheckBox:true,
        btn1:'',
        btn2:'',
        inlineBtn1:'',
        inlineBtn2:'',
        inlineBtn3:'',
        inputFile:'',
        color:false,
        auto:false,
        img:false,
        btnGroup:[]
    };
    
    public setProps(props:any) {
        this.props = {
            ...this.props,
            ...props
        };
        super.setProps(this.props);
    }
    
    // 全选整页
    public allChecked() {
        this.props.allChecked = !this.props.allChecked;
        this.props.selectList = [];
        if (this.props.allChecked) {
            for (let i = 0;i < this.props.datas.length;i++) {
                this.props.selectList.push(i);
            }
        }
        this.paint();
    }

    // 选中对应的行
    public checked(index:number) {
        const ind = this.props.selectList.indexOf(index);
        if (ind === -1) {
            this.props.selectList.push(index);
        } else {
            this.props.allChecked = false;
            this.props.selectList.splice(ind,1);
        }
        this.paint();
    }

    // 点击下方按钮
    public clickBtn(e:any,fg:number) {
        notify(e.node,'ev-table-btnClick',{ fg:fg,value:this.props.selectList });
    }

    // 查看详情
    public goDetail(e:any,num:number,fg:number) {
        notify(e.node,'ev-table-detail',{ value:this.props.datas[num], fg:fg,num:num });
    }

    // 导入excel
    public importExcel(e:any,num:number) {
        console.log('123123');
        notify(e.node,'ev-table-detail',{ value:num });
    }
    // 表格操作按钮
    public reDetail(e:any,num:number,fg:number) {
        notify(e.node,'ev-table-redetail',{ value:this.props.datas[num], fg:fg,num:num }); 
    }   
    
    // 动画效果执行
    public onShow(e:any) {
        rippleShow(e);
    }

}
