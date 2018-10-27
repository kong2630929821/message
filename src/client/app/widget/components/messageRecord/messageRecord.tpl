<div style="position:absolute;width:100%;height:100%;top:0px;left:0px;background-color:gray;">
            <div w-class="message-record-wrap">
                <div w-class="avator-wrap">
                    <img w-class="avator" src="../../../res/images/{{it.avatorPath}}" />
                </div>
                <div w-class="user-info-wrap">
                    <div w-class="info-wrap">
                        {{if it.resIconPath}}
                        <img w-class="resIcon" src="../../../res/images/{{it.resIconPath}}" />
                        {{end}}
                        <span w-class="userName">{{it.userName}}</span>
                    </div>
                    <span w-class="recordInfo">{{it.recordInfo}}</span>
                </div>
                <span w-class="recordTime">{{it.recordTime}}</span>
            </div>
    </div>