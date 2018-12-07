/**
 * 单人聊天
 */

// ================================================ 导入
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
    public click(index:number) {
        this.process(EMOJIS[index][0]);
    }    
}
export let EMOJIS_MAP = new Map();

// ================================================ 本地
const EMOJIS = [
    ['smile','../../res/emoji/smile.gif'],
    ['angry','../../res/emoji/angry.gif']
];

EMOJIS.forEach((ele) => {
    EMOJIS_MAP.set(ele[0],ele[1]);
});

interface Props {
    emojis:string[][];
}
