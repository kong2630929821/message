import { Widget } from '../../../../../pi/widget/widget';
import { buildupImgPath } from '../../../../client/app/logic/logic';
import { getStore, setStore } from '../../../store/memstore';

interface Props {
    showDataList:DraftItem[];// 展示数据
    buildupImgPath:any;
    status:boolean; 
    currenetData:any; // 当前操作的数据
    inEdit:boolean; // 是否进入编辑
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
        inEdit:false
    };
    // tslint:disable-next-line:no-unnecessary-override
    public create() {
        super.create();
        this.props.showDataList = getStore('draft');
    }

    // 编辑草稿
    public editDraft(i:number) {
        this.props.currenetData = this.props.showDataList[i];
        this.props.status = !this.props.status;
        console.log(this.props.currenetData);
        this.paint();
    }
    public deleteDraft(k:number) {
        this.props.showDataList.splice(k,1);
        setStore('draft',this.props.showDataList);
        this.paint();
    }
    // 返回
    public goBack(e:any) {
        // fg判斷是否需要刷新頁面數據
        this.props.status = !this.props.status;
        this.paint();
    }
}
