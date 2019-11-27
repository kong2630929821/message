<div w-class="user-apply-wrap" on-tap="viewApplyDetail" on-down="onShow">
    <div w-class="avatar-wrap">
        <widget w-tag="chat-client-app-widget1-imgShow-imgShow" >{imgURL:{{it.avatar}},width:"80px;"}</widget>
    </div>
     <div style="flex: 1 0 0;">
        <div w-class="userName">
            <span>{{it.name}}&nbsp;</span>
            <img src="../../res/images/girl.png"/>
        </div>
        <div w-class="applyInfo">{{it.applyInfo}}</div>
    </div>
    {{if !it.isagree}}
    <div w-class="seeText" on-tap="agreenBtn" on-down="onShow">接受</div>
    {{else}}
    <div w-class="seeText" style="color: #222;background: #F2F2F2">已接受</div>
    {{end}}
</div>