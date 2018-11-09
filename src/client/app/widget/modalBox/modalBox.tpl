<div w-class="modal-mask" class="new-page" style="position:absolute;width:100%;height:100%;top:0px;left:0px;">
    <div w-class="body">
        {{if it.title}}
        <div w-class="title">{{it.title}}</div>
        {{end}}
        <div w-class="content" style="{{it.style?it.style:''}}">{{it.content}}</div>
        <div w-class="btns">
            <div w-class="btn-cancel" on-tap="cancelBtnClick">{{it.cancelText ? it.cancelText : it1.cfgData.cancelText}}</div>
            <div w-class="btn-ok" on-tap="okBtnClick">{{it.sureText ? it.sureText : it1.cfgData.sureText}}</div>
        </div>
    </div>
</div>