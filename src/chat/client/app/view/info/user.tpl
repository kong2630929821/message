<div w-class="new-page" class="new-page" on-tap="pageClick" ev-back-click="goBack" >
    <div w-class="top-main-wrap">
        <chat-client-app-widget-topBar-topBar>{title:"",background:"#318DE6"}</chat-client-app-widget-topBar-topBar>
        <div w-class="home-info-wrap">
            <widget w-tag="chat-client-app-widget-imgShow-imgShow" w-class="avatar" on-tap="showBigImg">{imgURL:{{it.avatar}},width:"190px;"}</widget>
            <div w-class="nameText">
                {{it.name || "------"}}

                {{if it.info.level === 5}}
                    <span w-class="official">官方</span>
                {{end}}
            </div>
        </div>
    </div>  

    <div w-class="detail-info-wrap">
        <div w-class="detail-info">
            <div w-class="adress-wrap" style="margin:60px 0 20px;" on-tap="doCopy(1)">
                <img w-class="adressIcon" src="../../res/images/adress-book.png" />
                <div w-class="adress-text-wrap">
                    <div w-class="mainText">
                        <span>{{it.info.acc_id || "------"}}</span>
                        <img src="../../res/images/copy_gray.png" style="width:30px;"/>
                    </div>
                    <div w-class="flag">好嗨号</div>
                </div>
            </div>
            <div w-class="adress-wrap">
                <img w-class="adressIcon" src="../../res/images/phone.png" />
                <div w-class="adress-text-wrap">
                    <div w-class="mainText">未知</div>
                    <div w-class="flag">电话</div>
                </div>
            </div>
        </div>

        <div w-class="other-wrap">
            {{% <!-- <div style="display:flex;align-items:center;">
                <img w-class="moreChooseIcon" src="../../res/images/more-choose.png" />
                <span style="font-size:32px;color:#222222">其他设置</span>
            </div>
            <div w-class="otherSet">
                <span style="flex:1 0 0;">电话号码对别人可见</span>
                <chat-client-app-widget-switch-switch>{types:true,activeColor:"linear-gradient(to right,#318DE6,#38CFE7)",inactiveColor:"#dddddd"}</chat-client-app-widget-switch-switch>
           </div> -->}}
        </div>
    </div>

</div>
