<div w-class="outer" >
	<div w-class="input-message-wrap">
		{{% <img w-class="audio" on-touchstart="radioStart" on-touchend="radioEnd" src="../../res/images/audio.png"/>}}
		<chat-client-app-widget-input-textarea w-class="inputMessage">{placeHolder:"输入消息",input:{{it.message}} }</chat-client-app-widget-input-textarea>
		<img w-class="emoji" on-tap="playEmoji" src="../../res/images/emoji.png"/>
		{{if it.message}}
		<img w-class="unfold" on-tap="send" src="../../res/images/send.png"/>
		{{else}}
		<img w-class="unfold" on-tap="openTool" src="../../res/images/unfold.png"/>
		{{end}}
	</div>

	<widget w-tag="chat-client-app-widget-emoji-emoji" w-class="emojiMap" id="emojiMap" style="display:{{it.isOnEmoji ? 'block' : 'none'}}"></widget>
	
	<div w-class="toolsMap" id="toolsMap" style="display:{{it.isOnTools ? 'block' : 'none'}}">
		<div style="display:flex;flex-wrap: wrap;">
			{{for i,v of it.toolList}}
			<div w-class="toolItem" on-tap="pickTool(e,{{i}})">
				<div w-class="toolImg"><img src="../../res/images/{{v.img}}" style="width:100px;margin: 10px;"/></div>
				<span style="margin:5px;">{{v.name}}</span>
			</div>
			{{end}}
		</div>
	</div>
	
	<div w-class="radioWrap" style="display:{{it.isOnRadio?'block':'none'}}">
		<div w-class="radioWrite" style="animation: radio1 1s infinite;"></div>
		<div w-class="radioWrite" style="animation: radio2 1s infinite;"></div>
		<div w-class="radioWrite"></div>
	</div>
</div>