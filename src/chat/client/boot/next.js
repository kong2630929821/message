'use strict';
// 依赖表加载成功后的回调函数
winit.initNext = function () {
	var win = winit.win;
	win._babelPolyfill = 1;
	win.pi_modules = 1;
	win.Map = 1;
	var startTime = winit.startTime;
	console.log("init time:", Date.now() - startTime);
	// 清除运营商注入的代码
	var clear = function () {
		//清除window上新增的对象
		var k;
		for (k in window) {
			if (window.hasOwnProperty(k) && !win[k])
				window[k] = null;
		}
		//清除body里面的非pi元素（自己添加的元素都有pi属性）
		var i, arr = document.body.children;
		for (i = arr.length - 1; i >= 0; i--) {
			k = arr[i];
			if (!k.getAttribute("pi"))
				document.body.removeChild(k);
		}
	};
	//clear();
	pi_modules.depend.exports.init(winit.deps, winit.path);
	var flags = winit.flags;
	winit = undefined;//一定要立即释放，保证不会重复执行
	var div = document.createElement('div');
	div.setAttribute("pi", "1");
	div.setAttribute("style", "position:absolute;bottom:10px;left: 2%;width: 95%;height: 10px;background: #262626;padding: 1px;border-radius: 20px;border-top: 1px solid #000;border-bottom: 1px solid #7992a8;");
	var divProcess = document.createElement('div');
	divProcess.setAttribute("style", "width: 0%;height: 100%;background-color: rgb(162, 131, 39);border-radius: 20px;");
	div.appendChild(divProcess);
	document.body.appendChild(div);
	var modProcess = pi_modules.commonjs.exports.getProcess();
	var dirProcess = pi_modules.commonjs.exports.getProcess();
	modProcess.show(function (r) {
		modProcess.value = r * 0.2;
		divProcess.style.width = (modProcess.value + dirProcess.value) * 100 + "%";
	});
	dirProcess.show(function (r) {
		dirProcess.value = r * 0.8;
		divProcess.style.width = (modProcess.value + dirProcess.value) * 100 + "%";
	});

	var DOWNLOAD_CFG = { png: "download", jpg: "download", jpeg: "download", webp: "download", gif: "download", svg: "download", mp3: "download", ogg: "download", aac: "download" }
	pi_modules.commonjs.exports.require(["pi/util/html", "pi/widget/util"], {}, function (mods, fm) {
		console.log("first mods time:", Date.now() - startTime, mods, Date.now());
		var html = mods[0], util = mods[1];
		// 判断是否第一次进入,决定是显示片头界面还是开始界面
		var userinfo = html.getCookie("userinfo");
		pi_modules.commonjs.exports.flags = html.userAgent(flags);
		flags.userinfo = userinfo;

		//加载框架代码
		var loadChatFramework = function () {
			util.loadDir(["pi/lang/", "pi/net/", "pi/ui/", "pi/util/"], flags, fm, undefined, function (fileMap) {
				loadChatApp()
			}, function (r) {
				alert("加载目录失败, " + r.error + ":" + r.reason);
			}, dirProcess.handler);
		}

		//加载APP部分代码，实际项目中会分的更细致
		var loadChatApp = function () {
			var sourceList  = [
				"chat/client/app/view/home/",
				"chat/client/app/view/chat/",
				"chat/client/app/view/index.js",
				"chat/client/app/res/css/",
				"chat/client/app/view/contactList/contactList.tpl",
				"chat/client/app/view/contactList/contactList.js",
				"chat/client/app/view/contactList/contactList.wcss",
				"chat/client/app/view/contactList/contactItem.tpl",
				"chat/client/app/view/contactList/contactItem.js",
				"chat/client/app/view/contactList/contactItem.wcss",
				"chat/client/app/widget/",
				"app/publicComponents/",
				"app/api/thirdApi.js",
				"app/postMessage/postMessage.js",
			]
			util.loadDir(sourceList, flags, fm, undefined, function (fileMap) {
				console.log("first load dir time:", Date.now() - startTime, fileMap, Date.now());
				var tab = util.loadCssRes(fileMap);
				// 将预加载的资源缓冲90秒，释放
				tab.timeout = 90000;
				tab.release();
				console.log("res time:", Date.now() - startTime);

				var root = pi_modules.commonjs.exports.relativeGet("pi/ui/root").exports;
				root.cfg.width = 750;
				root.cfg.height = 1334;
				root.cfg.hscale = 0.25;
				root.cfg.wscale = 0;
				document.body.removeChild(div);
				registerChatStruct();
			}, function (r) {
				alert("加载目录失败, " + r.error + ":" + r.reason);
			}, dirProcess.handler);
		}

		//初始化rpc服务
		var registerChatStruct = function () {
			util.loadDir(["chat/client/app/net/", "pi/ui/", "pi/struct/"], flags, fm, undefined, function (fileMap, mods) {
				var tab = util.loadCssRes(fileMap);
				// 将预加载的资源缓冲90秒，释放
				tab.timeout = 90000;
				tab.release();
				console.log("res time:", Date.now() - startTime);

				var root = pi_modules.commonjs.exports.relativeGet("pi/ui/root").exports;
				root.cfg.width = 750;
				root.cfg.height = 1334;
				root.cfg.hscale = 0.25;
				root.cfg.wscale = 0;
				loadPiSdk();
				loadEmoji();
			}, function (r) {
				alert("加载目录失败, " + (r.error ? (r.error + ":" + r.reason) : r));
			}, dirProcess.handler);
		};
		// 全部所需资源下载完成,进入app,显示界面
		var enterApp = function(){
			// 加载根组件
			var index = pi_modules.commonjs.exports.relativeGet("chat/client/app/view/index").exports;
			index.run(function(){
				// 关闭读取界面
				document.body.removeChild(document.getElementById('rcmj_loading_log'));
			});
			pi_modules.commonjs.exports.relativeGet("chat/client/app/net/init").exports.registerRpcStruct(fm);
			pi_modules.commonjs.exports.relativeGet("chat/client/app/net/init").exports.initClient();
			
		}
		var loadPiSdk = function(){
			util.loadDir(["pi_sdk/"], flags, fm, undefined, function (fileMap) {
				pi_sdk.setWebviewManager("pi/browser/webview");
				pi_sdk.piSdkInit((res)=>{
					console.log('bind vm success', res);
					//钱包登录
					pi_modules.commonjs.exports.relativeGet("chat/client/app/net/login").exports.chatLogin(enterApp);	
				});
			}, function (r) {
				alert("加载目录失败, " + r.error + ":" + r.reason);
			}, dirProcess.handler);
		}
		var loadEmoji = function() {
			util.loadDir(["chat/client/app/res/emoji/"],flags,fm,undefined,function(fileMap,mods){
				//TODO: 可以长期放在缓存中达到更快的显示效果
				loadChatImg();
			},function (r) {
				alert("加载目录失败, " + (r.error ? (r.error + ":" + r.reason) : r));
			}, dirProcess.handler)
		}

		var loadChatImg = function () {
			util.loadDir(["chat/client/app/res/chatImg/"],flags,fm,undefined,function(fileMap,mods){
				//TODO: 可以长期放在缓存中达到更快的显示效果

			},function (r) {
				alert("加载目录失败, " + (r.error ? (r.error + ":" + r.reason) : r));
			}, dirProcess.handler)
		}

		html.checkWebpFeature(function (r) {
			flags.webp = flags.webp || r;
			loadChatFramework()
		});
	}, function (result) {
		alert("加载基础模块失败, " + result.error + ":" + result.reason);
	}, modProcess.handler);
};

// 初始化开始
(winit.init = function () {
	if (!winit) return;
	winit.deps && self.pi_modules && self.pi_modules.butil && self._babelPolyfill && winit.initNext();
	(!self._babelPolyfill) && setTimeout(winit.init, 100);
})();
