import { popModalBoxs } from '../../../../../pi/ui/root';
import { Widget } from '../../../../../pi/widget/widget';
import { buildupImgPath } from '../../../../client/app/logic/logic';
import { getStore, setStore } from '../../../store/memstore';
import { timestampFormat } from '../../../utils/logic';

interface Props {
    showDataList:DraftItem[];// 展示数据
    buildupImgPath:Function; // 解析图片地址
    status:boolean; // 当前是否进入编辑状态
    currenetData:object; // 当前操作的数据
    timeFormat:Function; // 时间处理,
}

interface DraftItem {
    bannerImg:string;
    title:string;
    time:string;
    
}
/**
 * 草稿
 */
export class Draft extends Widget {
    public props:Props = {
        showDataList:[
        ],
        buildupImgPath:buildupImgPath,
        status:false,
        currenetData:{},
        timeFormat:timestampFormat
    };
    // tslint:disable-next-line:no-unnecessary-override
    public create() {
        super.create();
        this.props.showDataList = getStore('draft');
        console.log(this.props.showDataList);
    }

    // 编辑草稿
    public editDraft(i:number) {
        this.props.currenetData = this.props.showDataList[i];
        this.props.status = !this.props.status;
        console.log(this.props.currenetData);
        this.paint();
    }
    public deleteDraft(k:number) {
        popModalBoxs('chat-management-components-confirmBox', { title:'删除草稿',prompt:'删除草稿后你将无法找回文章信息。',invalid: -1 },() => {
            this.props.showDataList.splice(k,1);
            setStore('draft',this.props.showDataList);
            this.paint();
        });
    }
    // 返回
    public goBack(e:any) {
        // fg判斷是否需要刷新頁面數據
        this.props.status = !this.props.status;
        this.paint();
    }
}
