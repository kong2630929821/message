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


	var modProcess = pi_modules.commonjs.exports.getProcess();
	var dirProcess = pi_modules.commonjs.exports.getProcess();
	modProcess.show(function (r) {
		// modProcess.value = r * 0.2;
		// divProcess.style.width = (modProcess.value + dirProcess.value) * 100 + "%";
	});
	dirProcess.show(function (r) {
		// dirProcess.value = r * 0.8;
		// divProcess.style.width = (modProcess.value + dirProcess.value) * 100 + "%";
	});

	var html,util;
	var fm;  // fileMap

	(function(){
		console.time("loadResource complete");
		pi_modules.commonjs.exports.require(["pi/util/html", "pi/widget/util"], {}, function (mods, fileMap) {
			console.log("first mods time:", Date.now() - startTime, mods, Date.now());
			html = mods[0];
			util = mods[1];
			fm = fileMap;
			// 判断是否第一次进入,决定是显示片头界面还是开始界面
			var userinfo = html.getCookie("userinfo");
			pi_modules.commonjs.exports.flags = html.userAgent(flags);
			flags.userinfo = userinfo;
	
			/**
			 * 先判断浏览器对webp的支持；
			 * 加载所有的预处理图片
			 * 第一级目录：首页需要的资源；
			 * 第二级目录：其他；
			 * 
			 */
			html.checkWebpFeature(function (r) {
				flags.webp = flags.webp || r;
				loadChatApp();
			});

		}, function (result) {
			alert("加载基础模块失败, " + result.error + ":" + result.reason);
		}, modProcess.handler);
	})();


	//加载APP部分代码，实际项目中会分的更细致
	var loadChatApp = function () {
		var sourceList  = [
			"chat/client/app/net/login.js",	
			"chat/client/app/view/index.js",
			"chat/client/app/view/chat/chat.tpl",
			"chat/client/app/view/chat/chat.js",
			"chat/client/app/view/chat/chat.wcss",
			"chat/client/app/group/latestAnnItem.tpl",
			"chat/client/app/group/latestAnnItem.js",
			"chat/client/app/group/latestAnnItem.wcss",
			"chat/client/app/res/css/",
			// "chat/client/app/widget/",

			"app/publicComponents/",
			"app/api/thirdApi.js",
			"app/postMessage/postMessage.js",
		]
		util.loadDir(sourceList, flags, fm, undefined, function (fileMap) {
			// console.log("first load dir time:", Date.now() - startTime, fileMap, Date.now());
			console.timeEnd("loadResource complete");

			var tab = util.loadCssRes(fileMap);
			// 将预加载的资源缓冲90秒，释放
			tab.timeout = 90000;
			tab.release();

			var root = pi_modules.commonjs.exports.relativeGet("pi/ui/root").exports;
			root.cfg.width = 750;
			root.cfg.height = 1334;
			root.cfg.hscale = 0.25;
			root.cfg.wscale = 0;
			loadPiSdk();
			// loadEmoji();
		}, function (r) {
			alert("加载目录失败, " + r.error + ":" + r.reason);
		}, dirProcess.handler);
	}


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
				// 登录
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
		util.loadDir(["chat/client/app/res/image/"],flags,fm,undefined,function(fileMap,mods){
			//TODO: 可以长期放在缓存中达到更快的显示效果

		},function (r) {
			alert("加载目录失败, " + (r.error ? (r.error + ":" + r.reason) : r));
		}, dirProcess.handler)
	}
};

// 初始化开始
(winit.init = function () {
	if (!winit) return;
	winit.deps && self.pi_modules && self.pi_modules.butil && self._babelPolyfill && winit.initNext();
	(!self._babelPolyfill) && setTimeout(winit.init, 100);
})();
