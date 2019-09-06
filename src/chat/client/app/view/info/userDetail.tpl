<div w-class="page" class="new-page" on-tap="pageClick" ev-back-click="goBack" ev-next-click="goSetting" >
    <chat-client-app-widget-topBar-topBar>{title:"",nextImg:"setting.png"}</chat-client-app-widget-topBar-topBar>
    
    <div w-class="contain" id="userDetailPage" on-scroll="scrollPage">
        <div id="userDetailContain">
            <div w-class="topBox">
                <div style="display:flex;align-items: center;">
                    <widget w-tag="chat-client-app-widget-imgShow-imgShow" w-class="avatar">{imgURL:{{it.avatar || '../../res/images/user_avatar.png'}},width:"160px;"}</widget>
                    <div style="width: 410px;">
                        <div w-class="numList">
                            {{for i,v of it.numList}}
                            <div w-class="numItem" on-tap="goPersonHome({{i}})">
                                <div style="font-size:32px;">{{v[0]}}</div>
                                <div>{{v[1]}}</div>
                            </div>
                            {{end}}
                        </div>
                        {{if it.isOwner}}
                        <div w-class="followBtn" on-tap="goPublic">{{it.pubNum ? "我的公众号":"申请公众号"}}</div>
                        {{else}}
                        <div w-class="friendsPub">
                            {{if it.followed}}
                                <div w-class="followBtn" on-tap="goHisPublic">{{"公众号"}}</div>
                            {{end}}
                            <div w-class="{{it.followed ? 'cancelBtn':'followBtn'}}" on-tap="followUser">{{it.followed ? "取消关注":"关注ta"}}</div>
                        </div>
                        {{end}}
                    </div>
                </div>

                {{%===================个人信息============================}}
                <div w-class="username">
                    <span>{{it.userInfo.name || "------"}}&nbsp;</span>
                    <img src="../../res/images/{{it.userInfo.sex ? 'girl.png':'boy.png'}}"/>
                </div>
                <div w-class="userId">
                    <div>好嗨ID：{{it.userInfo.acc_id || "------"}}</div>
                    {{if !it.isOwner}}
                    <div>备注：{{it.alias}}</div>
                    {{end}}
                </div>
                
                <div w-class="userDesc">个性签名：{{it.userInfo.note || "------"}}</div>
            </div>

            <div w-class="bottomBox">
                {{%===================勋章============================}}
                <div w-class="title">
                    <span w-class="mark"></span>
                    <span style="flex:1 0 0;">勋章</span>
                    <img src="../../res/images/arrowRight.png"/>
                </div>
                <div w-class="content">
                    {{for i,v of it.medalList}}
                    <div w-class="imgBox">
                        <img src="../../../../../earn/client/app/res/image/medals/medal{{v}}.png" style="height:80px;" />
                    </div>
                    {{end}}
                </div>

                {{%===================最近玩的游戏============================}}
                <div w-class="title">
                    <span w-class="mark"></span>
                    <span style="flex:1 0 0;">最近玩的游戏</span>
                </div>
                <div w-class="content">
                    {{for i,v of it.gameList}}
                    <div w-class="imgBox">
                        <img src="../../res/images/tool-pictures.png" />
                    </div>
                    {{end}}
                </div>

                {{%===================个人动态============================}}
                <div w-class="title">
                    <span w-class="mark"></span>
                    <span style="flex:1 0 0;">个人动态</span>
                </div>
                <div ev-closeTools="pageClick">
                    {{for i,v of it.postList}}
                    <div ev-goDetail="goDetail({{i}})" ev-tools-expand="expandTools(e,{{i}})" ev-likeBtn="likeBtn({{i}})" ev-commentBtn="commentBtn({{i}})" ev-delBtn="delPost({{i}})">
                        <widget w-tag="chat-client-app-view-home-squareItem" style="margin-top:20px;">{{it.dealData(v,it.expandItem == i,it.followed)}}</widget>
                    </div>
                    {{end}}
                </div>
            </div>
        </div>
    </div>

    <div w-class="btns">
        {{if !it.isFriend}}
        <div w-class="btn" on-tap="addUser">+好友</div>
        {{else}}
        <div w-class="btn" on-tap="goChat">聊天</div>
        {{end}}
        {{if !it.followed}}
        <div w-class="btn" on-tap="followUser">关注</div>
        {{end}}
        {{if it.isMine}}
        <div w-class="btn" on-tap="sendPost">+好友</div>
        {{end}}
    </div>
</div>