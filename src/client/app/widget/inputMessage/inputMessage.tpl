<div w-class="input-message-wrap" ev-input-change="handleOnInput">
	<img w-class="audio" on-tap="playRadio" src="../../res/images/audio.png"/>
	<client-app-widget-input-input w-class="inputMessage">{placeHolder:"输入消息",input:{{it.message}} }</client-app-widget-input-input>
	<img w-class="emoji" on-tap="playRemoji" src="../../res/images/emoji.png"/>
	{{if it.isOnInput}}
	<img w-class="unfold" on-tap="send" src="../../res/images/send.png"/>
	{{else}}
	<img w-class="unfold" on-tap="openTool" src="../../res/images/unfold.png"/>
	{{end}}
</div>