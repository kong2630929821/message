<div w-class="member-info-wrap">
    {{if it.isAdmin || it.isOwner}}
    <img w-class="avatar-wrap" src="{{it.avatorPath}}" style="border:solid 5px {{it.isOwner?'#F7E62A':'#2AE1F7'}}"/>
    {{else}}
    <img w-class="avatar-wrap" src="{{it.avatorPath}}"/>
    {{end}}
    <span w-class="text">{{it.text ? it.text : it.name}}</span>
    {{if it.isAdmin || it.isOwner}}
    <span w-class="badge" style="background:{{it.isOwner?'#F7E62A':'#2AE1F7'}}"></span>
    {{end}}
</div> 