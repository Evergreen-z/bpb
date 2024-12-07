import { initializeParams } from './helpers/init';
import { vlessOverWSHandler } from './protocols/vless';
import { trojanOverWSHandler } from './protocols/trojan';
import { updateWarpConfigs } from './kv/handlers';
import { logout, resetPassword, login } from './authentication/auth';
import { renderErrorPage } from './pages/error';
import { getXrayCustomConfigs, getXrayWarpConfigs } from './cores-configs/xray';
import { getSingBoxCustomConfig, getSingBoxWarpConfig } from './cores-configs/sing-box';
import { getClashNormalConfig, getClashWarpConfig } from './cores-configs/clash';
import { getNormalConfigs } from './cores-configs/normalConfigs';
import { fallback, getMyIP, handlePanel } from './helpers/helpers';
import { renderSecretsPage } from './pages/secrets';
 
export default {
  async fetch(request) {
    // 从请求中获取 btoa() 编码的字符串
    const { searchParams } = new URL(request.url);
    const encodedInput = searchParams.get("text");

    if (!encodedInput) {
      return new Response("Missing 'text' query parameter", { status: 400 });
    }

    try {
      // 解码 btoa() 编码的字符串
      const decodedInput = atob(encodedInput);

      // 计算 SHA-224 哈希
      const hash = import_js_sha256.default.sha224(decodedInput);

      // 使用 btoa() 对哈希结果进行编码
      const encodedHash = btoa(hash);

      // 返回结果
      return new Response(JSON.stringify({ input: decodedInput, hash: encodedHash }), {
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      return new Response("Error processing input: " + error.message, { status: 400 });
    }
  },
};
