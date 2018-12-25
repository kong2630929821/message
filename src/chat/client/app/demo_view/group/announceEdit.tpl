<div class="new-page">
    <div ev-back-click="goBack" ev-next-click="completeEdit">
        <chat-client-app-widget-topBar-topBar>{title:"编辑群公告",nextImg:"complete.png"}</chat-client-app-widget-topBar-topBar>
    </div>
    <div ev-input-change="inputChange" w-class="title-wrap">
        <widget w-tag="chat-client-app-widget-input-input" >{placeHolder:"标题（必填），1-40字",style:"border-radius: 12px;"}</widget>  
    </div>
    <div ev-input-change="textAreaChange" w-class="content-wrap">
        <widget w-tag="chat-client-app-widget-input-textarea">{placeHolder:"内容（必填）15-500字",style:"max-height:100%"}</widget>
    </div>
    
</div>

