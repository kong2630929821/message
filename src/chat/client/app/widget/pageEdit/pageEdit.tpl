<div class="new-page" w-class="new-page">
    <div ev-back-click="goBack" ev-next-click="completeEdit" w-class="topBar">
        <chat-client-app-widget1-topBar-topBar>{title:{{it.title}},nextImg:{{it.contentInput?'complete_blue.png':'complete_gray.png'}}}</chat-client-app-widget1-topBar-topBar>
    </div>
    {{if it.needTitle}}
    <div ev-input-change="inputChange" w-class="title-wrap">
        <widget w-tag="chat-client-app-widget1-input-input" >{placeHolder:"标题（必填）1-40字",style:"border-radius: 12px;"}</widget>  
    </div>
    {{end}}
    <div ev-input-change="textAreaChange" w-class="content-wrap" on-tap="focusContent">
        <widget w-tag="chat-client-app-widget1-input-textarea">{placeHolder:{{it.placeholder}}, style:"max-height:600px;height:600px;", input:{{it.contentInput}},maxLength:{{it.maxLength}} }</widget>
    </div>
</div>

