<div w-class="home-info-wrap">
    <img w-class="avatar" src="../../res/images/user_avatar.png" />
    <span w-class="nameText">{{it.isUser && it.note ? it.note : it.name}}</span>
    {{if !it.isUser && it.note}}
        <span w-class="otherText">群号：{{it.note}}</span>
    {{end}}
    {{if it.isUser && it.isContactor}}
    <span w-class="contactorID">ID：{{it.userId}}</span>
    <span w-class="contactorNick">昵称：{{it.name}}</span>
    {{elseif it.isUser && !it.isContactor}}
    <span w-class="contactorID">ID：{{it.userId}}</span>
    {{end}}
</div>
    
