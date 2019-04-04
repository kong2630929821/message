<div w-class="user-apply-wrap" on-tap="viewApplyDetail" on-down="onShow">
    <div w-class="avatar-wrap">
        <widget w-tag="chat-client-app-widget-imgShow-imgShow" w-class="avatar" >{imgURL:{{it.avatar}},width:"80px;"}</widget>
    </div>
     <div w-class="user-info-wrap">
        <span w-class="userName">{{it.name}}</span>
        <span w-class="applyInfo">{{it.applyInfo}}</span>
    </div>
    {{if !it.isagree}}
    <span w-class="seeText" on-tap="agreenBtn">加好友</span>
    {{else}}
    <span w-class="seeText" style="border:none;color: #888888;font-size: 28px;">已添加</span>
    {{end}}
</div>