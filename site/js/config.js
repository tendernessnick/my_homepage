// ============================================================
// 站点配置 —— 部署前只需要改这里
// ============================================================

// dehaze-api（毕业设计）的公网访问地址，即腾讯云 CloudBase 云托管
// 给你分配的服务域名，例如：
//   'https://dehaze-xxxxx.ap-guangzhou.run.tcloudbase.com'
// 留空时，页面上的去雾 Demo 会提示"尚未配置服务地址"，其余功能不受影响。
// 开发联调地址；CloudBase 部署后替换为正式域名
export const DEHAZE_API_BASE = 'http://localhost:8000';

// 去雾示例图（O-HAZE 真实雾图），也可换成你自己的
export const SAMPLE_IMAGE = 'assets/sample_hazy.jpg';
