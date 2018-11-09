<div w-class="group-info-wrap" style="position:absolute;width:100%;height:100%;top:0px;left:0px;background-color:gray;">
    <div w-class="top-main-wrap" ev-handleMoreContactor="handleMoreGroup">
        <client-app-widget-topBar-topBar>{title:"",moreImg:"more-dot-white.png",background:"none"}</client-app-widget-topBar-topBar>
        <client-app-widget-homeInfo-homeInfo>{avatorPath:"github.png",name:"群名",note:"110240",isUser:false}</client-app-widget-homeInfo-homeInfo>
    </div>
    {{if it.isGroupOpVisible}}
    <div w-class="group-op-wrap" ev-handleFatherTap="handleFatherTap">
        <client-app-widget-utilList-utilList>{utilList:{{it.utilList}}}</client-app-widget-utilList-utilList>
    </div>
    {{end}}
    <div w-class="outter">
        <div w-class="inner">
            <div w-class="detail-info-wrap">
                <div w-class="detail-info">
                    <div w-class="adress-wrap">
                        <img w-class="adressIcon" src="../../res/images/sound.png" />
                        <div w-class="adress-text-wrap">
                            <span w-class="mainText">无</span>
                            <span w-class="flag">群公告</span>
                        </div>
                    </div>
                    <div w-class="phone-wrap">
                        <img w-class="phoneIcon" src="../../res/images/group-code.png" />
                        <div w-class="phone-text-wrap">
                            <span w-class="mainText">群名片</span>
                            <span w-class="flag">群ID</span>
                        </div>
                    </div>
                </div>
                <div w-class="other-wrap">
                    <img w-class="moreChooseIcon" src="../../res/images/more-choose.png" />
                    <ul w-class="ul-wrap">
                        <li w-class="liItem firstLi">搜索聊天记录</li>
                        <li style="display:flex;justify-content:space-between;align-items: center;" w-class="liItem">
                            <span>聊天置顶</span>
                            <client-app-widget-switch-switch>{types:false,activeColor:"linear-gradient(to right,#318DE6,#38CFE7)",inactiveColor:"#dddddd"}</client-app-widget-switch-switch>
                        </li>
                        <li style="display:flex;justify-content:space-between;align-items: center;" w-class="liItem">
                            <span>消息免打扰</span>
                            <client-app-widget-switch-switch>{types:true,activeColor:"linear-gradient(to right,#318DE6,#38CFE7)",inactiveColor:"#dddddd"}</client-app-widget-switch-switch>
                        </li>
                        <li w-class="liItem">群管理</li>
                        <li w-class="liItem lastLi" on-tap="openApplyInfo">开始聊天</li>
                    </ul>
                </div>
            </div>
            <div w-calss="group-member-wrap">
                <div w-class="a-part" ev-changeSelect="changeSelect">
                    <div w-class="a">成员（200/500）</div>
                    <div w-class="member-wrap">
                        <img w-class="addIcon" src="../../res/images/add-blue.png" />
                        <img w-class="grouperIcon" src="../../res/images/user.png" />
                        <img w-class="grouperIcon" src="../../res/images/user.png" />
                        <img w-class="grouperIcon" src="../../res/images/user.png" />
                        <img w-class="grouperIcon lastIcon" src="../../res/images/user.png" />
                        <img w-class="more" src="../../res/images/more-gray.png" />
                    </div>
                </div>
            </div>
        </div>
    </div>
   
</div>