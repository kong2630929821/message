<div style="position:relative">
    <div w-class="text-message-wrap">
        <div w-class="text-wrap {{it.isYourSelf ? 'yourText' : 'heText'}}">
            {{it.message}}
        </div>
        <div w-class="corner">
            <span w-class="sendTime">{{it.sendTime}}</span>
            <img w-class="isRead" src="../../res/images/{{it.isRead ? 'readed' : 'unread'}}.png" />
        </div>
        <span w-class="{{it.isYourSelf ? 'rightDownTail' : 'leftDownTail'}}"></span>
    </div>
</div>