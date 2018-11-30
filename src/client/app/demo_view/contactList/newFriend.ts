/**
 * 新朋友验证状态
 */
// ================================================ 导入
import { Forelet } from '../../../../pi/widget/forelet';
import { Widget } from '../../../../pi/widget/widget';
import { Contact } from '../../../../server/data/db/user.s';
import { Result } from '../../../../server/data/rpc/basic.s';
import { Logger } from '../../../../utils/logger';
import { acceptFriend } from '../../../app/net/rpc';
import * as store from '../../data/store';

// tslint:disable-next-line:no-reserved-keywords
declare var module;
export const forelet = new Forelet();
const WIDGET_NAME = module.id.replace(/\//g, '-');
const logger = new Logger(WIDGET_NAME);

// ================================================ 导出
export class NewFriend extends Widget {
    public ok:() => void;

    public goBack() {
        this.ok();
    }

    public agreeClick(e:any) {
        const v = parseInt(e.value,10);
        console.log(v);
        acceptFriend(v,true,(r:Result) => {
            // TODO:
        });
    }

}

// ================================================ 本地

store.register('contactMap', (r: Map<number, Contact>) => {
    // 这是一个特别的map，map里一定只有一个元素,只是为了和后端保持统一，才定义为map
    for (const value of r.values()) {
        forelet.paint(value);
    }    
});