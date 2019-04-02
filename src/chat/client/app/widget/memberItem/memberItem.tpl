<div w-class="member-info-wrap">
    {{if it.isAdmin || it.isOwner}}
    <widget w-tag="chat-client-app-widget-imgShow-imgShow" w-class="avatar-wrap" style="border:solid 5px {{it.isOwner?'#F7E62A':'#2AE1F7'}}">{imgURL:{{it.avatorPath}}, width:"100px"}</widget>
    {{else}}
    <widget w-tag="chat-client-app-widget-imgShow-imgShow" w-class="avatar-wrap">{imgURL:{{it.avatorPath}}, width:"100px"}</widget>
    {{end}}
    <span w-class="text">{{it.text ? it.text : it.name}}</span>
    {{if it.isAdmin || it.isOwner}}
    <span w-class="badge" style="background:{{it.isOwner?'#F7E62A':'#2AE1F7'}}"></span>
    {{end}}
</div> 