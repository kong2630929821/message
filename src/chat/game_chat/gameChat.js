// PI_BEGIN
console.log("注入 gameChat.js success");

// 游戏中聊天页面

window.pi_jsApi = {};


function createStyleTag() {
    var cssText = `/* chat */
    .pi-root{
        position: fixed;
        z-index: 999;
        width: 100%;
        top:0;
        zoom: 0.5;
    }
    .gameChatPage{
        display: flex;
        flex-direction: column;
        position:absolute;
        height:680px;
        bottom:0;
        left:0;
        right:0;
        background: rgba(34, 34, 34, 0.95);
    }
    .messageBox{
        overflow-x: hidden;
        overflow-y: auto;
        flex: 1 0 0;
        -webkit-overflow-scrolling: touch;
        display: flex;
        flex-direction: column;
    }
    .text{
        color: #888;
        font-size: 32px;
    }
    .notice{
        height:128px;
        position:absolute;
        top:129px;
        left:0;
        right: 0;
    }
    .loading{
        float: right;
        width: 30px;
        margin-top: 10px;
        margin-right: -35px;
    }
    
    /* topbar */
    .topbar{
        width: 100%; 
        display: flex; 
        align-items: center; 
        justify-content: space-between; 
        position: relative; 
        color: #fff; 
        box-sizing: border-box; 
        height: 80px;
        background:rgba(59,61,67,1);
    }
    .topTitle{
        flex: 1 0 0px; 
        display: flex; 
        align-items: center; 
        line-height: 80px;
        font-size: 28px;
    }
    .closePop{
        width: 48px;
        height: 48px;
        margin: 0px 15px;
        border: 15px solid transparent;
        line-height: 80px;
        position: absolute;
        right: 0;
    }
    
    /* messageitem */
    .text-wrap{
        max-width:512px;
        padding:16px;
        font-size:24px;
        border-radius:16px;
        color: #fff;
        background:#3B3D43;
        overflow: hidden;
        word-break: break-all;
    }
    .rightDownTail{
        float: right;
        transform: translateX(18px);  
        width:20px;
        height:20px;
        margin-top: -20px;
        border-radius:0 20px 0 0;
        border-top: 10px solid #3B3D43;
    }
    .leftDownTail{
        width:20px;
        height:20px;
        margin-top: 20px;
        border-radius: 0px 0px 0 20px;
        border-bottom: 10px solid #3B3D43;
    }
    .avatar{
        width: 80px;
        height: 80px;
        margin-right: 10px;
    }
    .username{
        height:33px;
        font-size:24px;
        color:#888888;
        line-height:33px;
        margin-left: 110px;
        margin-top: 10px;
    }
    .recallMsg{
        font-size: 22px;
        text-align: center;
        color: #888;
        margin: 20px;
    }
    .recallBtn{
        width: 170px;
        height: 80px;
        background: #fff;
        box-shadow: rgba(0, 0, 0, 0.2) 0px 0px 20px 0px;
        border-radius: 6px;
        font-size: 32px;
        line-height: 80px;
        padding-left: 20px;
    }
    .img-wrap{
        position: relative;
    }
    .radio-wrap{
        padding:16px;
        font-size: 32px;
        border-radius:16px;
        color: #fff;
        background:#3B3D43;
        display: flex;
        align-items: center;
        min-width: 250px;
        max-width: 512px;
    }
    .imgCorner{
        position: absolute;
        bottom: 10px;
        right: 5px;
        display: flex;
        align-items: center;
        background: rgba(34, 34, 34, 0.5);
        padding: 0 10px;
        border-radius: 18px;
        font-size: 24px;
    }
    .playBtn{
        width: 35px;
        height: 35px;
        margin-right: 10px;
    }
    
    /* inputmessage */
    .inputOuter{
        background-color: #3B3D43;
    }
    .input-message-wrap{
        display: flex;
        align-items:center;
    }
    .audio{
        height: 60px;
        margin: 5px 20px;
        border: 20px solid transparent;
    }
    .inputMessage{
        flex: 1 0 0;
        outline:none;
        border:none;
        font-size:32px;
    }
    .emoji{
        width: 44px;
        height: 44px;
        border: 20px solid transparent;
    }
    .unfold{
        width: 44px;
        height: 44px;
        margin-right: 10px; 
        border: 20px solid transparent;
    }
    .emojiMap{
        height:260px;
        overflow-x:hidden;
        overflow-y:auto;
        min-height: 300px;
        border-top: 1px solid rgb(204, 204, 204);
    }
    .toolsMap{
        height: 420px;
        min-height: 420px;
    }
    .toolItem{
        display: flex;
        flex-direction: column;
        font-size: 24px;
        color: #888888;
        align-items: center;
        width: 120px;
        margin-left: 50px;
        margin-top: 40px;
    }
    .toolImg{
        width:120px;
        height:120px;
        background:rgba(255,255,255,1);
        border-radius:12px;
        border:1px solid rgba(204,204,204,1);
    }
    .radioWrap{
        position: absolute;
        bottom: 200px;
        left: 50%;
        transform: translateX(-50%);
        width: 180px;
        height: 180px;
        background: rgba(85,85,85,.5);
        border-radius: 50%;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding-top: 40px;
    }
    .radioWrite{
        width: 30px;
        height: 15px;
        background: #fff;
        margin-top: 20px;
        margin-left: 75px;
    }
    /* textarea */
    .pi-input-box{
        position: relative;
        height: auto;
        color: #222;
        font-size: 32px;
        max-height: 240px;
        flex: 1 0 0;
        margin-left: 20px;
    }
    .pi-input__inner{
        appearance:none;
        -moz-appearance:none; /* Firefox */
        -webkit-appearance:none; /* Safari 和 Chrome */
        background-color: #3B3D43;
        border: none;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        display: inline-block;
        font-size: inherit;
        outline: 0;
        -webkit-transition: border-color .2s cubic-bezier(.645,.045,.355,1);
        transition: border-color .2s cubic-bezier(.645,.045,.355,1);
        width: 100%;
        color: #CCCCCC;
        font-size: 32px;
        position: absolute;
        top: 20px;
        bottom: 0;
        word-break: break-all;
        font-family: monospace;
        line-height: 40px;
    }
    .hideMsg{
        display:block;
        visibility:hidden;
        white-space: pre-wrap;
        word-break: break-all;
        padding: 20px 0;
        font-family: monospace;
        line-height: 40px;
    }
    /* 语音消息录制时动画 */
    @keyframes radio1{
        50% {opacity: 0}
        90%{opacity: 0}
        100% {opacity: 1;}
    }
    @keyframes radio2{
        50% {opacity: 0}
        60%{opacity: 1}
        100% {opacity: 1;}
    }
    .emojiMsg{
        width: 44px;
        height: 44px;
    }
    .imgMsg{
        max-width: 300px;
        max-height: 300px;
        min-width: 100px;
        min-height: 100px;
        border-radius: 12px;
    }
    .linkMsg{
        color: #0c6bc7;
    }
    .bubble{
        width:100px;
        height:100px;
        background:rgba(34,34,34,0.7);
        border-radius: 50%;
        text-align: center;
        position: absolute;
        right: 0;
    }
    .redSpot{
        width:10px;
        height:10px;
        background:rgba(206,57,57,1);
        position: absolute;
        border-radius: 50%;
        top: 20px;
        left: 70px;
        border: 1px solid #fff;
        display: none;
    }
    .modal-mask{
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: rgba(50, 50, 50, 1);
        position:absolute;
        width:100%;
        height:100%;
        top:0;
        left:0;
        overflow-x: hidden;
        overflow-y: auto;
    }`;
    
    var style = document.createElement("style");
    style.type = "text/css";
    style.innerHTML = cssText;
    document.getElementsByTagName("head")[0].appendChild(style);
}

function createElementTag(){
    var htmlText = `<section id="gamechat_section1">
    <div class="bubble" id="gamechat_bubble" onclick="openChatPage()" >
        <span class="redSpot" id="gamechat_redSpot"></span>
        <img src="${chatBaseUrl}/res/images/chat-empty.png" style="width:40px;margin-top: 30px;"/>
    </div>
    </section>
    <!-- 展开页面 -->
    <section id="gamechat_section2" style="display:none">
    <div class="gameChatPage">
        <div class="topbar">
            <div class="topTitle"> 
                <span id="gameChat_groupName" style="margin-left:20px;">groupName(num)</span>
                <img src="${chatBaseUrl}/res/images/close_blue.png" class="closePop" onclick="closePop()"/>
            </div>
        </div>
        <div class="messageBox" id="gameChat_messageBox"></div>
        <div class="inputOuter" >
            <div class="input-message-wrap">
                <div class="pi-input-box chat-input">
                    <div class="hideMsg" id="gameChat_hideMsg">1</div>
                    <textarea 
                        id="gameChat_textarea"
                        unchange = "true"
                        class="pi-input__inner" 
                        type="text" 
                        autocomplete="off" 
                        placeholder="输入消息"></textarea>
                </div>
                <img class="emoji" onclick="playEmoji()" src="${chatBaseUrl}/res/images/emoji.png"/>
                <img class="unfold" onclick="sendMess()" src="${chatBaseUrl}/res/images/send.png"/>
            </div>
            <div class="emojiMap" id="gameChat_emojiMap" style="display:none;"></div>
            <div class="radioWrap" style="display:none">
                <div class="radioWrite" style="animation: radio1 1s infinite;"></div>
                <div class="radioWrite" style="animation: radio2 1s infinite;"></div>
                <div class="radioWrite"></div>
            </div>
        </div>
    </div>
</section>`;
    var $root = document.createElement("div");
    $root.setAttribute("class","pi-root");
    // $root.setAttribute("style",browserAdaptive());
    
    $root.innerHTML = htmlText;

    var $body = document.querySelector("body");
    $body.appendChild($root);
    $root.addEventListener('click',function(){
        document.querySelector('#gameChat_emojiMap').style.display = 'none';
    })
}

// 定义变量
const gid = 10001;
const filePath = "chat/client/app/view/gameChatApi";
const chatBaseUrl=`http://192.168.31.226/wallet/chat/client/app`;
var messList = [];
var readLast = '';
var uid;
var uploadFileUrlHead; // 上传的文件链接
var EMOJIS_MAP = new Map();


// 打开聊天界面
function openChatPage(){
    document.querySelector('#gamechat_section1').style.display = 'none';
    document.querySelector('#gamechat_section2').style.display = 'block';
    document.querySelector('#gamechat_redSpot').style.display = 'none';
    document.querySelector('.pi-root').style.height = '100%';
    readLast = messList[messList.length-1];
}

// 关闭聊天界面
function closePop(){
    document.querySelector('#gamechat_section1').style.display = 'block';
    document.querySelector('#gamechat_section2').style.display = 'none';
    document.querySelector('#gamechat_redSpot').style.display = 'none';
    document.querySelector('.pi-root').style.height = 'auto';
    readLast = messList[messList.length-1];
}

// // 点击气泡
// function touchBubble(){
//     event.preventDefault();
//     console.log('touchBubble',event.touches[0].pageY);
// }
// // 拖动气泡
// function moveBubble(){
//     const top = event.changedTouches[0].pageY;
//     const left = event.changedTouches[0].pageX;
//     document.querySelector('#gamechat_bubble').style.top=top+'px';
//     document.querySelector('#gamechat_bubble').style.left=left+'px';
//     console.log('moveBubble',top);
// }
// // 停止拖动，放置气泡
// function placeBubble(){
//     const top=event.changedTouches[0].pageY;
//     const left=event.changedTouches[0].pageX;
//     document.querySelector('#gamechat_bubble').style.top=top+'px';
//     if(left < document.body.clientWidth/2){
//         document.querySelector('#gamechat_bubble').style.left=0;
//     }else{
//         document.querySelector('#gamechat_bubble').style.left='none';
//     }
//     console.log('placeBubble',top);
// }

// 加载页面 立即执行
window.onload = function(){
    createStyleTag();
    createElementTag();
    pi_RPC_Method(filePath, "getBaseInfo", gid, function (error, result) {
        uid = result.uid;
        messList.push(result.lastRead);
        readLast = result.lastRead;
        document.getElementById('gameChat_groupName').innerText = result.groupName;
        uploadFileUrlHead = result.uploadFileUrlHead;
        for(var v of result.EMOJIS){ // 表情包图库
            EMOJIS_MAP.set(v[0],v[2]);
        }
        getMessageList();
        addEmoji();
    });

};

// 打开表情包
function playEmoji(){
    event.stopPropagation();
    const emojimap = document.querySelector('#gameChat_emojiMap');
    emojimap.style.display = emojimap.style.display=='none'?'block':'none';
}

// 获取消息记录
function getMessageList(){
    setTimeout(() => {
        pi_RPC_Method(filePath, "getMessList", gid, function (error, result) {
            if(readLast != result[result.length-1]){
                document.querySelector('#gamechat_redSpot').style.display = 'block';
            }
            if(!error && result && result.length > 0 && messList[messList.length-1] != result[result.length-1]){
                var ind = result.findIndex(item=>item==messList[messList.length-1]) + 1;
                for(var i=ind; i<result.length; i++){
                    const id = result[i];
                    getMessDetail(id);
                }
            }
        });
        getMessageList();
    }, 1000);
}

// 发送消息
var newMsg = false;
function sendMess(){
    const mess = document.querySelector('.pi-input__inner').value;
    if(!mess){
        return;
    }
    const param = {
        gid,
        message:mess
    }
    document.querySelector('#gameChat_textarea').value = "";
    document.querySelector('#gameChat_hideMsg').innerText = "1";

    pi_RPC_Method(filePath, "sendMessage", param, function (error, result) {
        console.log('sendMessage',result);
        if(!error && result){
            addMessage(result.msg, result.msg.sid == uid);
            // messList.push(result.hIncId);
            newMsg = true;
        }
    });
}

// 查看大图
function openBigImage(){
    const url = event.target.src; // 触发事件的子元素
    const $image = document.createElement('div');
    $image.classList.add('modal-mask');
    $image.innerHTML = `<img src="${url}" style="max-width: 90%;"/>`;
    var $body = document.querySelector("body");
    $body.appendChild($image);
    $image.addEventListener('click',function(){
        $body.removeChild($image);
    })
}

// 获取消息内容
function getMessDetail(id){
    console.log("getdetail id:",id,"messList: ",messList);
    const ind = messList.findIndex(item=>item==id);
    if(ind > -1){
        return;
    }
    requestAnimationFrame(function(){
        pi_RPC_Method(filePath, "getDetail", id, function (error, result) {
            console.log("getdetail id: ",id,",result: ",result);
            const ind = messList.findIndex(item=>item==id);
            if(ind > -1){
                return;
            }
            if(!error && result){
                if(newMsg){
                    document.getElementById('gameChat_messageBox').lastChild.remove();// TODO
                    newMsg = false;
                }
                addMessage(result, result.sid == uid);
                messList.push(id);
            }
        });
        
    });
}

// 深拷贝
const depCopy = (v) => {
    return JSON.parse(JSON.stringify(v));
};

// 转换文字中的链接
const httpHtml = (str) => {
    const reg = /(http:\/\/|https:\/\/)((\w|=|\?|\.|\/|&|-|:|#)+)/g;
    
    return str.replace(reg, '<a href="javascript:;" class="linkMsg">$1$2</a>');
};

// 转换表情包
const parseEmoji = (msg) => {    
    msg.msg = httpHtml(msg.msg);
    msg.msg = msg.msg.replace(/\[(\S+?)\]/ig, (match, capture) => {
        const url = EMOJIS_MAP.get(capture) || undefined;
        if (url) {
            return `<img src="${chatBaseUrl}/res/emoji/${url}" alt="${capture}" class='emojiMsg'></img>`;
        } else {
            return match;
        }
    });

    return msg;
};

// 转换图片;
const parseImg = (msg) => {    
    msg.msg = msg.msg.replace(/\[(\S+?)\]/ig, (match, url) => {
        return `<img src="${uploadFileUrlHead}${url}" alt="img" class='imgMsg'></img>`;
    });

    return msg;
};

// 转换音频文件
const parseRadio = (msg) => {
    const value = msg.msg;
    msg.msg = `${value.time}"<audio src="${uploadFileUrlHead}${value.message}">语音信息</audio>`;
    msg.width = value.time;

    return msg;
};

// 点击播放语音
const playRadioMess= ()=> {
    // 当前点击的语音
    const elem = event.currentTarget.getElementsByTagName('audio')[0];
    const img = event.currentTarget.getElementsByTagName('img')[0];
    // 关掉所有语音
    const audios = document.getElementsByTagName('audio');
    for (const i of audios) {
        if(i.src!==elem.src){// 清空其他的语音播放
            i.pause();
            i.currentTime = 0;
            i.parentElement.parentElement.getElementsByTagName('img')[0].src = `${chatBaseUrl}/res/images/play-radio.png`;
            i.setAttribute('playing',false); 
        }
    }
    
    const isPlay = elem.getAttribute('playing'); // 当前语音的播放状态
    if ( isPlay && isPlay != 'false') {
        img.src = `${chatBaseUrl}/res/images/play-radio.png`;
        console.log('暂停播放语音');
        elem.setAttribute('playing',false);  // 暂停播放
        for(const i of audios){
        }

    } else {
        console.log('开始播放语音');
        img.src = `${chatBaseUrl}/res/images/stop-radio.png`;
        elem.play();
        elem.setAttribute('playing',true);  // 表示正在播放
        
        setTimeout(() => {
            if (elem.currentTime === elem.duration) {
                console.log('结束播放语音');
                img.src = `${chatBaseUrl}/res/images/play-radio.png`;
                elem.pause();
                elem.currentTime = 0;
                elem.setAttribute('playing',false);  // 停止播放
            }
            
        }, elem.duration * 1000 + 500); // 多加半秒，确保语音播完
    }
}

// 定位最新消息
function lastestMsg(){
    document.querySelector('#gameChat_messageBox').scrollTop = document.querySelector('#gameChat_messageBox').scrollHeight;
}

// 显示消息内容
function addMessage(mess,me){
    var item = document.createElement('div');
    var innerhtml = '';
    if(mess.cancel){
        return;
    }
    if(mess.mtype<5 || mess.mtype==9){
        if(me){
            innerhtml +=  `<div style="overflow:hidden;">
            <div style="position:relative;margin: 10px 40px 0;float: right;">`;
        }else{
            innerhtml += `<div style="overflow:hidden;">
            <div class="username">${mess.name}</div>
            <div style="display:flex;margin:10px 20px;">
                <img src="${chatBaseUrl}/res/images/user.png" class="avatar"/>`;
        }
    }
    switch(mess.mtype){
        case 1: // 文本消息
            var resMess = parseEmoji(depCopy(mess));
            if(me){
                innerhtml += `<div class="text-wrap">
                <div style="display: inline;white-space: pre-wrap;">${resMess.msg}</div>
            </div>
            <span class="rightDownTail"></span>`;
            }else{
                innerhtml += `<span class="leftDownTail"></span>
            <div class="text-wrap">
                <div style="display: inline;white-space: pre-wrap;">${resMess.msg}</div>
            </div>`;
            }
            
            break;
        case 2: // 图片
            var resMess = parseImg(depCopy(mess));
            if(me){
                innerhtml += `<div class="img-wrap" onclick="openBigImage()" >${resMess.msg}</div>`
            }else{
                innerhtml += `<div class="img-wrap" onclick="openBigImage()">${resMess.msg}</div>`
            }
            
            break;
        case 3: // 语音
            var resMess = parseRadio(depCopy(mess));
            if(me){
                innerhtml +=`<div class="radio-wrap" onclick="playRadioMess()" style="width:${resMess.width}px">
                    <img class="playBtn" src="${chatBaseUrl}/res/images/play-radio.png"/>
                    <div style="display: inline;white-space: pre-wrap;">${resMess.msg}</div>
                </div>
                <span class="rightDownTail"></span>`
                break;
            }else{
                innerhtml += `<span class="leftDownTail"></span>
            <div class="radio-wrap" onclick="playRadioMess()" style="width:${resMess.width}px">
                <img class="playBtn" src="${chatBaseUrl}/res/images/play-radio.png"/>
                <div style="display: inline;white-space: pre-wrap;">${resMess.msg}</div>
            </div>`
            }
            break;
        case 5: // 撤回消息
            innerhtml +=`<div class="recallMsg">${mess.me ? "你" : mess.name}撤回了一条消息</div>`
            break;
        case 9: // 红包
            innerhtml += `<div class="recallMsg" style="font-size:32px;">有红包来了，可到平台中去领取</div>`
            break;
        case 10: // 创建群聊
            innerhtml +=`<div class="recallMsg" style="font-size:32px;">${mess.msg}</div>`
            break;
        case 11: // 加群成功
            innerhtml +=`<div class="recallMsg" style="font-size:32px;">${mess.me ? "你" : mess.name}已成功加入群组</div>`
            break;
        default: 
    }
    innerhtml += `</div></div>`
    item.innerHTML = innerhtml;
    document.getElementById('gameChat_messageBox').appendChild(item);
    lastestMsg();
}

// 添加表情
function addEmoji(){
    const emoji = document.querySelector('#gameChat_emojiMap');
    var innerHTML = '';
    for(var v of EMOJIS_MAP){
        innerHTML += `<img style="width:44px;height:44px;border: 10px solid transparent;" src="${chatBaseUrl}/res/emoji/${v[1]}" alt="${v[0]}"  onclick="pickEmoji('[${v[0]}]')"/>`;
    }
    emoji.innerHTML = innerHTML;
}

// 选择表情
function pickEmoji(emoji){
    event.stopPropagation();
    document.querySelector("#gameChat_textarea").value += emoji;
}

// 适配屏幕高宽
function browserAdaptive() {
    var cfg = {
        width: 750, height: 1334, wscale: 0, hscale: 0.25, full: false
    };
    var clientWidth = document.documentElement.clientWidth;
    var clientHeight = document.documentElement.clientHeight;
    oldHeight = clientHeight;
    rootWidth = cfg.width;
    rootHeight = cfg.height;
    let scaleW = clientWidth / rootWidth;
    let scaleH = clientHeight / rootHeight;
    if (cfg.wscale >= cfg.hscale) {
        // 宽度比例变动
        if (scaleW > scaleH * (cfg.wscale + 1)) {
            // 大于规定的比例
            rootWidth = rootWidth * (cfg.wscale + 1) | 0;
        } else {
            rootWidth = (clientWidth / scaleH) | 0;
        }
        rootScale = scaleW = scaleH;
    } else {
        // 高度比例变动
        if (scaleH > scaleW * (cfg.hscale + 1)) {
            rootHeight = rootHeight * (cfg.hscale + 1) | 0;
        } else {
            rootHeight = (clientHeight / scaleW) | 0;
        }
        rootScale = scaleH = scaleW;
    }
    rootX = (clientWidth - rootWidth) / 2;
    rootY = (clientHeight - rootHeight) / 2;
    var cssText = 'z-index:99999;position:fixed;overflow:hidden;left: ' + rootX + 'px;top: ' + rootY + 'px;width:' + rootWidth + 'px;height: ' + rootHeight + 'px;-webkit-transform:scale(' + scaleW + ',' + scaleH + ');-moz-transform:scale(' + scaleW + ',' + scaleH + ');-ms-transform:scale(' + scaleW + ',' + scaleH + ');transform:scale(' + scaleW + ',' + scaleH + ');';
    return cssText;
};

// 不同webview之间的通信
window.pi_RPC_Method = (function() {
    var rpcID = 0;
    var rpcIDMap = {};

    /**
     * 往指定名字的WebView调用指定模块的导出方法
     * data: 指定对方WebView执行的模块和导出方法
     * callback：返回结果的回调函数
     * 注：RPC都是一来一回的结构，没有注册一次可以调用多次的结构！
     */
    var rpcCall = function(moduleName, methodName, param, callback) {
        var RPC_CALL_START = "$WEBVIEW_RPC_CALL: ";
        var RPC_CALLBACK_PARAM = "$WEBVIEW_RPC_FUNCTION_PARAM: ";

        var funcs = [callback];

        var id = ++rpcID;
        rpcIDMap[id] = funcs;

        var sign = {
            moduleName: moduleName, // 模块名
            methodName: methodName, // 模块的导出方法名
            params: [param, RPC_CALLBACK_PARAM + 0], // 参数组成的数组，这里参数的回调函数全部转成Callback ID
            rpcID: id // 可选：调用rpc前注册到Map的RPC ID
        };

        var data = RPC_CALL_START + JSON.stringify(sign);

        nativeCall("WebViewManager", "postWebViewMessage", 0, [
            "default",
            data
        ]);
    };

    var webViewManager = undefined;
    var webViewManagerCallWaits = [];

    var nativeCall = function(className, methodName, listenerID, args) {
        args = args || [];

        if (!webViewManager && methodName !== "init") {
            webViewManagerCallWaits.push([
                className,
                methodName,
                listenerID,
                args
            ]);
            return;
        }

        if (navigator.userAgent.indexOf("YINENG_ANDROID") >= 0) {
            window.JSBridge.postMessage(
                className,
                methodName,
                webViewManager || 0,
                listenerID,
                JSON.stringify(args)
            );
        } else if (navigator.userAgent.indexOf("YINENG_IOS") >= 0) {
            window.webkit.messageHandlers.Native.postMessage([
                className,
                methodName,
                webViewManager || 0,
                listenerID,
                ...args
            ]);
        }
    };

    window.handle_Native_ThrowError = function(className, methodName, message) {
        alert(
            "handle_Native_ThrowError, className = " +
                className +
                ", methodName = " +
                methodName +
                ", message = " +
                message
        );
    };

    window.handle_Native_Message = function(cbID, code, ...args) {
        if (cbID === 0) return;

        var cb = callIDMap[cbID];
        if (cb) {
            cb.apply(undefined, args);
            delete callIDMap[cbID];
        }
    };

    window["onWebViewPostMessage"] = function(fromWebView, message) {
        var RPC_REPLY_START = "$WEBVIEW_RPC_REPLY: ";

        // 收到对方的rpc回应，处理
        if (message.startsWith(RPC_REPLY_START)) {
            message = message.slice(RPC_REPLY_START.length);
            var data = JSON.parse(message);
            return handleRpcReply(data);
        }
    };

    var handleRpcReply = function(sign) {
        var funcs = rpcIDMap[sign.rpcID];
        var f = funcs && funcs[sign.callbackID];
        if (f) {
            f.apply(undefined, sign.args);
        }

        delete rpcIDMap[rpcID];
    };

    var callIDMax = 0;
    var callIDMap = {};

    var callID = ++callIDMax;
    callIDMap[callID] = function(id) {
        webViewManager = id;

        for (var i = 0; i < webViewManagerCallWaits.length; ++i) {
            (function(w) {
                setTimeout(() => {
                    nativeCall(w[0], w[1], w[2], w[3]);
                }, 0);
            })(webViewManagerCallWaits[i]);
        }

        webViewManagerCallWaits.length = 0;
    };

    nativeCall("WebViewManager", "init", callID);
    return rpcCall;
})();



// PI_END