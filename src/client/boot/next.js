'use strict';
// 依赖表加载成功后的回调函数
winit.initNext = function() {
	var win = winit.win;
	win._babelPolyfill = 1;
	win.pi_modules = 1;
	win.Map = 1;
	var startTime = winit.startTime;
	console.log("init time:", Date.now() - startTime);
	// 清除运营商注入的代码
	var clear = function() {
		//清除window上新增的对象
		var k;
		for(k in window){
			if(window.hasOwnProperty(k) && !win[k])
				window[k] = null;
		}
		//清除body里面的非pi元素（自己添加的元素都有pi属性）
		var i, arr = document.body.children;
		for(i = arr.length - 1; i >= 0; i--) {
			k = arr[i];
			if(!k.getAttribute("pi"))
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
	modProcess.show(function(r){
		modProcess.value = r*0.2;
		divProcess.style.width = (modProcess.value + dirProcess.value) * 100 + "%";
	});
	dirProcess.show(function(r){
		dirProcess.value = r*0.8;
		divProcess.style.width = (modProcess.value + dirProcess.value) * 100 + "%";
	});

	var DOWNLOAD_CFG = { png: "download", jpg: "download", jpeg: "download", webp: "download", gif: "download", svg: "download", mp3: "download", ogg: "download", aac: "download" }
	pi_modules.commonjs.exports.require(["pi/util/html", "pi/widget/util"], {}, function(mods, fm) {
		console.log("first mods time:", Date.now() - startTime, mods, Date.now());
		var html = mods[0], util = mods[1];
		// 判断是否第一次进入,决定是显示片头界面还是开始界面
		var userinfo = html.getCookie("userinfo");
		pi_modules.commonjs.exports.flags = html.userAgent(flags);
		flags.userinfo = userinfo;
		//注册各种数据结构监听器
		var structRegister = function () {
			util.loadDir(["pi/struct/"], flags, fm, undefined, function (fileMap, mods) {
				var structMgr = pi_modules["pi/struct/struct_mgr"].exports;
				var mgr1 = new structMgr.StructMgr();

				for (var k in fm) {
					if(!k.endsWith(".s.js"))
						continue;
					var filePath = k.slice(0, k.length - pi_modules.butil.exports.fileSuffix(k).length - 1);
					var exp = pi_modules[filePath].exports;
					for(var kk in exp){
						if(pi_modules["pi/struct/struct_mgr"].exports.Struct.isPrototypeOf(exp[kk]) && exp[kk]._$info){
							mgr1.register(exp[kk]._$info.nameHash, exp[kk], exp[kk]._$info.name);
						}
					}
				}
				self.__mgr = mgr1;
			}, function (r) {
				alert("加载目录失败, " + (r.error ? (r.error + ":" + r.reason) : r));
			}, dirProcess.handler);
		};
		//加载框架代码
		var loadFramework = function(){
			util.loadDir(["client/rpc/","pi/lang/", "pi/net/", "pi/ui/", "pi/util/"], flags, fm, undefined, function (fileMap) {
				loadApp()
			}, function (r) {
				alert("加载目录失败, " + r.error + ":" + r.reason);
			}, dirProcess.handler);
		}
		//加载APP部分代码，实际项目中会分的更细致
		var loadApp = function () {
			util.loadDir(["client/app/view/"], flags, fm, undefined, function (fileMap) {
				console.log("first load dir time:", Date.now() - startTime, fileMap, Date.now());
				var tab = util.loadCssRes(fileMap);
				// 将预加载的资源缓冲90秒，释放
				tab.timeout = 90000;
				tab.release();
				console.log("res time:", Date.now() - startTime);

				var index = pi_modules.commonjs.exports.relativeGet("client/app/view/index/index").exports;
				index.run();

				document.body.removeChild(div);
				structRegister();
			}, function (r) {
				alert("加载目录失败, " + r.error + ":" + r.reason);
			}, dirProcess.handler);
		}

		html.checkWebpFeature(function(r) {
		flags.webp = flags.webp || r;
			loadFramework()
		});
	}, function(result){
		alert("加载基础模块失败, "+result.error + ":" + result.reason);
	}, modProcess.handler);
};

// 初始化开始
(winit.init = function () {
	if(!winit) return;
	winit.deps && self.pi_modules && self.pi_modules.butil && self._babelPolyfill && winit.initNext();
	(!self._babelPolyfill) && setTimeout(winit.init, 100);
})();
