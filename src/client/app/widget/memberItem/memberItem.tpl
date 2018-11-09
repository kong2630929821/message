<div w-class="member-info-wrap">
    <div w-class="avator-wrap" style="border:solid 1px {{it.isOwner?'#F7E62A':'#2AE1F7'}}">
        <img w-class="avator" src="../../res/images/{{it.avatorPath}}" />
    </div>
    <span w-class="text">{{it.text}}</span>
    {{if !it.isOrdinary}}
    <span w-class="badge" style="background:{{it.isOwner?'#F7E62A':'#2AE1F7'}}"></span>
    {{end}}
</div>