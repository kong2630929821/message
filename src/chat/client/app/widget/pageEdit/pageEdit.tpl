<div class="new-page" w-class="new-page">
    <div ev-back-click="goBack" ev-next-click="completeEdit" w-class="topBar">
        <chat-client-app-widget-topBar-topBar>{title:{{it.title}},nextImg:"complete.png"}</chat-client-app-widget-topBar-topBar>
    </div>
    {{if it.needTitle}}
    <div ev-input-change="inputChange" w-class="title-wrap">
        <widget w-tag="chat-client-app-widget-input-input" >{placeHolder:"标题（必填）1-40字",style:"border-radius: 12px;"}</widget>  
    </div>
    {{end}}
    <div ev-input-change="textAreaChange" w-class="content-wrap">
        <widget w-tag="chat-client-app-widget-input-textarea">{placeHolder:{{it.placeholder}}, style:"max-height:600px;height:auto;", input:{{it.contentInput}} }</widget>
    </div>
</div>

