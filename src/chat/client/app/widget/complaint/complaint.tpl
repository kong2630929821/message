<div class="new-page" ev-back-click="cancelBtnClick" w-class="new-page" ev-send="send" ev-next-click="groupDetail" on-tap="close">
    <chat-client-app-widget-topBar-topBar>{title:"举报",nextImg:"" }</chat-client-app-widget-topBar-topBar>
    <div w-class="modal-mask">
        <div w-class="report-violations">投诉 @ {{it.title}}</div>
        <div w-class="userInfo">
            <widget w-tag="chat-client-app-widget-imgShow-imgShow" w-class="avatar" >{imgURL:{{it.avatar}},width:"150px;"}</widget>
            <div w-class="content">
            <div w-class="user">
                    <div w-class="userName">@ {{it.title}}</div>
                    {{if it.sex!=2}}
                    <img src="{{it.sex==0?'../../res/images/boy.png':'../../res/images/girl.png'}}" alt="" w-class="sexImg"/>
                    {{end}}
                </div>
                <div w-class="contentBox">{{it.msg}}</div>
            </div>
        </div>
        <div w-class="reportType">请选择你要投诉的类型：</div>
        <div w-class="checkType">
            {{for i,v of it.content}}
                <div w-class="{{it.selectStaus[i]?'active':'item'}}" on-tap="doClick({{i}})" on-down="onShow">{{v}}</div>
            {{end}}
        </div>
        <div w-class="btn" on-down="onShow" on-tap="okBtnClick">提交</div>
    </div>
</div>

