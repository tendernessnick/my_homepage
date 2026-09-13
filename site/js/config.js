// ============================================================
// 站点配置 —— 部署前只需要改这里
// ============================================================

// 去雾在线演示页（毕业设计）的公网地址 = 腾讯云 CloudBase 云托管给
// dehaze-api 分配的服务域名，部署后填这里，例如：
//   'https://dehaze-xxxxx.ap-guangzhou.run.tcloudbase.com'
// 填好后，全站所有「在线体验」入口会自动改为新标签打开该演示页；
// 留空时入口指向站内介绍页 dehaze.html，演示卡显示「部署后开放」。
export const DEHAZE_DEMO_URL = 'https://dehaze-demo2-312215-10-1477032709.sh.run.tcloudbase.com';

// 网球天气助手（Railway 部署）的线上地址，部署后填这里，例如：
//   'https://weather-helper-production.up.railway.app'
// 填好后作品页「打开在线应用」自动直跳；留空时按钮呈「待填入」待开放态。
export const WEATHER_APP_URL = '';

// 数据分析小助手（CloudBase 云托管，data_helper 仓库 webview 分支）的线上地址，
// 部署后填这里；可带 ?home=<主页地址> 让应用顶栏出现「🏠 主页」回跳按钮：
//   'https://<服务名>-<环境ID>.tcloudbase.com/?home=https://<主页地址>'
// 填好后作品页「进入在线体验」自动直跳；留空时按钮呈「部署中」待开放态。
export const DATAHELPER_DEMO_URL = '';

// 推理 API 直连地址（仅本地联调 js/dehaze.js 时使用；
// 线上演示走后端服务自带的同源页面，不再依赖此配置）。
export const DEHAZE_API_BASE = 'http://localhost:8000';

// 去雾示例图（O-HAZE 真实雾图），也可换成你自己的
export const SAMPLE_IMAGE = 'assets/sample_hazy.jpg';
