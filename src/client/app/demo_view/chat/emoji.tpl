<div class="new-page">
    <div on-tap="back" style="width:200px;height:100px;">点我返回</div>
    {{for key,value of it.emojis}}
        <img style="width:100px;height:100px;" src="{{value[1]}}" alt="{{value[0]}}" on-tap="click({{key}})" />
    {{end}}
</div> 