<div w-class="page" on-tap="close">
    <div w-class="search">
        <div w-class="input" ev-input-change="inputChange">
            <widget w-tag="chat-management-components-input">{itype:"text",placeHolder:"手机号,好嗨ID"}</widget>
            <img src="../../../res/images/search-gray.png" alt="" w-class="searchIcon"/>
        </div>
        <div w-class="searchBtn" on-down="onShow" on-tap="search">搜索</div>
    </div>

    <div ev-table-detail="goDetail" style="margin-top:37px;">
        <div w-class="tableTitle">数据列表</div>
        <widget w-tag="chat-management-components-table" style="max-height:550px;">{datas: {{it.showDataList}},title:{{it.showTitleList}},needCheckBox:false,inlineBtn2:"查看详情"}</widget>
    </div>
</div>
