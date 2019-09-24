<div w-class="filter">
    {{if it.style}}
        {{if it.expand}}
        <div w-class="optionList_1">
            {{for i,v of it.options}}
                <div on-tap="select(e,{{i}},{{v.status}})" w-class="option {{i == it.activeIndex ? 'active':''}}" class="selectBox_option">
                    <label>{{v.text}}</label>
                </div>
            {{end}}
        </div>
        {{end}}
    {{end}}
    <div on-tap="change" w-class="{{it.style?'show_1':'show'}} {{it.userType?'show2':''}}">
        {{if it.search}}
        <div w-class="input" ev-input-change="inputChange" style="width: 300px;margin-left: 46px;">
            <widget w-tag="chat-management-components-input">{placeHolder:"请输入",input:{{it.options[it.activeIndex].text}} }</widget>
        </div>
        {{else}}
        <span w-class="showTesxt {{it.userType?'showText2':''}}">{{it.options.length > 0 ? it.options[it.activeIndex].text :""}}</span>
        {{end}}
        <img src="../res/images/arrowDown.png" w-class="arrow"/>
    </div>
    {{if !it.style}}
    {{if it.expand}}
    <div w-class="optionList {{it.userType?'userTypeList':''}}">
        {{for i,v of it.options}}
            <div on-tap="select(e,{{i}},{{v.status}})" w-class="option {{i == it.activeIndex ? 'active':''}}" class="selectBox_option">
                <label>{{v.text}}</label>
            </div>
        {{end}}
    </div>
    {{end}}
    {{end}}
</div>