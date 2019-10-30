<div>
    {{: color = it.cardType=='redEnv' && it.received ? '#FAA4A4':'#EB4F4F'}}
    {{: color = it.cardType!='redEnv' ? '#fff':color}}
    <div w-class="name-info-wrap {{it.cardType=='redEnv'?'redEnvTop':''}}" style="background: {{color}}">
        {{if it.cardType == "redEnv"}}
            {{if it.received}}
            <img w-class="redEnvImg" src="../../res/images/receivedRedEnv.png" />
            {{else}}
            <img w-class="redEnvImg" src="../../res/images/redEnvelope.png" />
            {{end}}
        {{else}}
        <img w-class="avatar-wrap" src="{{it.avatarPath}}" />
        {{end}}
        <span w-class="name-card-info" style="color:{{it.cardType=='redEnv'?'#fff':'#222'}}">{{it.cardInfo}}</span>
    </div>
    <div w-class="cardType">{{it.cardTypeShow}}</div>
</div>