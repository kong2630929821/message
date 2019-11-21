import { Widget } from '../../../../../pi/widget/widget';
import { perPage } from '../../../components/pagination';

interface Props {
    dataList:any[];
    showTitleList:string[];
    sum:number;// 数据条数
    perPage:number;// 每页显示多少条数据
    currentIndex:number;// 当前页数
    expandIndex:boolean;// 控制分页显示隐藏
    perPageIndex:number;// 每页显示多少个的下标
    showDataList:any[];
}

/**
 * 查询用户
 */
export class OfficialCertification extends Widget {
    public props:Props = {
        dataList:[
            ['用户昵称用户昵称用户昵称','10001','17555555544','2015-05-42 14:20','个人']
        ],
        showTitleList:['昵称','ID','手机号','注册时间','绑定应用'],
        sum:20,
        perPage:perPage[0],
        currentIndex:0,
        expandIndex:false,
        perPageIndex:0,
        showDataList:[]
    };

    public create() {
        super.create();
        this.props.showDataList = this.props.dataList.slice(0,this.props.perPage);
    }
}