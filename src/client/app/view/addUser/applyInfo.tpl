<div style="position:absolute;width:100%;height:100%;top:0px;left:0px;background-color:gray;">
    <div ev-complete="applyFriend">
        <client-app-widget-topBar-topBar w-class="title">{title:"加好友",completeImg:"complete.png",background:"#fff"}</client-app-widget-topBar-topBar>
    </div>
    <div w-class="apply-info-wrap">
        <div w-class="detail" ev-input-change="change">
            <client-app-widget-inputTextarea-input_textarea>{placeHolder:"请输入验证信息"}</client-app-widget-inputTextarea-input_textarea>
            <span w-class="countText">44</span>
        </div>
    </div>
    <div>陌生人id{{it.rid}}</div>
</div>