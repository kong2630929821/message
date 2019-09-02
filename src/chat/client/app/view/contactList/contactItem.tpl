<div>
    {{if it.show}}
    <div w-class="contact-wrap">
        <div w-class="avatar-wrap">
            <widget w-tag="chat-client-app-widget-imgShow-imgShow" w-class="avatar" >{imgURL:{{it.img}},width:"80px;"}</widget>
        </div>
       <div w-class="item-right">
           <div w-class="contact-right">
                <div style="display:flex;">
                    <span w-class="text">{{it.text ? it.text : it.name}}</span>
                    {{if it.official}}
                        <span w-class="official">官方</span>
                    {{end}}
        
                    {{if it.totalNew>0}}
                        <div w-class="other">
                            {{it.totalNew}}
                        </div>
                    {{end}}
                </div>
                {{if it.msg}}
                    <div w-class="msg">{{it.msg}}</div>
                {{end}}
           </div>
           {{if it.addType}}
           <div w-class="addBtn" on-tap="addType" on-down="onShow">{{it.addType}}</div>
           {{end}}
       </div>
    </div>
    {{end}}
</div>
        