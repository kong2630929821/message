<div style="background: none;">
    <div w-class="pswInput" ev-input-change="pswChange" ev-input-focus="pswIconChange">
        <div style="flex: 1">
            <chat-client-app-widget1-input-input>{itype:"password",placeHolder:{{it.placeHolder?it.placeHolder:"密码"}},input:{{it1.password}} }</chat-client-app-widget1-input-input>
        </div>
        {{if it1.pswSuccess}}
        <img src="../../res/images/icon_right2.png" w-class="successPic"/>
        {{elseif it1.showIconPsw}}
        <img src="../../res/images/close_blue.png" w-class="successPic" on-tap="clearPsw"/>
        {{end}}
        <img src="../../res/images/{{it1.showPsw?'openEyes.png':'closeEyes.png'}}" w-class="successPic" on-tap="isShowPsw"/>
    </div>

    <div style="display: flex;flex: 3;">
        <div w-class="line line{{it1.secret>0?it1.secret:''}}"></div>
        <div w-class="line line{{it1.secret>1?it1.secret:''}}"></div>
        <div w-class="line line{{it1.secret>2?it1.secret:''}}"></div>
    </div>

    {{if it1.showTips}}
    <div w-class="tips">{{it.tips ? it.tips : "至少8位字符，可包含英文、数字、特殊字符！"}}</div>
    {{end}}

    <div w-class="pswInput" ev-input-change="repChange" ev-input-focus="repIconChange">
    <div style="flex: 1">
        <chat-client-app-widget1-input-input>{itype:"password",placeHolder:"重复密码",input:{{it1.rePassword}} }</chat-client-app-widget1-input-input>
    </div>
    {{if it1.repSuccess}}
    <img src="../../res/images/icon_right2.png" w-class="successPic"/>
    {{elseif it1.showIconRep}}
    <img src="../../res/images/close_blue.png" w-class="successPic" on-tap="clearRep"/>
    {{end}}
    <img src="../../res/images/{{it1.showRep?'openEyes.png':'closeEyes.png'}}" w-class="successPic" on-tap="isShowRep"/>
</div>
</div>