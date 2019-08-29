<div class="new-page" ev-back-click="goBack" w-class="new-page" ev-send="send" ev-next-click="groupDetail" on-tap="close">
        <chat-client-app-widget-topBar-topBar>{title:{{it.name}},nextImg:"more-dot-blue.png" }</chat-client-app-widget-topBar-topBar>
        <div w-class="messageBox">
            {{if it1.length}}
                {{for i,v of it1}}
                    {{if v[0]==0}}
                    <div style="position:relative" on-longtap="openMessageRecall({{i}})" on-down="onShow">
                        <div w-class="messageItem">
                            <p w-class="msgTitle">{{v[1]}}</p>
                            <p w-class="msgName">昵称</p>
                            <p w-class="uName">{{v[2]}}</p>
                            <p w-class="msgName">ID</p>
                            <p w-class="uId">
                                <div>{{v[3]}}</div>
                                <div style="color:#315BC8;" on-tap="addFriend({{v[3]}})">{{it.isAddUser}}</div>
                            </p>
                        </div>
                        {{% ========================删除按钮=========================}}
                        {{if it.currentIndex==i}}
                        <div style="position: absolute;top: 50%;left: 50%;">
                            <div w-class="recallBtn" on-tap="recall({{i}})" on-down="onShow">删除</div>
                        </div>
                        {{end}}
                    </div>
                    {{else}}
                    <div style="position:relative" on-longtap="openMessageRecall({{i}})" on-down="onShow">
                        <div w-class="messageNotice" on-tap="gotoPostDetail({{i}})">
                            <div w-class="noticeTitle">{{v[1]}}</div>
                            <div w-class="noticeImg">
                                <widget w-tag="chat-client-app-widget-imgShow-imgShow" w-class="image">{imgURL:{{v[6]}}, width:"{{it.imgs.length==1?'80px':'80px'}}",notRound:true}</widget>
                            </div>
                         
                        </div>
                        {{% ========================删除按钮=========================}}
                        {{if it.currentIndex==i}}
                        <div style="position: absolute;top: 50px;left: 50%;">
                            <div w-class="recallBtn" on-tap="recall({{i}})" on-down="onShow">删除</div>
                        </div>
                        {{end}}
                    </div>   
                    {{end}}
                {{end}}
            {{else}}
            {{end}}    
        </div>
    </div>
    
    