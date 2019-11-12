'use strict';
// 依赖表加载成功后的回调函数
winit.initNext = function () {
	updateUiInit();
	getUpdateContent();
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
	function updateFunc(){
		/**
		 * 更新App和H5,策略如下:
		 *     1. 同时检查是否需要更新，超时1秒钟即可
		 *     2. 如果App需要更新，更新App，并重启（Android/iOS底层自动）
		 *     3. 否则，如果H5需要更新，更新H5并重新reload
		 *     4. 否则调用加载函数load加载项目资源；
		 */
		var isAppNeedUpdate = undefined;
		var isH5NeedUpdate = undefined;
		console.time("update check");
		var h5UpdateMod = pi_modules.update.exports;
		var appUpdateMod = pi_modules.appUpdate.exports;
		var start = new Date().getTime();

		pi_update.severIp = winit.severIp;
		pi_update.severPort = winit.severPort;
		pi_update.inAndroidApp = winit.inAndroidApp;
		pi_update.inIOSApp = winit.inIOSApp;
		pi_update.inApp = winit.inApp;
		pi_update.bootPath = winit.bootPath;

		appUpdateMod.init(function () {
			appUpdateMod.needUpdate(function (isNeedUpdate) {
				self.checkUpdateTime = new Date().getTime() - start;
				if (isNeedUpdate > 0) {
					var updateContent = [];
					if (navigator.userAgent.indexOf('YINENG_ANDROID') >= 0) { // android
						updateContent = pi_update.updateJson.androidUpdateContent || [];
					}else if(navigator.userAgent.indexOf('YINENG_IOS') >= 0) { // ios
						updateContent = pi_update.updateJson.iosUpdateContent || [];
					}else{  // 浏览器
						updateContent = pi_update.updateJson.androidUpdateContent || [];
					}
					var option = {
						updated:updateContent,
						version:"",//appUpdateMod.getAppRemoteVersion() app更新不显示版本号
						alertBtnText:"App 需要更新"
					};
					pi_update.modifyContent(option);
					appUpdateMod.update(function (isSuccess) {
						pi_update.closePop();
						// alert("更新失败");
						console.log("appUpdate " + isSuccess);
					},function(total,process){
						console.log("total = " + total + " process = " + process);
						var e = { type: "saveFile", total: total, count: process};
						pi_update.updateProgress(e);
					});
				} else {
					// 只有在这种情况下才有可能更新H5
					isAppNeedUpdate = isNeedUpdate;
					if (isH5NeedUpdate !== undefined) {
						updateH5();
					}
				}
			});

			h5UpdateMod.setServerInfo(pi_update.bootPath);
			h5UpdateMod.checkUpdate(function (updateFlag) {

				isH5NeedUpdate = updateFlag;
				if (isAppNeedUpdate !== undefined) {
					updateH5();
				}
			});
		});

		function updateH5() {
			var needUpdate = false;
			function updateError(){  // 更新出错界面
				var updateContent = pi_update.updateJson.h5UpdateContent || [];
				var updateVersion =  pi_update.updateJson.version || "";
				var option = {
					updated:updateContent,
					version:updateVersion,
					updateError:true
				};
				pi_update.modifyContent(option);
			}
			if (isH5NeedUpdate === h5UpdateMod.UPDATE_FLAG_NO_UPDATE) {
				// 不需要更新
				needUpdate = false;
			} else if (isH5NeedUpdate === h5UpdateMod.UPDATE_FLAG_LAST) {
				// alert("上次没有更新完成, 强制更新");
				needUpdate = true;
			} else if (isH5NeedUpdate === h5UpdateMod.UPDATE_FLAG_FORCE) {
				// alert("大版本变动, 强制更新");
				needUpdate = true;
			} else if (isH5NeedUpdate === h5UpdateMod.UPDATE_FLAG_OPTIONAL) {
				// needUpdate = confirm("小版本变动，需要更新吗？");
				needUpdate = true;
			} else if (isH5NeedUpdate === h5UpdateMod.UPDATE_FLAG_LAST_ERROR) {
				// alert("服务器连不上，同时上次更新到一半，错误");
				updateError();
				return;
			} else if (isH5NeedUpdate === h5UpdateMod.UPDATE_FLAG_APP_ERROR) {
				// alert("服务器连不上，同时app版本太低，错误");
				updateError();
				pi_update.modifyContent(option);
				return;
			} else {
				// alert("H5 更新，其他未处理错误");
				updateError();
				pi_update.modifyContent(option);
				throw new Error("H5 update error!");
			}

			if (needUpdate) { 
				var updateContent = pi_update.updateJson.h5UpdateContent || [];
				var updateVersion =  pi_update.updateJson.version || "";
				var option = {
					updated:updateContent,
					version:updateVersion
				};
				pi_update.modifyContent(option);
				
				h5UpdateMod.update(function (e) {
					//{type: "saveFile", total: 4, count: 1}
					console.log("update progress: ", e);
					pi_update.updateProgress(e);
				}, function () {
					setTimeout(()=>{
						pi_update.closePop();
						console.log(`更新重启location.pathname is ${location.pathname}`);
						// 重启
						h5UpdateMod.reload('/wallet/chat/client/boot/index.html');
					},200);
				});
			} else {
				// 这里是项目加载的开始
				console.timeEnd("update check");
				appLoadEntrance();
			}
		}
	}


// ====================================更新结束=============================================================
	
	var flags = winit.flags;
	var html,util;
	var fm;  // fileMap
	var suffixCfg = {
		png: 'down', jpg: 'down', jpeg: 'down', webp: 'down', gif: 'down', xlsx:'none',rs:'none'
	};
	/**
	 * APP入口函数
	 */
	var appLoadEntrance = function(){
		console.time("loadResource complete");
		pi_modules.commonjs.exports.require(["pi/util/html", "pi/widget/util","pi/util/lang","pi/browser/webview"], {}, function (mods, fileMap) {
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
				loadPiSdk();
				loadChatApp();
			});

		}, function (result) {
			alert("加载基础模块失败, " + result.error + ":" + result.reason);
		}, modProcess.handler);
	}


	//加载APP部分代码，实际项目中会分的更细致
	var loadChatApp = function () {
		var sourceList  = [
			"chat/client/app/net/init.js",
			"chat/client/app/view/index.js",
			"chat/client/app/view/chat/chat.tpl",
			"chat/client/app/view/chat/chat.js",
			"chat/client/app/view/chat/chat.wcss",
			"chat/client/app/group/latestAnnItem.tpl",
			"chat/client/app/group/latestAnnItem.js",
			"chat/client/app/group/latestAnnItem.wcss",
			"chat/client/app/res/css/",
			"chat/client/app/widget1/",

			"app/publicComponents/",
			"app/api/thirdApi.js",
			"app/postMessage/postMessage.js",
			
			"pi/ui/root.js",
			"pi/ui/root.tpl",
			"pi/ui/html.js",
			"pi/ui/html.tpl",
		]
		util.loadDir(sourceList, flags, fm, undefined, function (fileMap) {
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
			enterChat();

		}, function (r) {
			alert("加载目录失败, " + r.error + ":" + r.reason);
		}, dirProcess.handler);
	}


	// 进入聊天界面
	var enterChat = function(){
		// 加载根组件
		var index = pi_modules.commonjs.exports.relativeGet("chat/client/app/view/index").exports;
		index.run(function(){
			// 关闭读取界面
			document.body.removeChild(document.getElementById('rcmj_loading_log'));
		});
		const init = pi_modules.commonjs.exports.relativeGet("chat/client/app/net/init").exports;
		init.registerRpcStruct(fm);
		init.initClient();
		
		loadEmoji();
		firstStageLoaded();
	}

	// 加载pisdk初始化及登录
	var loadPiSdk = function(){
		util.loadDir(["pi_sdk/","chat/client/app/net/login.js"], flags, fm, undefined, function (fileMap) {
			console.time('pisdk init complete');
			pi_sdk.setWebviewManager("pi/browser/webview");
			pi_sdk.piSdkInit({
				appid: '101',            // 应用ID 由好嗨唯一分配
				webviewName: 'wallet',   // 应用名字 由好嗨唯一分配
				isHorizontal: false,      // 是否横屏 由游戏决定
			},(res)=>{
				console.timeEnd('pisdk init complete');
				console.log('bind vm success', res);
				
				// 聊天授权
				pi_modules.commonjs.exports.relativeGet("chat/client/app/net/login").exports.checkAccount();	
			});
		}, function (r) {
			alert("加载目录失败, " + r.error + ":" + r.reason);
		}, dirProcess.handler);
	}

	// 加载表情包图库
	var loadEmoji = function() {
		util.loadDir(["chat/client/app/res/emoji/"],flags,fm,undefined,function(fileMap,mods){
			//TODO: 可以长期放在缓存中达到更快的显示效果
		},function (r) {
			alert("加载目录失败, " + (r.error ? (r.error + ":" + r.reason) : r));
		}, dirProcess.handler)
	}

	updateFunc();  // 执行更新代码
	// appLoadEntrance();  // 不执行更新代码，直接执行项目入口代码
	winit = undefined;//一定要立即释放，保证不会重复执行
	

	// ===============================加载钱包流程===================================


	// 进入钱包首页所需资源
	var firstStageLoaded = function(){
		console.time("firstStageLoaded success");
		var sourceList = [
			"pi/ui/lang.js",
			"pi/ui/lang.tpl",

			"app/store/memstore.js",
			"app/view/base/sourceLoaded.js",
			"app/net/login.js",
			"app/view/base/",
			"app/view/play/home/",
			"app/components1/btn/",
			"app/components1/img/",
			"app/components1/topBar/",
			"app/postMessage/",
			"app/api/",
			"app/res/css/",

			"earn/client/app/net/init.js",
			"earn/xlsx/item.c.js",
			"earn/xlsx/item.s.js",
			"earn/xlsx/awardCfg.c.js",
			"earn/xlsx/awardCfg.s.js",
			"earn/client/app/components/noviceTaskAward/",
			"earn/client/app/res/css/",
			"earn/client/app/view/home/"
		];
		util.loadDir(sourceList, flags, fm, suffixCfg, function (fileMap) {
			console.timeEnd("firstStageLoaded success");
			pi_modules.commonjs.exports.relativeGet("chat/client/app/data/store").exports.setStore('flags/firstStageLoaded',true);
			pi_modules.commonjs.exports.relativeGet("app/view/base/sourceLoaded").exports.init(flags,fm,suffixCfg);
			// 钱包登录
			pi_modules.commonjs.exports.relativeGet("app/net/login").exports.walletLogin();	
			// 活动注册
			pi_modules.commonjs.exports.relativeGet("earn/client/app/net/init").exports.registerRpcStruct(fm);
			// 活动登录
			pi_modules.commonjs.exports.relativeGet("earn/client/app/net/login").exports.earnLogin();

			var tab = util.loadCssRes(fileMap);
			tab.timeout = 90000;
			tab.release();
			loadLeftWalletSource();
			
		}, function (r) {
			alert("加载目录失败, " + r.error + ":" + r.reason);
		}, dirProcess.handler);
	}
	

	// 加载剩余所有资源
	var loadLeftWalletSource = function(){
		util.loadDir([ 
			"app/components/",
			"app/view/",
			
			"chat/client/app/view/",
			"chat/client/app/widget/"
		], flags, fm, undefined, function (fileMap) {
			pi_modules.commonjs.exports.relativeGet("app/store/memstore").exports.setStore('flags/level_3_page_loaded',true);
			
		}, function (r) {
			console.log("加载目录失败, " + r.url + ", " + r.error + ":" + r.reason);
		}, function(){});
	}
};

/**
 * 更新UI界面初始化
 */
function updateUiInit(){
	window.pi_update = window.pi_update || {};

	pi_update.rootCssText =  browserAdaptive();

	pi_update.modifyContent = function(option){
		var modified = pi_update.contentModified;
		if(modified) return;
		option.confirmOk = option.confirmOk || "确定";
		option.confirmCancel = option.confirmCancel || "取消";
		var $root = document.createElement("div");
		$root.setAttribute("id","update-root");
		$root.setAttribute("style",pi_update.rootCssText);
		var $updateItemInnerHtml = "";
		for(var i = 0;i < option.updated.length;i++){
			var $item = "<div class='pi-update-item'>" + (i + 1) + "、" + option.updated[i] + "</div>";
			$updateItemInnerHtml += $item;
		}

		var newVersion = option.version ? `：V${option.version}` : "";
		var errorTips = "正在连接服务器";
		if(option.updateError){
			$root.innerHTML = `
			<div class="pi-mask">
				<div class="pi-update-box animated bounceInUp">
					<img src="../res/image/rocket.png" class="pi-update-rocket" />
					<div class="pi-update-content">
					<div class="pi-update-title">发现新版本<span id="pi-version">${newVersion}</span></div>
					<div class="pi-update-items">
						${$updateItemInnerHtml}
					</div>
					</div>
					<div class="pi-update-bottom">
						<div class="pi-update-btns">
							<div class="pi-update-cancel-btn">${option.confirmCancel}</div>
							<div class="pi-update-ok-btn">${option.confirmOk}</div>
						</div>
						<div class="pi-update-progress-container">
							${errorTips}
						</div>
						<div class="pi-update-complete-btn"></div>
					</div>
				</div>
			</div>`;
		}else{
			$root.innerHTML = `
			<div class="pi-mask">
				<div class="pi-update-box animated bounceInUp">
					<img src="../res/image/rocket.png" class="pi-update-rocket" />
					<div class="pi-update-content">
					<div class="pi-update-title">发现新版本<span id="pi-version">${newVersion}</span></div>
					<div class="pi-update-items">
						${$updateItemInnerHtml}
					</div>
					</div>
					<div class="pi-update-bottom">
						<div class="pi-update-btns">
							<div class="pi-update-cancel-btn">${option.confirmCancel}</div>
							<div class="pi-update-ok-btn">${option.confirmOk}</div>
						</div>
						<div class="pi-update-progress-container">
							<div class="pi-update-progress-bg">
								<div class="pi-update-progress"></div>
							</div>
							<div class="pi-update-progress-text">0%</div>
						</div>
						<div class="pi-update-complete-btn"></div>
					</div>
				</div>
			</div>
			`;
		}
		
		var $body = document.querySelector("body");
		$body.appendChild($root);
		pi_update.contentModified = true;

		if(option.updateError){
			var container = document.querySelector(".pi-update-progress-container");
			var dots = ["."];
			setInterval(()=>{
				if(dots.length >= 3) dots = [];
				dots.push(".");
				container.innerHTML = errorTips + dots.join("");
			},1000);
		}
	}


	// 确定弹框
	pi_update.confirm = function(option,callback){
		pi_update.modifyContent(option);
		var $btns = document.querySelector(".pi-update-btns");
		var $cancel = document.querySelector(".pi-update-cancel-btn");
		var $ok = document.querySelector(".pi-update-ok-btn");

		$cancel.onclick = function(){
			var $updateRoot = document.querySelector('#update-root');
			$updateRoot.style.display = "none";
			callback(false);
		};

		$ok.onclick = function(){
			callback(true);
		};

		$btns.style.display = "display";
		// 显示弹框
		var $updateRoot = document.querySelector('#update-root');
		$updateRoot.style.display = "block";
	}

	//e的数据结构{type: "saveFile", total: 4, count: 1}
	// 进度条更新
	pi_update.updateProgress = function(e){
		var updating  = pi_update.updating;
		if(!updating){
			pi_update.updating = true;
		}
		var $progress = document.querySelector(".pi-update-progress");
		var $progressText = document.querySelector(".pi-update-progress-text");
		var percent = e.count / e.total;
		var percentText = parseInt(percent * 100) + "%";
		console.log("percentText = ",percentText);
		$progress.style.width = percentText;
		$progressText.innerHTML = percentText;
	}


	// alert弹框
	pi_update.alert = function(option,completeCB){
		pi_update.modifyContent(option);
		var $updateRoot = document.querySelector('#update-root');
		var $btns = document.querySelector(".pi-update-btns");
		var $progressContainer = document.querySelector(".pi-update-progress-container");
		var $completeBtn = document.querySelector(".pi-update-complete-btn");
		
		$completeBtn.onclick = completeCB;
		// $completeBtn.addEventListener("click",function(){
		// 	completeCB();
		// });

		$updateRoot.style.display = "block";
		$btns.style.display = "none";
		$progressContainer.style.display = "none";
		$completeBtn.innerHTML = option.alertBtnText;
		$completeBtn.style.display = "flex";
	}

	// 关闭弹框
	pi_update.closePop = function(){
		var $updateRoot = document.querySelector('#update-root');
		var $body = document.querySelector("body");
		$updateRoot && $body.removeChild($updateRoot);
	}

}

/**
 * 获取更新内容 版本号  修复的BUG等
 */
function getUpdateContent(){
	var defaultUpdateJson = {
		"version":"0.0.1",
		"h5UpdateContent":["接入了新的支付","支持游戏悬浮窗","支持手机号注册","修复了部分bug"],
		"androidUpdateContent":["接入了新的支付","支持游戏悬浮窗","支持手机号注册","修复了部分bug"],
		"iosUpdateContent":["ios底层修复1","ios底层修复2","ios底层修复3","ios底层修复4"],
	};
	const updateJsonStr = localStorage.getItem("updateJson");
	pi_update.updateJson = updateJsonStr ? JSON.parse(updateJsonStr) : defaultUpdateJson;
	var ajax = pi_modules.ajax.exports;
	const url = winit.appURL + "/update.json";
	const timeout = 1000;
	ajax.get(url + "?" + Math.random(), {}, undefined, undefined, timeout, function (updateJson) {
		localStorage.setItem("updateJson",updateJson);
		pi_update.updateJson = JSON.parse(updateJson);
	}, function () {
		// 取不到服务器的update.json,使用本地json
	});
}

// 初始化开始
(winit.init = function () {
	if (!winit) return;
	winit.deps && self.pi_modules && self.pi_modules.butil && self._babelPolyfill && winit.initNext();
	(!self._babelPolyfill) && setTimeout(winit.init, 100);
})();
