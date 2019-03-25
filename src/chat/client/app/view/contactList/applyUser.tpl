<div w-class="user-apply-wrap" on-tap="viewApplyDetail" on-down="onShow">
    <div w-class="avatar-wrap">
        <img w-class="avatar" src="../../res/images/user_avatar.png" />
    </div>
     <div w-class="user-info-wrap">
        <span w-class="userName">{{it.name}}</span>
        <span w-class="applyInfo">{{it.applyInfo}}</span>
    </div>
    {{if !it.isagree}}
    <span w-class="seeText" on-tap="agreenBtn">同意</span>
    {{else}}
    <span w-class="seeText" style="border:none;color: #888888;font-size: 28px;">已添加</span>
    {{end}}
</div>