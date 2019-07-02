<div w-class="page">
    {{if !it.showTag}}
        {{%=============1:关注  3:公众号===================}}
        {{if it.active==1 || it.active==3}}
        <div w-class="setting" on-tap="goManage">
            <img src="../../res/images/setting.png" w-class="img"/>
            <span style="flex:1 0 0;">我已关注 10人
                {{if it.active==3}}
                <span w-class="public">公众号</span>
                {{end}}
            </span>
            <img src="../../res/images/arrowRight.png" w-class="img"/>
        </div>
        {{end}}

        {{for i,v of it.postList}}
            {{if v.isPublic}}
            <widget w-tag="chat-client-app-view-home-pubPostItem" style="margin-top:20px;">{{v}}</widget>
            {{else}}
            <widget w-tag="chat-client-app-view-home-squareItem" style="margin-top:20px;">{{v}}</widget>
            {{end}}
        {{end}}
    {{else}}
    <div style="background:#fff;padding-bottom: 20px;">
        <div w-class="title">标签分类</div>
        <dv w-class="tagList">
            {{for i,v of it.tagList}}
            <div w-class="tag" on-tap="changeTag(e,{{i}})">{{v}}</div>
            {{end}}
        </dv>
    </div>
    {{end}}
</div>