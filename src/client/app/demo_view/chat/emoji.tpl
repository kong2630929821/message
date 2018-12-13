<div ev-back-click="goBack">
    {{for key,value of it.emojis}}
        <img style="width:48px;height:48px;margin: 10px;" src="../../res/emoji/{{value[2]}}" alt="{{value[0]}}" on-down="click(e,{{key}})" />
    {{end}}
</div> 