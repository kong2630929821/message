<div w-class="user-apply-wrap">
    <div w-class="avator-wrap">
        <img w-class="avator" src="../../res/images/user.png" />
    </div>
     <div w-class="user-info-wrap">
        <span w-class="userName">{{it.info.name}}</span>
        <span w-class="applyInfo">{{it.applyInfo}}</span>
    </div>
    {{if !it.isagree}}
    <span w-class="seeText" on-tap="agreenBtn">同意</span>
    {{else}}
    <span w-class="seeText" style="border:none;color: #888888;">已添加</span>
    {{end}}
</div>