<div w-class="page">
    {{if !it.showTag}}
        {{if it.active==1 || it.active==3}}
        <div w-class="setting">
            <img src="../../res/images/setting.png" w-class="img"/>
            <span style="flex:1 0 0;">
                我已关注 10人
                <span w-class="public">公众号</span>
            </span>
            <img src="../../res/images/squareArrow.png" w-class="img" style="transform: rotate(270deg);"/>
        </div>
        {{end}}
        
        {{for i,v of [1,2,3,4]}}
        <widget w-tag="chat-client-app-view-home-squareItem"></widget>
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