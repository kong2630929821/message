<div w-class="select-user-wrap">
    <div w-class="slect-wrap">
        <div w-class="avator-wrap">
            <img w-class="avator" src="../../res/images/user.png" />
        </div>
        <span w-class="userName">{{it.uid}}</span>
        {{if it.isSelect}}
         <img w-class="selectIcon" src="../../res/images/selected.png" />
        {{end}}
    </div>
</div>
