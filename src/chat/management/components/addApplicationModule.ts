import { Widget } from '../../../pi/widget/widget';
import { buildupImgPath, rippleShow } from '../../client/app/logic/logic';
import { deepCopy, getStore } from '../store/memstore';
import { popNewMessage } from '../utils/logic';
import { ListItem } from '../view/page/application/thirdApplication';

interface Props {
    title:string;
    input:string;
    appItem:ListItem;
    checked:boolean;
    appList:ListItem[];
    buildupImgPath:any;  // 组装图片路径
}
/**
 * 搜索应用
 */
export class AddApplicationModule extends Widget {
    public ok:(appId?:string) => void;
    public cancel:() => void;
    public props:Props = {
        title:'添加推荐应用',
        input:'',
        appItem:{
            accId: '',
            appid: '',
            buttonMod: 1,
            desc: '',
            groupId: '',
            img: ['','','',''],
            screenMode: '',
            subtitle:'' ,
            title:'',
            url:'',
            webviewName: '',
            time:''
        },
        checked:false,
        appList:[
            {
                accId: '',
                appid: '',
                buttonMod: 1,
                desc: '',
                groupId: '',
                img: ['','','',''],
                screenMode: '',
                subtitle:'' ,
                title:'',
                url:'',
                webviewName: '',
                time:''
            }
        ],
        buildupImgPath:buildupImgPath
    };

    public setProps(props:any) {
        this.props = {
            ...this.props,
            ...props
        };
        super.setProps(this.props);
        const appList = getStore('appList',[]);
        const hotApp = getStore('hotApp',[]);
        const recommend = getStore('recommendApp',[]);
        const used = [...hotApp,...recommend];// 已经使用的app
        const lave  = deepCopy(appList);// 剩余app
        lave.forEach((v,i) => {
            if (used.find(item => item.appid === v.appid)) {
                appList.splice(i,1);
            }
        });
        this.props.appList = appList;
    }

    public exitBtn() {
        this.cancel && this.cancel();
    }

    public okBtn() {
        const appId = this.props.appItem.appid;
        if (!this.props.checked) {
            popNewMessage('请选择一个应用');

            return;
        } 
        this.ok && this.ok(appId);
    }

    public inputChange(e:any) {
        this.props.input = e.value;
    }
    /**
     * 搜索
     */
    public search() {
        const arr:ListItem = this.props.appList.find(item => item.title === this.props.input || item.appid === this.props.input);
        if (arr) {
            this.props.appItem = arr ;
        }
        this.paint();
    }
    // 动画效果执行
    public onShow(e:any) {
        rippleShow(e);
    }

    /**
     * 切换选中
     */
    public check() {
        this.props.checked = !this.props.checked;
        this.paint();
    }
}