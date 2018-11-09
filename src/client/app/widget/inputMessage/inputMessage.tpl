<div w-class="input-message-wrap" ev-input-change="HandleOnInput">
        <img w-class="audio" on-tap="playRadio" src="../../res/images/audio.png"/>
        <client-app-widget-input-input w-class="inputMessage">{placeHolder:"输入消息"}</client-app-widget-input-input>
        <img w-class="emoji" on-tap="playRemoji" src="../../res/images/emoji.png"/>
        <img w-class="unfold" on-tap="openTool" on-tap="send" src="../../res/images/{{ it.isOnInput ? 'send.png' : 'unfold.png'}}"/>
</div>