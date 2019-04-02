<div class="new-page"  on-tap="closePage">
    <div w-class="modal-mask">
        <img src="{{it.showOrg ? it.originalImg :it.img}}" w-class="content" style="width:{{it.showOrg?'100%':'auto'}}"/>
        {{if it.originalImg && !it.showOrg}}
        <div w-class="btn" on-tap="showOriginal">查看原图</div>
        {{end}}
        {{if it.originalImg}}
        <a w-class="btn" href="{{it.originalImg}}" download="download" style="right:50px;">下载</a>
        {{end}}
    </div>
   
</div>