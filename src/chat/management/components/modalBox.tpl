<div w-class="openBox">
    <div w-class="body">
        <div w-class="title">{{it.title}}</div>
        <div w-class="postInfo">
            <img src="{{it.avatar}}" alt="" style="width:24px;height:24px;"/>
            <div w-class="postName">{{it.name}}</div>
        </div>
        <div w-class="checkType">
            <div w-class="row1" on-tap="check" on-down="onShow">
                <img src="../res/images/{{it.checked?'selectBox_active.png':'selectBox.png'}}" w-class="rowImg"/>
                <div w-class="rowItem">发布</div>
            </div>
            <div w-class="row1" on-tap="check" on-down="onShow">
                <img src="../res/images/{{it.checked?'selectBox.png':'selectBox_active.png'}}" w-class="rowImg"/>
                <div w-class="rowItem">驳回</div>
            </div>
        </div>
        {{if !it.checked}}
            <div w-class="checkTypeTwo">
                {{for i,v of it.typeTwo}}
                    <div w-class="row1" on-tap="checkList({{i}})" on-down="onShow">
                        <img src="../res/images/{{it.checkedList[i]?'selectBox_active.png':'selectBox.png'}}" w-class="rowImg"/>
                        <div w-class="rowItem">{{v}}</div>
                    </div>
                {{end}}
            </div>
        {{end}}
        <div w-class="btnGroup">
            <div w-class="btn" on-tap="cancleBtn">取消</div>
            <div w-class="btn" on-tap="okBtn">确认</div>
        </div>
    </div>
</div>