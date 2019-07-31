<div w-class="modal-mask" class="new-page">
        <div w-class="body">
            <div w-class="content">
                {{for i,v of it.content}}
                    {{: selFg = it.selected.indexOf(i)>-1}}
                    <div on-tap="doClick({{i}})" w-class="checkbox">
                        <img src="../../res/images/icon_right{{selFg?'2':''}}.png" w-class="selectImg"/>
                        <span style="line-height:40px;">{{v}}</span>
                    </div>
                {{end}}
            </div>

            <div w-class="btns">
                <div w-class="btn-cancel" on-tap="cancelBtnClick">
                    取消
                </div>
                <div w-class="btn-ok" on-tap="okBtnClick">
                    举报
                </div>
            </div>
        </div>
    </div>