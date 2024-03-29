<div class="new-page" ev-back-click="goBack" w-class="new-page" ev-send="send" ev-next-click="groupDetail" on-tap="close">
    <chat-client-app-widget1-topBar-topBar>{title:{{it.name}},nextImg:"more-dot-blue.png" }</chat-client-app-widget1-topBar-topBar>
    {{if it.chatHistory.length}}
    <div w-class="title" on-tap="goAllChat">
        <span w-class="mark"></span>
        <span style="flex:1 0 0;">{{it.minTitle}}</span>
    </div>
    {{end}}
    <div w-class="blackList">
        {{for i,v of it.blackList}}
        <div w-class="content" ev-addType="remove({{i}})" on-tap="goTo({{i}})" on-down="onShow">
            <widget w-tag="chat-client-app-widget-userItem-userItem" style="width:100%;">{text:{{v.text}}, img:{{v.img}},addType:{{it.addType}},msg:{{v.msg}},sex:{{v.sex}},time:{{v.time}}  }</widget>
        </div>
        {{end}}
    </div>
</div>
