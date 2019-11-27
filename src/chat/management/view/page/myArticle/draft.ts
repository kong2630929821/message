import { Widget } from '../../../../../pi/widget/widget';

interface Props {
    showDataList:DraftItem[];// 展示数据
}

interface DraftItem {
    banner:string;
    title:string;
    time:string;
}
/**
 * 草稿
 */
export class Draft extends Widget {
    public props:Props = {
        showDataList:[
            {
                banner:'../../../res/images/xianzhixiadao.png',
                title:'多元化的内容生态离不开每一位创作者的直播梦想和辛勤创作。',
                time:'2019-10-10'
            },
            {
                banner:'../../../res/images/xianzhixiadao.png',
                title:'多元化的内容生态离不开每一位创作者的直播梦想和辛勤创作。',
                time:'2019-10-10'
            },
            {
                banner:'../../../res/images/xianzhixiadao.png',
                title:'多元化的内容生态离不开每一位创作者的直播梦想和辛勤创作。',
                time:'2019-10-10'
            },
            {
                banner:'../../../res/images/xianzhixiadao.png',
                title:'多元化的内容生态离不开每一位创作者的直播梦想和辛勤创作。',
                time:'2019-10-10'
            },
            {
                banner:'../../../res/images/xianzhixiadao.png',
                title:'多元化的内容生态离不开每一位创作者的直播梦想和辛勤创作。',
                time:'2019-10-10'
            },
            {
                banner:'../../../res/images/xianzhixiadao.png',
                title:'多元化的内容生态离不开每一位创作者的直播梦想和辛勤创作。',
                time:'2019-10-10'
            }
        ]
    };
}