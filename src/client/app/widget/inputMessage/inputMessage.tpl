<div w-class="outer" ev-input-change="messageChange" ev-emoji-click="pickEmoji" ev-input-focus="inputFocus">
	<div w-class="input-message-wrap">
		<img w-class="audio" on-tap="playRadio" src="../../res/images/audio.png"/>
		<client-app-widget-input-textarea w-class="inputMessage">{placeHolder:"输入消息",input:{{it.message}} }</client-app-widget-input-textarea>
		<img w-class="emoji" on-tap="playRemoji" src="../../res/images/emoji.png"/>
		{{if it.isOnInput}}
		<img w-class="unfold" on-tap="send" src="../../res/images/send.png"/>
		{{else}}
		<img w-class="unfold" on-tap="openTool" src="../../res/images/unfold.png"/>
		{{end}}
	</div>

	<widget w-tag="client-app-widget-emoji-emoji" w-class="emojiMap" id="emojiMap" style="display:{{it.isOnEmoji ? 'block' : 'none'}}"></widget>
</div>