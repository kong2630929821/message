<div style="position:absolute;width:100%;height:100%;top:0px;left:0px;background-color:gray;">
        <div w-class="contact-item-wrap">
            <div w-class="contact-wrap">
                <div w-class="avator-wrap">
                    <img w-class="avator" src="../../../res/images/{{it.avatorPath}}" />
                </div>
                <span w-class="text">{{it.text}}</span>
                {{if it.isNewAdd}}
                <div w-class="other">
                    {{it.totalNew}}
                </div>
                {{end}}
            </div>
        </div>
    </div>