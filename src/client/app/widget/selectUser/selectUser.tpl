<div w-class="select-user-wrap" on-tap="changeSelect">
    <div w-class="slect-wrap">
        <div w-class="avator-wrap">
            <img w-class="avator" src="../../res/images/user.png" />
        </div>
        <span w-class="userName">{{it.name}}</span>
        {{if it.isSelect}}
         <img w-class="selectIcon" src="../../res/images/selected.png" />
        {{end}}
    </div>
</div>
