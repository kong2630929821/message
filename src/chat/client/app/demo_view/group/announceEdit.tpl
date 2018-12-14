<div class="new-page">
    <div ev-back-click="goBack" ev-complete="completeEdit">
        <chat-client-app-widget-topBar-topBar>{title:"编辑群公告",background:"#fff",completeImg:"complete.png"}</chat-client-app-widget-topBar-topBar>
    </div>
    <div w-class="title-wrap" ev-input-change="inputChange">
        <chat-client-app-widget-input-input>{placeHolder:"标题（必填），1-40字"}</chat-client-app-widget-input-input>  
    </div>
    <div w-class="content-wrap" ev-input-change="textAreaChange">
        <chat-client-app-widget-inputTextarea-input_textarea>{placeHolder:"内容（必填）15-500字",style:"padding: 30px;height:100%;"}</chat-client-app-widget-inputTextarea-input_textarea>
    </div>
    
</div>

