import { Widget } from '../../../../../pi/widget/widget';

interface Props {
    showDataList:any;// 表格数据
    showTitleList:string[];// 表格标题
}

/**
 * 查询用户
 */
export class QueryUser extends Widget {
    public props:Props = {
        showDataList:[[
            '用户昵称用户昵称用户昵称','10001','17555555544','2015-05-42 14:20','个人'
        ]],
        showTitleList:['昵称','ID','手机号','注册时间','身份']
    };
}