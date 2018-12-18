<div w-class="pi-input-box" class="pi-input" style="{{it && it.style ? it.style : ''}}">
    <div w-class="hideMsg">{{it1.currentValue?it1.currentValue:'1'}}</div>
    <textarea 
        w-class="pi-input__inner" 
        style="{{it.style ? it.style : ''}}"
        type="text" 
        autocomplete="off" 
        placeholder="{{it && it.placeHolder ? it.placeHolder : ''}}" 
        maxlength="{{it && it.maxLength ? it.maxLength : ''}}"
        on-input="change"
        on-blur="onBlur"
        on-focus="onFocus"
        on-compositionstart="compositionstart"
        on-compositionend="compositionend">{{it1.currentValue}}</textarea>
</div>