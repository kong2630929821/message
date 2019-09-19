{{: ty = it.itype == 'password' ? 'password' : 'text'}}
<div w-class="pi-input-box" >
    <input 
        class="pi-input"
        w-class="pi-input__inner" 
        style="{{it.style ? it.style : ''}}"
        type="{{ty}}" 
        autocomplete="off" 
        placeholder="{{it && it.placeHolder ? it.placeHolder : ''}}" 
        value="{{it1 && (it1.currentValue || it1.currentValue==0) ? it1.currentValue : ''}}"
        maxlength="{{it && it.maxLength ? it.maxLength : ''}}"
        on-input="change"
        on-blur="onBlur"
        on-focus="onFocus"
        on-keydown="keydown"
        on-compositionstart="compositionstart"
        on-compositionend="compositionend"
    />
</div>