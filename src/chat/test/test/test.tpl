<div w-class="box" style="position: absolute;top:0;bottom:0;left:0;right: 0; background-color: rgb(170, 221, 221);height: -webkit-fill-available;position: fixed;width: -webkit-fill-available;">
    {{for index,button of it.bts}}
        <span w-class="test-btn" on-tap="onTap({{index}})">{{button.name}}</span>
    {{end}}
</div>