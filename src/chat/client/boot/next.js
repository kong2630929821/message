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
	// pi_update.severIp = winit.severIp;
	// pi_update.severPort = winit.severPort;
	// pi_update.inAndroidApp = winit.inAndroidApp;
	// pi_update.inIOSApp = winit.inIOSApp;
	// pi_update.inApp = winit.inApp;
	winit = undefined;//一定要立即释放，保证不会重复执行

	// var div = document.createElement('div');
	// div.setAttribute("pi", "1");
	// div.setAttribute("style", "position:absolute;bottom:10px;left: 2%;width: 95%;height: 10px;background: #262626;padding: 1px;border-radius: 20px;border-top: 1px solid #000;border-bottom: 1px solid #7992a8;");
	// var divProcess = document.createElement('div');
	// divProcess.setAttribute("style", "width: 0%;height: 100%;background-color: rgb(162, 131, 39);border-radius: 20px;");
	// div.appendChild(divProcess);
	// document.body.appendChild(div);

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

	// ====================================更新开始=============================================================
	// /**
	//  * 更新App和H5,策略如下:
	//  *     1. 同时检查是否需要更新，超时1秒钟即可
	//  *     2. 如果App需要更新，更新App，并重启（Android/iOS底层自动）
	//  *     3. 否则，如果H5需要更新，更新H5并重新reload
	//  *     4. 否则调用加载函数load加载项目资源；
	//  */
	// var isAppNeedUpdate = undefined;
	// var isH5NeedUpdate = undefined;
	// console.time("update check");
	// var h5UpdateMod = pi_modules.update.exports;
	// var appUpdateMod = pi_modules.appUpdate.exports;
	// var start = new Date().getTime();
	// appUpdateMod.init(function () {
	// 	appUpdateMod.needUpdate(function (isNeedUpdate) {
	// 		 self.checkUpdateTime = new Date().getTime() - start;
	// 		if (isNeedUpdate > 0) {
	// 			var updateContent = [];
	// 			if (navigator.userAgent.indexOf('YINENG_ANDROID') >= 0) { // android
	// 				updateContent = pi_update.updateJson.androidUpdateContent || [];
	// 			}else if(navigator.userAgent.indexOf('YINENG_IOS') >= 0) { // ios
	// 				updateContent = pi_update.updateJson.iosUpdateContent || [];
	// 			}else{  // 浏览器
	// 				updateContent = pi_update.updateJson.androidUpdateContent || [];
	// 			}
	// 			var option = {
	// 				updated:updateContent,
	// 				version:"",//appUpdateMod.getAppRemoteVersion() app更新不显示版本号
	// 				alertBtnText:"App 需要更新"
	// 			};
	// 			pi_update.modifyContent(option);
	// 			appUpdateMod.update(function (isSuccess) {
	// 				pi_update.closePop();
	// 				// alert("更新失败");
	// 				console.log("appUpdate " + isSuccess);
	// 			},function(total,process){
	// 				console.log("total = " + total + " process = " + process);
	// 				var e = { type: "saveFile", total: total, count: process};
	// 				pi_update.updateProgress(e);
	// 			});
	// 		} else {
	// 			// 只有在这种情况下才有可能更新H5
	// 			isAppNeedUpdate = isNeedUpdate;
	// 			if (isH5NeedUpdate !== undefined) {
	// 				updateH5();
	// 			}
	// 		}
	// 	});

	// 	h5UpdateMod.setServerInfo("app/boot/");
	// 	h5UpdateMod.checkUpdate(function (updateFlag) {

	// 		isH5NeedUpdate = updateFlag;
	// 		if (isAppNeedUpdate !== undefined) {
	// 			updateH5();
	// 		}
	// 	});
	// });

	// function updateH5() {
	// 	var needUpdate = false;
	// 	function updateError(){  // 更新出错界面
	// 		var updateContent = pi_update.updateJson.h5UpdateContent || [];
	// 		var updateVersion =  pi_update.updateJson.version || "";
	// 		var option = {
	// 			updated:updateContent,
	// 			version:updateVersion,
	// 			updateError:true
	// 		};
	// 		pi_update.modifyContent(option);
	// 	}
	// 	if (isH5NeedUpdate === h5UpdateMod.UPDATE_FLAG_NO_UPDATE) {
	// 		// 不需要更新
	// 		needUpdate = false;
	// 	} else if (isH5NeedUpdate === h5UpdateMod.UPDATE_FLAG_LAST) {
	// 		// alert("上次没有更新完成, 强制更新");
	// 		needUpdate = true;
	// 	} else if (isH5NeedUpdate === h5UpdateMod.UPDATE_FLAG_FORCE) {
	// 		// alert("大版本变动, 强制更新");
	// 		needUpdate = true;
	// 	} else if (isH5NeedUpdate === h5UpdateMod.UPDATE_FLAG_OPTIONAL) {
	// 		// needUpdate = confirm("小版本变动，需要更新吗？");
	// 		needUpdate = true;
	// 	} else if (isH5NeedUpdate === h5UpdateMod.UPDATE_FLAG_LAST_ERROR) {
	// 		// alert("服务器连不上，同时上次更新到一半，错误");
	// 		updateError();
	// 		return;
	// 	} else if (isH5NeedUpdate === h5UpdateMod.UPDATE_FLAG_APP_ERROR) {
	// 		// alert("服务器连不上，同时app版本太低，错误");
	// 		updateError();
	// 		pi_update.modifyContent(option);
	// 		return;
	// 	} else {
	// 		// alert("H5 更新，其他未处理错误");
	// 		updateError();
	// 		pi_update.modifyContent(option);
	// 		throw new Error("H5 update error!");
	// 	}

	// 	if (needUpdate) { 
	// 		var updateContent = pi_update.updateJson.h5UpdateContent || [];
	// 		var updateVersion =  pi_update.updateJson.version || "";
	// 		var option = {
	// 			updated:updateContent,
	// 			version:updateVersion
	// 		};
	// 		pi_update.modifyContent(option);
			
	// 		h5UpdateMod.update(function (e) {
	// 			//{type: "saveFile", total: 4, count: 1}
	// 			console.log("update progress: ", e);
	// 			pi_update.updateProgress(e);
	// 		}, function () {
	// 			setTimeout(()=>{
	// 				pi_update.closePop();
	// 				// 重启
	// 				h5UpdateMod.reload();
	// 			},200);
	// 		});
	// 	} else {
	// 		// 这里是项目加载的开始
	// 		console.timeEnd("update check");
	// 		appLoadEntrance();
	// 	}
	// }

// ====================================更新结束=============================================================
	console.time("loadResource complete");
	var appLoadEntrance = function(){
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
					"chat/client/app/net/login.js",	
					"chat/client/app/view/index.js",
					"chat/client/app/view/chat/chat.tpl",
					"chat/client/app/view/chat/chat.js",
					"chat/client/app/view/chat/chat.wcss",
					"chat/client/app/group/latestAnnItem.tpl",
					"chat/client/app/group/latestAnnItem.js",
					"chat/client/app/group/latestAnnItem.wcss",
					"chat/client/app/res/css/",
					"chat/client/app/widget/",

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
					// document.body.removeChild(div);
					loadPiSdk();
					loadEmoji();
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
	}

	appLoadEntrance();
};

// 初始化开始
(winit.init = function () {
	if (!winit) return;
	winit.deps && self.pi_modules && self.pi_modules.butil && self._babelPolyfill && winit.initNext();
	(!self._babelPolyfill) && setTimeout(winit.init, 100);
})();
