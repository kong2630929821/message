<div w-class="page">
    <div w-class="list">
        {{for i,v of it.showDataList}}
            <div w-class="draft">
                <img  src="{{v.banner}}" w-class="banner" />
                <div w-class="info">
                    <div w-class="title">{{v.title}}</div>
                    <div w-class="time">
                        <div>上次编辑时间：{{v.time}}</div>
                        <div w-class="btnGroup">
                            <div>删除</div>
                            <div style="margin-left: 38px;">编辑</div>
                        </div>
                    </div>
                </div>
            </div>
        {{end}}
    </div>
</div>