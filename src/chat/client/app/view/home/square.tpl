<div w-class="warper" id="squareBox" class="new-page">
    <div w-class="inner">
        <div w-class="pulldown-wrapper">
            {{if it.createPullDown}}
                {{if it.beforePullDown}}
                    <div>
                        <span>下拉刷新</span>
                    </div>
                {{else}}
                    {{if !it.beforePullDown}}
                    <div>
                        {{if it.isPullingDown}}
                        <div>
                            <span>正在刷新</span>
                        </div>
                        {{else}}
                        <div><span>刷新成功</span></div>
                        {{end}}
                    </div>
                    {{end}}
                {{end}}
            {{end}}
        </div>

        <div w-class="history-wrap">
            <div>
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

        {{if it.createPullUp}}
        <div  w-class="pullup-wrapper">
            {{if !it.isPullUpLoad}}
            <div  w-class="before-trigger">
                <span  w-class="pullup-txt">Pull up and load more</span>
            </div>
            {{else}}
            <div  w-class="after-trigger">
                <span  w-class="pullup-txt">Loading...</span>
            </div>
            {{end}}
        </div>
        {{end}}
    </div>
</div>