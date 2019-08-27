<div class="new-page" ev-back-click="goBack" w-class="new-page" ev-send="send" ev-next-click="groupDetail">
        <chat-client-app-widget-topBar-topBar>{title:{{it.name}},nextImg:"more-dot-blue.png" }</chat-client-app-widget-topBar-topBar>
        <div w-class="messageBox">
            {{if it1.length}}
                {{for i,v of it1}}
                    {{if v[0]==0}}
                        <div w-class="messageItem">
                            <p w-class="msgTitle">{{v[1]}}</p>
                            <p w-class="msgName">昵称</p>
                            <p w-class="uName">{{v[2]}}</p>
                            <p w-class="msgName">ID</p>
                            <p w-class="uId">
                                <div>{{v[3]}}</div>
                                <div style="color:#315BC8;">加好友</div>
                            </p>
                        </div>
                    {{else}}
                        <div w-class="messageNotice">
                            <div w-class="noticeTitle">{{v[1]}}</div>
                            <img src="../../res/images/add-blue.png" alt="" w-class="noticeImg"/>
                        </div>
                    {{end}}
                {{end}}
            {{else}}
            {{end}}    
        </div>
    </div>
    
    