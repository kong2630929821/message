<div w-class="select-user-wrap" on-tap="changeSelect">
    <div w-class="slect-wrap">
        <div w-class="avatar-wrap">
            <img w-class="avatar" src="{{it.avatar?it.avatar:'../../res/images/user_avatar.png'}}" />
        </div>
        <span w-class="userName">{{it.name}}</span>
        {{if it.isSelect}}
         <img w-class="selectIcon" src="../../res/images/selected.png" />
        {{end}}
    </div>
</div>
