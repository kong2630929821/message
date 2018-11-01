<div>
    <div w-class="pswInput" ev-input-change="pswChange" ev-input-focus="iconChange()">
        <div style="flex: 1">
            <client-app-widget-input-input w-class="pwInput">{itype:{{it.type}},placeHolder:"密码",input:{{it1.password}},isSuccess:{{it1.isSuccess}},clearable:true,style:"font-size:32px;color:#318DE6" }</client-app-widget-input-input>
        </div>
        
    </div>

    <div style="display: flex;flex: 3;">
        <div w-class="line line{{it1.secret>0?it1.secret:''}}"></div>
        <div w-class="line line{{it1.secret>1?it1.secret:''}}"></div>
        <div w-class="line line{{it1.secret>2?it1.secret:''}}"></div>
    </div>

    {{if it1.showTips}}
    <div w-class="tips">{{it.tips ? it.tips : "至少8位字符，可包含英文、数字、特殊字符！"}}</div>
    {{end}}
</div>