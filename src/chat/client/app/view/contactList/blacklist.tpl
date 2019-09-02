<div class="new-page" ev-back-click="goBack" w-class="new-page" ev-send="send" ev-next-click="groupDetail" on-tap="close">
    <chat-client-app-widget-topBar-topBar>{title:{{it.name}},nextImg:"more-dot-blue.png" }</chat-client-app-widget-topBar-topBar>
    <div w-class="blackList">
        {{for i,v of it.blackList}}
        <div w-class="content" ev-addType="remove({{i}})">
            <widget w-tag="chat-client-app-view-contactList-contactItem">{text:{{v.text}}, img:{{v.img}},addType:"放出",msg:{{v.msg}},sex:{{v.sex}}  }</widget>
        </div>
        {{end}}
    </div>
</div>
