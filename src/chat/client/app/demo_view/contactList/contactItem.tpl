<div>
    {{if it.show}}
    <div w-class="contact-wrap">
        <div w-class="avatar-wrap">
            <widget w-tag="chat-client-app-widget-imgShow-imgShow" w-class="avatar" >{imgURL:{{it.img}},width:"80px;"}</widget>
        </div>
        <span w-class="text">{{it.text ? it.text : it.name}}</span>
        {{if it.totalNew>0}}
        <div w-class="other">
            {{it.totalNew}}
        </div>
        {{end}}
    </div>
    {{end}}
</div>
        