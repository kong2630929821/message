<div class="new-page" w-class="new-page">
    <div ev-back-click="goBack" ev-next-click="completeEdit" w-class="topBar">
        <chat-client-app-widget1-topBar-topBar3>{leftText:"取消",title:{{it.title}},rightText:"发布",style:{{it.contentInput?'#4285F4':'#888'}} }</chat-client-app-widget1-topBar-topBar3>
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

