<div ev-back-click="goBack" style="height: 100%;overflow-x:hidden;overflow-y:auto;min-height: 420px;">
    {{for key,value of it.emojis}}
        <img style="width:48px;height:48px;border: 10px solid transparent;" src="../../res/emoji/{{value[2]}}" alt="{{value[0]}}" on-click="click(e,{{key}})" />
    {{end}}
</div> 
