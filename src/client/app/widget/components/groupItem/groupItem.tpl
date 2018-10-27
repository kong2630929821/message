<div style="position:absolute;width:100%;height:100%;top:0px;left:0px;background-color:gray;">
        <div w-class="group-item-wrap">
            <div w-class="avator-wrap">
                <img w-class="avator" src="../../../res/images/{{it.groupAvatorPath}}" />
            </div>
            <div w-class="group-info-wrap">
                <div w-class="info-wrap">
                    <img w-class="resIcon" src="../../../res/images/emoji.png" />
                    <span w-class="groupName">{{it.groupName}}（{{it.groupNum}}）</span>
                </div>
                <span w-class="groupNo">群号：{{it.groupNo}}</span>
            </div>
            {{if it.isJoin}}
            <span w-class="isJoinText">已加入</span>
            {{end}}
        </div>
</div>