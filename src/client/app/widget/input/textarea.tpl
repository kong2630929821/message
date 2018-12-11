<div w-class="pi-input-box" class="pi-input">
    <textarea 
        w-class="pi-input__inner" 
        style="{{it.style ? it.style : ''}}"
        type="text" 
        autocomplete="off" 
        placeholder="{{it && it.placeHolder ? it.placeHolder : ''}}" 
        value="{{it1 && it1.currentValue ? it1.currentValue : ''}}"
        maxlength="{{it && it.maxLength ? it.maxLength : ''}}"
        on-input="change"
        on-blur="onBlur"
        on-focus="onFocus"
        on-compositionstart="compositionstart"
        on-compositionend="compositionend"
        rows="{{it1 && it1.rows ? it1.rows : 1}}"
    ></textarea>
</div>