<div w-class="outer" >
	<div w-class="input-message-wrap">
		<img w-class="audio" on-tap="openAudio" src="{{it.isOnAudio?'../../res/images/audioIcon.png':'../../res/images/audio.png'}}"/>
		<chat-client-app-widget1-input-textarea w-class="inputMessage">{placeHolder:"输入消息",input:{{it.message}} }</chat-client-app-widget1-input-textarea>
		<img w-class="emoji" on-tap="openEmoji" src="{{it.isOnEmoji?'../../res/images/emojiblue.png':'../../res/images/emoji.png'}}"/>
		{{if it.message}}
		<img w-class="unfold" on-tap="send" src="../../res/images/send.png"/>
		{{else}}
		<img w-class="unfold" on-tap="openTool" src="../../res/images/unfold.png"/>
		{{end}}
	</div>

	<div id="emojiMap" style="min-height: 420px;display:{{it.isOnEmoji?'block':'none'}}">
		{{if it.isOnEmoji}}
		<widget w-tag="chat-client-app-widget1-emoji-emoji"></widget>
		{{end}}
	</div>
	
	
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
	
	<div id="audioWrap" w-class="audioWrap" style="display:{{it.isOnAudio?'flex':'none'}}">
		{{%<!-- <div w-class="audioWrite" style="animation: audio1 1s infinite;"></div>
		<div w-class="audioWrite" style="animation: audio2 1s infinite;"></div>
		<div w-class="audioWrite"></div> -->}}
		<div w-class="audioText">{{it.audioText}}</div>
		<div on-touchstart="audioStart" on-touchend="audioEnd" on-touchmove="audioStop" w-class="audioBox {{it.recordAudio?'audioActive':''}}">
			<img src="../../res/images/audioIcon.png" w-class="audioIcon"/>
			<div w-class="circleRing" >
				<div w-class="circle" style="clip: rect(0, {{it.istyle[0]}}px, 80px, 0);transform:rotate(90deg);"></div>
				<div w-class="circle" style="clip: rect(0, {{it.istyle[1]}}px, 80px, 0);transform:rotate(-90deg);"></div>
			</div>
		</div>

	</div>
</div>