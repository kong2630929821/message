<div w-class="recent-history-wrap" class="new-page">
    <div w-class="top-main-wrap" ev-next-click="handleMoreContactor" ev-back-click="goBack">
        <client-app-widget-topBar-topBar>{title:"",nextImg:"more-dot-white.png",background:"#318DE6"}</client-app-widget-topBar-topBar>
        <div w-class="home-info-wrap">
            <img w-class="avator" src="../../res/images/img_avatar1.png" />
            <div w-class="nameText">
                {{it.userInfo.name}}
                <img w-class="edit" src="../../res/images/edit_gray.png" on-tap="changeRemark"/>
            </div>
            <div>ID：{{it.uid}}</div>
            <div>昵称：{{it.userInfo.name}}</div>
        </div>
    </div>  

    <div w-class="detail-info-wrap">
        <div w-class="detail-info">
            <div w-class="adress-wrap">
                <img w-class="adressIcon" src="../../res/images/adress-book.png" />
                <div w-class="adress-text-wrap">
                    <span w-class="mainText">0x58b0b586b0b50x58b0b586vcbvcbvc0b586b586</span>
                    <span w-class="flag">地址</span>
                </div>
            </div>
            <div w-class="phone-wrap">
                <img w-class="phoneIcon" src="../../res/images/phone.png" />
                <div w-class="phone-text-wrap">
                    <span w-class="mainText">未知</span>
                    <span w-class="flag">电话</span>
                </div>
            </div>
        </div>
        <div w-class="other-wrap">
            <img w-class="moreChooseIcon" src="../../res/images/more-choose.png" />
            <ul w-class="ul-wrap">
                <li w-class="liItem">搜索聊天记录</li>
                <li style="display:flex;justify-content:space-between;align-items: center;" w-class="liItem">
                    <span>聊天置顶</span>
                    <client-app-widget-switch-switch>{types:false,activeColor:"linear-gradient(to right,#318DE6,#38CFE7)",inactiveColor:"#dddddd"}</client-app-widget-switch-switch>
                </li>
                <li style="display:flex;justify-content:space-between;align-items: center;" w-class="liItem">
                    <span>消息免打扰</span>
                    <client-app-widget-switch-switch>{types:false,activeColor:"linear-gradient(to right,#318DE6,#38CFE7)",inactiveColor:"#dddddd"}</client-app-widget-switch-switch>
                </li>
                <li w-class="liItem" on-tap="startDialog" style="color: #318DE6;margin-bottom: 110px;">开始对话</li>
            </ul>
        </div>
    </div>
    {{if it.isContactorOpVisible}}
    <div w-class="contactorOpList" ev-handleFatherTap="handleFatherTap">
        <client-app-widget-utilList-utilList>{utilList:{{it.utilList}} }</client-app-widget-utilList-utilList>
    </div>
    {{end}}
</div>