<div class="new-page"  on-tap="closePage">
    <div w-class="modal-mask">
        <img src="{{it.showOrg ? it.originalImg :it.img}}" w-class="content" style="width:{{it.showOrg?'100%':'auto'}}"/>
        {{if it.originalImg && !it.showOrg}}
        <div w-class="btn" on-tap="showOriginal">查看原图</div>
        {{end}}
        {{:fg = true}}
        {{if it.originalImg && fg}}
        <div w-class="btn" style="right:50px;" on-tap="download">下载</div>
        {{end}}
    </div>
    
    <iframe style="display:none;" id="IframeReportImg" name="IframeReportImg" width="0" height="0" src="{{it.originalImg}}"></iframe>
</div>