/**
 * 设置密码输入组件
 * {length:8,tips:"",limit:1,placeHolder:"密码"}
 * length：密码设置的最短长度，默认8
 * tips:下方提示语句
 * imit:强度限制，只限制长度传1，长度加两种数据类型传2，默认是1
 * placeHolder：输入框中提示文字
 * 监听 ev-psw-change 事件，event.password 获取密码值,event.success 获取当前密码是否符合规则
 */
// ================================ 导入
import { Json } from '../../../../pi/lang/type';
import { notify } from '../../../../pi/widget/event';
import { getRealNode } from '../../../../pi/widget/painter';
import { Widget } from '../../../../pi/widget/widget';

// ================================ 导出
interface Props {
    length?:number;
    limit?:number;
    tips?:string;
    placeHolder?:string;
}
export class ImgRankItem extends Widget {
    public ok: () => void;
    public props:Props;
    constructor() {
        super();
    }

    public setProps(props: Json, oldProps: Json) {
        super.setProps(props,oldProps);
        this.state = {
            password:'',   // 密码
            rePassword:'',  // 重复密码
            secret:0,   // 密码强度
            showTips:true,   // 显示规则提示
            pswSuccess:false,  // 密码符合规则
            repSuccess:false,  // 重复密码符合规则
            showIconPsw:false,  // 密码显示图标
            showIconRep:false,  // 重复密码显示图标
            showPsw:false,  // 明文显示密码
            showRep:false  // 明文显示重复密码
        };
    }

    public backPrePage() {
        this.ok && this.ok();
    }

    /**
     * 密码输入状态变化
     */
    public pswChange(event:any) {
        const psw = event.value;
        this.state.password = psw;
        this.state.showIconPsw = true;       
        let secret = 0; 
        const limit = this.props.limit ? this.props.limit :1;
        const length = this.props.length ? this.props.length :8;
        
        if (psw.length < length && psw.length > 0) {
            secret = 1; 
            this.state.showTips = true;
            this.state.pswSuccess = false;
        } else {
            secret = this.strongJudge(psw);
        }

        if (limit === 1 && psw.length >= length) { // 符合最小长度限制
            this.state.showTips = false;
            this.state.pswSuccess = true;
            notify(event.node,'ev-psw-change',{ password:psw,success:true });
        } else if (limit === 2 && secret > 1) {  // 符合最小长度和包含两种数据类型以上限制
            this.state.showTips = false;
            this.state.pswSuccess = true;
            notify(event.node,'ev-psw-change',{ password:psw,success:true });
        } else {  // 不符合规则限制
            notify(event.node,'ev-psw-change',{ password:psw,success:false });
        }
        this.state.secret = secret > 3 ? 3 :secret; // 只有三种强度水平显示
        this.paint();
    }

    /**
     * 重复密码输入状态变化
     */
    public repChange(event:any) {
        const rep = event.value;
        this.state.rePassword = rep;
        this.state.showIconRep = true;     
        if (this.state.password === rep) {
            this.state.repSuccess = this.state.pswSuccess;
        } else {
            this.state.repSuccess = false;
        }
        this.paint();
    }

    /**
     * 选中密码输入框后图标切换
     */
    public pswIconChange() {
        if (this.state.password !== '') {
            this.state.showIconPsw = true;
        } else {
            this.state.showIconPsw = false;
        }
        this.paint();
    }

    /**
     * 选中重复密码输入框后图标切换
     */
    public repIconChange() {
        if (this.state.rePassword !== '') {
            this.state.showIconRep = true;
        } else {
            this.state.showIconRep = false;
        }
        this.paint();
    }

    /**
     * 密码明密文切换
     */
    public isShowPsw() {
        this.state.showPsw = !this.state.showPsw;
        const input = getRealNode(this.tree).getElementsByTagName('input')[0];
        input.setAttribute('type',this.state.showPsw ? 'text' :'password');
        this.paint();
    }

    /**
     * 重复密码明密文切换
     */
    public isShowRep() {
        this.state.showRep = !this.state.showRep;
        const input = getRealNode(this.tree).getElementsByTagName('input')[1];
        input.setAttribute('type',this.state.showRep ? 'text' :'password');
        this.paint();        
    }

    /**
     * 清空密码输入框
     */
    public clearPsw() {
        this.state.password = '';
        this.state.secret = 0;
        const input = getRealNode(this.tree).getElementsByTagName('input')[0];
        input.value = '';
    }
    /**
     * 清空重复密码输入框
     */
    public clearRep() {
        this.state.rePassword = '';
        const input = getRealNode(this.tree).getElementsByTagName('input')[1];
        input.value = '';
    }

    /**
     * 判断密码强度
     * @param psw 密码
     */
    public strongJudge(psw:string) {
        const reg1 = /[0-9]+/; 
        const reg2 = /[a-z]+/; 
        const reg3 = /[A-Z]+/;
        const reg4 = /[!"#$%&'()*+,\-./:;<=>?@\[\]^_`{\|}~]+/; // 特殊字符集
        let num = 0;
        if (reg1.test(psw)) {
            num++;
        }
        if (reg2.test(psw)) {
            num++;
        }
        if (reg3.test(psw)) {
            num++;
        }
        if (reg4.test(psw)) {
            num++;
        }
        
        return num;
    }
}
