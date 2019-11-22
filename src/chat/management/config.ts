import { chatLogicIp, sourceIp } from '../../app/public/config';

/**
 * 配置文件
 */

export const managementSourceIp = sourceIp;

// 资源服务器port 有些手机浏览器显示端口号无法识别  全部使用默认端口
export const sourcePort = window.location.port || 80;

// erlang逻辑服务器ip
// app.herominer.net
// export const erlangLogicIp = '39.98.200.23'; 
export const erlangLogicIp = sourceIp; 

// HTTP请求端口号
export const httpPort = 8092;

// 聊天逻辑服务器ip
export const serverIp = chatLogicIp;

// 聊天逻辑服务器port
export const serverPort = 9080;

// websock连接url
export const wsUrl = `ws://${serverIp}:${serverPort}`;

// 获取图片路径
export const serverFilePath = `http://${sourceIp}:${sourcePort}/service/get_file?sid=`;

/**
 * maxSize图片最大 2M
 */
export const maxSize = 2097152;