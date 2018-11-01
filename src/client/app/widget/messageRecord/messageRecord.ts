/*
** messageRecord 组件相关处理
**
*/

// ===========================导入
import { Widget } from "../../../../pi/widget/widget"

interface Props {
    avatorPath: string;// 头像
    isGroupMessage: boolean;// 标志来源是否是群消息
    name: string;//用户名或群名
    recordInfo: string; // 简短的消息记录
    recordTime: string;//消息记录时间
    isNotDisturb: boolean;//是否免打扰
    unReadCount: number;//未读条数
}


// ===========================导出
export class MessageRecord extends Widget {
    props = {
        avatorPath: "emoji.png",
        isGroupMessage: true,
        name: "Evan Wood",
        recordInfo: "给我发个红包看看",
        recordTime: "18:30",
        isNotDisturb: true,
        unReadCount: 27
    } as Props
}

