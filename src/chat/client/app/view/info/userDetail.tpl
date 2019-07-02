<div w-class="page" class="new-page" on-tap="pageClick" ev-back-click="goBack" ev-next-click="goSetting">
    <chat-client-app-widget-topBar-topBar>{title:"",nextImg:"setting.png"}</chat-client-app-widget-topBar-topBar>
    <div w-class="contain">
        <div w-class="topBox">
            <div style="display:flex;align-items: center;">
                <widget w-tag="chat-client-app-widget-imgShow-imgShow" w-class="avatar">{imgURL:"../../res/images/user_avatar.png",width:"160px;"}</widget>
                <div>
                    <div w-class="numList">
                        {{for i,v of it.numList}}
                        <div w-class="numItem" on-tap="goPersonHome({{i}})">
                            <div style="font-size:32px;">{{v[0]}}</div>
                            <div>{{v[1]}}</div>
                        </div>
                        {{end}}
                    </div>
                    <div w-class="followBtn">关注ta</div>
                </div>
            </div>

            {{%===================个人信息============================}}
            <div w-class="username">
                昵称
                <img src="../../res/images/girl.png"/>
            </div>
            <div w-class="userId">
                <div>好嗨ID：000000</div>
                <div>备注：哈哈哈</div>
            </div>
            <div w-class="userDesc">个人说说个人说说个人说说个人说说个人说说个人说说个人说说个人说说个人说说个人说说个人说说</div>
        </div>

        <div w-class="bottomBox">
            {{%===================勋章============================}}
            <div w-class="title">
                <span w-class="mark"></span>
                <span style="flex:1 0 0;">勋章</span>
                <img src="../../res/images/arrowRight.png"/>
            </div>
            <div w-class="content">
                {{for i,v of [1,2,3,4,5]}}
                <div w-class="imgBox">
                    <img src="../../res/images/tool-pictures.png" />
                </div>
                {{end}}
            </div>

            {{%===================最近玩的游戏============================}}
            <div w-class="title">
                <span w-class="mark"></span>
                <span style="flex:1 0 0;">最近玩的游戏</span>
            </div>
            <div w-class="content">
                {{for i,v of [1,2,3,4,5]}}
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
            <div>
                {{for i,v of [1,2,3]}}
                <widget w-tag="chat-client-app-view-home-squareItem" style="margin-top:20px;"></widget>
                {{end}}
            </div>
        </div>
    </div>

    <div w-class="btns">
        <div w-class="btn">+好友</div>
        <div w-class="btn">关注</div>
    </div>
</div>