
<div w-class="auto" on-tap="pageClick" id="squarePage" on-scroll="scrollPage">
    <div id="squareContain" style="background: white;">
    {{if !it.showTag}}
        {{%=============1:关注  2:公众号===================}}
        {{if it.active==1 || it.active==2}}
        <div w-class="setting" on-tap="goManage">
            <img src="../../res/images/setting.png" w-class="img"/>
            <span style="flex:1 0 0;">我已关注 {{it.follows.length}}人
                {{if it.active==2}}
                <span w-class="public">公众号</span>
                {{end}}
            </span>
            <img src="../../res/images/arrowRight.png" w-class="img"/>
        </div>
        {{end}}

        {{for i,v of it1.postList}}
        <div ev-goDetail="goDetail({{i}})" ev-tools-expand="expandTools(e,{{i}})" ev-closeTools="pageClick">
            {{if v.isPublic}}
            <widget w-tag="chat-client-app-view-home-pubPostItem">{{v}}</widget>
            {{else}}
            <div ev-likeBtn="likeBtn({{i}})" ev-commentBtn="commentBtn({{i}})" ev-delBtn="delPost({{i}})">
                <widget w-tag="chat-client-app-view-home-squareItem">{{it.dealData(v,it.expandItem == i)}}</widget>
            </div>
            {{end}}
        </div>
        {{end}}
    {{else}}
        <div style="background:#fff;padding-bottom: 20px;">
            <div w-class="title">标签分类</div>
            <dv w-class="tagList">
                {{for i,v of it.tagList}}
                <div w-class="tag" on-tap="changeTag({{i}},e)">{{v}}</div>
                {{end}}
            </dv>
        </div>
    {{end}}
    </div>
</div>
