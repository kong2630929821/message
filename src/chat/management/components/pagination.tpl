
<div>
    {{if it.pages > 0}}
    <div w-class="pagination">
        {{if it.filterShow}}
            <div w-class="filterBox">
                <span>每页</span>
                <div style="display:inline-block;height: 30px;margin-left: 10px" ev-selected="filterTimeType" ex-expand="expand">
                    <widget w-tag="chat-management-components-simpleFilter1">{options:{{it.numberCheck}},activeIndex:{{it.numberCheckActiveIndex}},expand:{{it.expand}},style:true}</widget>
                </div>
            </div>
        {{end}}
        <div w-class="filterBox">共{{it.pages}}页</div>
        <ul w-class="ul">
            <li class="btnHover" w-class="prep" on-tap="goto({{1}},e)" style="margin-right:10px;" on-down="onShow">首页</li>
            <li class="btnHover" w-class="prep" on-tap="prep" on-down="onShow">
                上一页
            </li>
            {{for i,v of it.pagesList}}
                <li class="liHover" w-class="li {{it.currentIndex===v?'actived':''}}" on-tap="currentClick(e,{{v}})" style=" padding-left: 10px;" on-down="onShow">{{v+1}}</li>
            {{end}}
            <li class="btnHover" w-class="next" on-tap="next" on-down="onShow">
                下一页
            </li>
            <li class="btnHover" w-class="next" on-tap="goto({{2}},e)" style="margin-left:10px;" on-down="onShow">
                尾页
            </li>
        </ul>
    </div>
    {{end}}
</div>