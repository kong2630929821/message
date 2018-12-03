<div w-class="new-page" class="new-page" on-tap="pageClick" ev-back-click="goBack">
    <div w-class="top-main-wrap">
        <client-app-widget-topBar-topBar>{title:"",background:"#318DE6"}</client-app-widget-topBar-topBar>
        <div w-class="home-info-wrap">
            <img w-class="avator" src="../../res/images/img_avatar1.png" />
            <div w-class="nameText">
                {{if it.nameEdit}}
                    <input type="text" value="{{it.name}}" w-class="aliasInput" maxlength="10" on-blur="changeUserInfo" on-tap="editName" on-input="nameChange"/>
                {{else}}
                    {{it.name}}
                {{end}}
                <img w-class="edit" src="../../res/images/edit_gray.png" on-tap="editName"/>
            </div>
            <div>ID：{{it.info.uid}}</div>
        </div>
    </div>  

    <div w-class="detail-info-wrap">
        <div w-class="detail-info">
            <div style="margin-bottom:40px;">
                <div w-class="adress-wrap">
                    <img w-class="adressIcon" src="../../res/images/adress-book.png" />
                    <span w-class="mainText">0x58b0b586b0b50x58b0b586vcbvcbvc0b586b586</span>
                </div>
                <span w-class="flag">地址</span>
            </div>
            
            <div style="margin-bottom:40px;">
                <div ev-input-change="phoneChange" ev-input-blur="changeUserInfo" w-class="adress-wrap">
                    <img w-class="adressIcon" src="../../res/images/phone.png" />
                    {{if it.phoneEdit}}
                        <widget w-class="mainText" w-tag="client-app-widget-input-input" on-tap="editPhone" style="border-bottom:1px solid #DBDBE5;">{input:{{it.tel}},style:"padding:0px;",itype:"integer",maxLength:11 }</widget>
                    {{else}}
                        <span w-class="mainText">{{it.tel}}</span>
                    {{end}}
                    <span style="font-size:32px;color:#ccc;" on-tap="editPhone">编辑</span>
                </div>
                <span w-class="flag">电话</span>
                
            </div>
            
        </div>

        <div w-class="other-wrap">
            <div style="display:flex;align-items:center;">
                <img w-class="moreChooseIcon" src="../../res/images/more-choose.png" />
                <span style="font-size:32px;color:#222222">其他设置</span>
            </div>
           <div w-class="otherSet">
                <span style="flex:1 0 0;">电话号码对别人可见</span>
                <client-app-widget-switch-switch>{types:true,activeColor:"linear-gradient(to right,#318DE6,#38CFE7)",inactiveColor:"#dddddd"}</client-app-widget-switch-switch>
           </div>
        </div>
    </div>
    
</div>
