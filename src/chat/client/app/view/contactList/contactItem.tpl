<div>
    {{if it.show}}
    <div w-class="contact-wrap">
        <div w-class="avatar-wrap">
            <widget w-tag="chat-client-app-widget1-imgShow-imgShow" w-class="avatar" >{imgURL:{{it.img}},width:"80px;"}</widget>
        </div>
       <div w-class="item-right">
           <div w-class="contact-right">
                <div style="display:flex;align-items: center;">
                    <span w-class="text">{{it.text ? it.text : it.name}}</span>
                    {{if it.official}}
                        <span w-class="official">官方</span>
                    {{end}}
                    {{if it.sex&&it.sex!=2}}
                        <img src="../../res/images/{{it.sex==1?'girl.png':'boy.png'}}" w-class="sexImg"/>
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
           {{if it.time}}
           <div w-class="time">{{it.time}}</div>
           {{end}}
       </div>
    </div>
    {{end}}
</div>
        