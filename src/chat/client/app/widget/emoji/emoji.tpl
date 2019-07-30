<div ev-back-click="goBack">
    {{for key,value of it.emojis}}
        <img style="width:48px;height:48px;border: 10px solid transparent;" src="../../res/emoji/{{value[2]}}" alt="{{value[0]}}" on-click="click(e,{{key}})" />
    {{end}}
</div> 