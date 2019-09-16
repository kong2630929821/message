<div w-class="warper" id="newBox" class="new-page">
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
            {{: it1 = it1 || {friends:[]} }}
            <div w-class="contactList" >
                
                <div w-class="topic-wrap">
                    <div on-tap="goNext(0)" on-down="onShow">
                        <chat-client-app-view-contactList-contactItem>{text:"新的朋友", totalNew:{{it.newApply}}, img:"../../res/images/new-friend.png" }</chat-client-app-view-contactList-contactItem>
                    </div>
                    <div on-tap="goNext(1)" on-down="onShow">
                        <chat-client-app-view-contactList-contactItem>{text:"群聊", img:"../../res/images/groups.png"}</chat-client-app-view-contactList-contactItem>
                    </div>
                    <div on-tap="goNext(2)" on-down="onShow">
                        <chat-client-app-view-contactList-contactItem>{text:"公众号", img:"../../res/images/groups.png"}</chat-client-app-view-contactList-contactItem>
                    </div>
                </div>
                <div w-class="friendPart">
                    <div on-tap="goNext(3,{{it.sid}})"  on-down="onShow">
                        <chat-client-app-view-contactList-contactItem>{id: {{it.sid}}, chatType: "user"}</chat-client-app-view-contactList-contactItem>
                    </div>
                    {{for i,v of it1.friends}}
                        {{if it1.blackList.indexOf(v) == -1}}
                        <div on-tap="goNext(4,{{v}})" on-down="onShow">
                            <chat-client-app-view-contactList-contactItem>{id: {{v}}, chatType: "user"}</chat-client-app-view-contactList-contactItem>
                        </div>
                        {{end}}
                    {{end}}
                </div>
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
