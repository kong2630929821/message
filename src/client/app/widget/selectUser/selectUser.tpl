<div style="position:absolute;width:100%;height:100%;top:0px;left:0px;background-color:gray;">
    <div w-class="select-user-wrap" on-tap="changeSelect">
        <div w-class="slect-wrap">
            <div w-class="avator-wrap">
                <img w-class="avator" src="../../res/images/{{it.avatorPath}}" />
            </div>
            <span w-class="userName">{{it.userName}}</span>
            {{if it.isSelect}}
            <div w-class="select">
                <img w-class="selectIcon" src="../../res/images/error.png" />
            </div>
            {{end}}
        </div>
    </div>
</div>