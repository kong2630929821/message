<div w-class="warper" id="outBox">
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
        <div w-class="history-wrap" >
            {{%<!-- <div w-class="input" on-tap="goSearch">
                <div w-class="searchBox">用户名/ID/手机号</div>
                <img w-class="searchIcon" src="../../res/images/search-gray.png" />
            </div> -->}}
            {{if it1.lastChat && it1.lastChat.length == 0}}
            <div style="text-align: center;">
                <img src="../../res/images/chatEmpty.png" w-class="emptyImg"/>
                <div w-class="emptyText">快开始聊天吧~</div>
            </div>
            {{else}}
                {{if it1.lastChat}}
                <div>
                    {{for i,v of it1.lastChat}}
                    <div ev-chat="chat({{i}},e)" ev-msgCard-utils="changeUtils(e,{{i}})" >
                        <widget w-tag="chat-client-app-view-home-messageCard">{rid:{{v[0]}},time:{{v[1]}},chatType:{{v[2]}},showUtils:{{it.showMsgUtils == i}},messageTime:{{v[1]}} }</widget>
                    </div>
                    {{end}} 
                </div>
                {{end}}
            {{end}}
        </div>
    </div>
</div>