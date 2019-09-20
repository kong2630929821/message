<div w-class="confirmBox">
    <div w-class="body">
        <div w-class="conTitle">{{it.title}}</div>
        <div w-class="conContent">{{it.content}}</div>
        <div w-class="conInfo">{{it.prompt}}</div>
        <div w-class="btnGroup">
            <div w-class="btn" on-tap="btnCancel" on-down="onShow">{{it.btn1}}</div>
            <div w-class="btn" on-tap="btnOk" on-down="onShow">{{it.btn2}}</div>
        </div>
    </div>
</div>