/**
 * 随机获取名字组件
 */
// ================================ 导入
import { getRealNode } from '../../../../pi/widget/painter';
import { Widget } from '../../../../pi/widget/widget';
import { nameWare } from './nameWareHouse';
import { notify } from '../../../../pi/widget/event';

// ================================ 导出

export class RandomName extends Widget {
    public ok: () => void;

    public create() {
        super.create();
        this.state = {
            name:this.playerName() 
        };
    }

    public backPrePage() {
        this.ok && this.ok();
    }

    /**
     * 名字改变
     */
    public nameChange(e: any) {
        this.state.name = e.value;
        notify(e.node,'ev-rName-change',{value:e.value});
        this.paint();
    }

    /**
     * 随机获取新名字
     */
    public randomPlayName() {
        this.state.name = this.playerName();
        const img = getRealNode(this.tree).getElementsByTagName('img')[0];
        img.classList.add('random');
        setTimeout(() => {
            img.classList.remove('random');
            this.paint();            
        }, 1000);
    }
    
    /**
     * 获取随机名字
     */
    public playerName() {
        const num1 = nameWare[0].length;
        const num2 = nameWare[1].length;
        let name = '';
        // tslint:disable-next-line:max-line-length
        name = this.unicodeArray2Str(nameWare[0][Math.floor(Math.random() * num1)]) + this.unicodeArray2Str(nameWare[1][Math.floor(Math.random() * num2)]);
        
        return name;
    }

    /**
     * unicode数组转字符串
     */
    public unicodeArray2Str(arr:any) {
        let str = '';
        if (!arr || typeof arr === 'string') {  // 如果本身不存在或是字符串则直接返回
            return str;
        }
        
        for (let i = 0; i < arr.length; i++) {
            str += String.fromCharCode(arr[i]);
        }

        return str;
    }
}
