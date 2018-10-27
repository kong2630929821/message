<div style="position:absolute;width:100%;height:100%;top:0px;left:0px;background-color:gray;">
    <div w-class="input-message-wrap" ev-input-text="HandleOnInput">
        <img w-class="audio" on-tap="playRadio" src="../../../res/images/audio.png"/>
        <pi-ui-input w-class="inputMessage">{text:"输入消息"}</pi-ui-input>
        <img w-class="emoji" on-tap="playRemoji" src="../../../res/images/emoji.png"/>
        <img w-class="unfold" on-tap="openTool" src="../../../res/images/{{ it1.isOnInput ? 'send.png' : 'unfold.png'}}"/>
    </div>
</div>