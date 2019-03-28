<div class="new-page"  on-tap="closePage">
    {{if !it.showOrg}}
    <app-components1-blankDiv-topDiv></app-components1-blankDiv-topDiv>
    {{end}}
    <div w-class="modal-mask">
        <img src="{{it.showOrg ? it.originalImg :it.img}}" w-class="content"/>
        {{if it.originalImg && !it.showOrg}}
        <div w-class="btn" on-tap="showOriginal">查看原图</div>
        {{end}}
    </div>
   
</div>