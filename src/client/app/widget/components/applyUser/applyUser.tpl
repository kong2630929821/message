<div style="position:absolute;width:100%;height:100%;top:0px;left:0px;background-color:gray;">
    {{for index,item of it.applyUserList}}
        <div w-class="user-apply-wrap">
            <div w-class="avator-wrap">
                <img w-class="avator" src="../../../res/images/{{item.avatorPath}}" />
            </div>
            <div w-class="user-info-wrap">
                <span w-class="userName">{{item.userName}}</span>
                <span w-class="applyInfo">{{item.applyInfo}}</span>
            </div>
            <span w-class="{{item.isAgree ? 'agreeText' : 'disagreeText'}}">{{item.isAgree ? "已同意" : "同意"}}</span>
        </div>
    {{end}}
</div>