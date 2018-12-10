/**
 * 单人聊天
 */

// ================================================ 导入
import { notify } from '../../../../pi/widget/event';
import { Widget } from '../../../../pi/widget/widget';
import { Logger } from '../../../../utils/logger';

// tslint:disable-next-line:no-reserved-keywords
declare var module;
const WIDGET_NAME = module.id.replace(/\//g, '-');
const logger = new Logger(WIDGET_NAME);

// ================================================ 导出
export class Emoji extends Widget {
    public props:Props;
    public ok:() => void;
    public process:(emoji:string) => void;
    constructor() {
        super();
        this.props = {
            emojis:EMOJIS
        };
    }
    public goBack() {
        this.ok();
    }
    public click(e:any,index:number) {
        // this.process(EMOJIS[index][0]);
        notify(e.node,'ev-emoji-click',EMOJIS[index][0]);
    }    
}
export let EMOJIS_MAP = new Map();

// ================================================ 本地
const EMOJIS = [
    ['微笑','0.gif','0.png'],
    ['撇嘴','1.gif','1.png'],
    ['色','2.gif','2.png'],
    ['发呆','3.gif','3.png'],
    ['得意','4.gif','4.png'],
    ['流泪','5.gif','5.png'],
    ['害羞','6.gif','6.png'],
    ['闭嘴','7.gif','7.png'],
    ['睡','8.gif','8.png'],
    ['大哭','9.gif','9.png'],
    ['尴尬','10.gif','10.png'],
    ['发怒','11.gif','11.png'],
    ['调皮','12.gif','12.png'],
    ['嗞牙','13.gif','13.png'],
    ['惊讶','14.gif','14.png'],
    ['难过','15.gif','15.png'],
    ['酷','16.gif','16.png'],
    ['冷汗','17.gif','17.png'],
    ['抓狂','18.gif','18.png'],
    ['吐','19.gif','19.png'],
    ['偷笑','20.gif','20.png'],
    ['可爱','21.gif','21.png'],
    ['白眼','22.gif','22.png'],
    ['傲慢','23.gif','23.png'],
    ['饥饿','24.gif','24.png'],
    ['困','25.gif','25.png'],
    ['惊恐','26.gif','26.png'],
    ['流汗','27.gif','27.png'],
    ['憨笑','28.gif','28.png'],
    ['大兵','29.gif','29.png'],
    ['奋斗','30.gif','30.png'],
    ['咒骂','31.gif','31.png'],
    ['疑问','32.gif','32.png'],
    ['嘘','33.gif','33.png'],
    ['晕','34.gif','34.png'],
    ['折磨','35.gif','35.png'],
    ['衰','36.gif','36.png'],
    ['骷髅','37.gif','37.png'],
    ['敲打','38.gif','38.png'],
    ['再见','39.gif','39.png'],
    ['擦汗','40.gif','40.png'],
    ['抠鼻','41.gif','41.png'],
    ['鼓掌','42.gif','42.png'],
    ['糗大了','43.gif','43.png'],
    ['坏笑','44.gif','44.png'],
    ['左哼哼','45.gif','45.png'],
    ['右哼哼','46.gif','46.png'],
    ['哈欠','47.gif','47.png'],
    ['鄙视','48.gif','48.png'],
    ['委屈','49.gif','49.png'],
    ['快哭了','50.gif','50.png'],
    ['阴险','51.gif','51.png'],
    ['亲亲','52.gif','52.png'],
    ['吓','53.gif','53.png'],
    ['可怜','54.gif','54.png'],
    ['菜刀','55.gif','55.png'],
    ['西瓜','56.gif','56.png'],
    ['啤酒','57.gif','57.png'],
    ['篮球','58.gif','58.png'],
    ['乒乓','59.gif','59.png'],
    ['咖啡','60.gif','60.png'],
    ['饭','61.gif','61.png'],
    ['猪头','62.gif','62.png'],
    ['玫瑰','63.gif','63.png'],
    ['凋谢','64.gif','64.png'],
    ['示爱','65.gif','65.png'],
    ['心','66.gif','66.png'],
    ['心碎','67.gif','67.png'],
    ['蛋糕','68.gif','68.png'],
    ['闪电','69.gif','69.png'],
    ['炸弹','70.gif','70.png'],
    ['刀','71.gif','71.png'],
    ['足球','72.gif','72.png'],
    ['瓢虫','73.gif','73.png'],
    ['便便','74.gif','74.png'],
    ['月亮','75.gif','75.png'],
    ['太阳','76.gif','76.png'],
    ['礼物','77.gif','77.png'],
    ['拥抱','78.gif','78.png'],
    ['强','79.gif','79.png'],
    ['弱','80.gif','80.png'],
    ['握手','81.gif','81.png'],
    ['胜利','82.gif','82.png'],
    ['抱拳','83.gif','83.png'],
    ['勾引','84.gif','84.png'],
    ['拳头','85.gif','85.png'],
    ['差劲','86.gif','86.png'],
    ['爱你','87.gif','87.png'],
    ['不','88.gif','88.png'],
    ['好','89.gif','89.png'],
    ['爱情','90.gif','90.png'],
    ['飞吻','91.gif','91.png'],
    ['跳跳','92.gif','92.png'],
    ['发抖','93.gif','93.png'],
    ['怄火','94.gif','94.png'],
    ['转圈','95.gif','95.png'],
    ['磕头','96.gif','96.png'],
    ['回头','97.gif','97.png'],
    ['跳绳','98.gif','98.png'],
    ['挥手','99.gif','99.png'],
    ['激动','100.gif','100.png'],
    ['街舞','101.gif','101.png'],
    ['献吻','102.gif','102.png'],
    ['左太极','103.gif','103.png'],
    ['右太极','104.gif','104.png']
];

EMOJIS.forEach((ele) => {
    EMOJIS_MAP.set(ele[0],ele[1]);
});

interface Props {
    emojis:string[][];
}
