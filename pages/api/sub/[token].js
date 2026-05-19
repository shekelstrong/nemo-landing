// Subscription config API endpoint
// Generates sing-box JSON config dynamically based on 3x-ui data

const XUI_URL = "http://127.0.0.1:2053";
const XUI_USER = "nedopekin";
const XUI_PASS = "NemoVPN2026!";
const SERVER_IP = "81.26.180.40";
const SERVER_DOMAIN = "vpn.nemovpn.online";

// Inbound configs (from 3x-ui)
const INBOUNDS = {
  1: {
    id: 1,
    remark: "VLESS-Reality-Standard",
    port: 8443,
    sni: "www.microsoft.com",
    shortId: "6c6992c8",
    publicKey: "O1iyQMVfn3K6Yp1Ctoo5vuvkt4H0qaSxHAVglCXud2M",
    flow: "xtls-rprx-vision",
  },
  2: {
    id: 2,
    remark: "VLESS-Reality-Whitelist-RU",
    port: 2083,
    sni: "www.yandex.ru",
    shortId: "5a3b7f1d",
    publicKey: "O1iyQMVfn3K6Yp1Ctoo5vuvkt4H0qaSxHAVglCXud2M",
    flow: "",
  },
};

let xuiSession = null;
let sessionExpiry = 0;

async function loginXUI() {
  try {
    const res = await fetch(`${XUI_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `username=${encodeURIComponent(XUI_USER)}&password=${encodeURIComponent(XUI_PASS)}`,
    });
    const setCookie = res.headers.get("set-cookie") || "";
    const match = setCookie.match(/3x-ui=([^;]+)/);
    if (match) {
      xuiSession = match[1];
      sessionExpiry = Date.now() + 5 * 60 * 1000; // 5 min cache
      return true;
    }
    const data = await res.json();
    return data.success === true;
  } catch (e) {
    console.error("XUI login error:", e.message);
    return false;
  }
}

async function ensureSession() {
  if (!xuiSession || Date.now() > sessionExpiry) {
    await loginXUI();
  }
}

async function findUserByUUID(uuid) {
  await ensureSession();

  for (const [inboundId, inbound] of Object.entries(INBOUNDS)) {
    try {
      const res = await fetch(`${XUI_URL}/panel/api/inbounds/get/${inboundId}`, {
        headers: { Cookie: `3x-ui=${xuiSession}` },
      });
      if (res.status === 401 || res.status === 403) {
        await loginXUI();
        const retryRes = await fetch(`${XUI_URL}/panel/api/inbounds/get/${inboundId}`, {
          headers: { Cookie: `3x-ui=${xuiSession}` },
        });
        const retryData = await retryRes.json();
        if (!retryData.success || !retryData.obj) continue;
        const settings = JSON.parse(retryData.obj.settings || "{}");
        const clients = settings.clients || [];
        const client = clients.find((c) => c.id === uuid);
        if (client) {
          return {
            found: true,
            inboundId: parseInt(inboundId),
            inbound: inbound,
            client: client,
            email: client.email || "",
            enable: client.enable !== false,
            expiryTime: client.expiryTime || 0,
            totalGB: client.totalGB || 0,
            flow: client.flow || inbound.flow,
          };
        }
        continue;
      }
      const data = await res.json();
      if (!data.success || !data.obj) continue;

      const settings = JSON.parse(data.obj.settings || "{}");
      const clients = settings.clients || [];
      const client = clients.find((c) => c.id === uuid);

      if (client) {
        return {
          found: true,
          inboundId: parseInt(inboundId),
          inbound: inbound,
          client: client,
          email: client.email || "",
          enable: client.enable !== false,
          expiryTime: client.expiryTime || 0,
          totalGB: client.totalGB || 0,
          flow: client.flow || inbound.flow,
        };
      }
    } catch (e) {
      console.error(`Error checking inbound ${inboundId}:`, e.message);
    }
  }

  return { found: false };
}

function generateVLESSUri(uuid, inbound, serverAddr) {
  const params = [];
  params.push("type=tcp");
  params.push("security=reality");
  params.push(`sni=${inbound.sni}`);
  params.push("fp=chrome");
  params.push(`pbk=${inbound.publicKey}`);
  params.push(`sid=${inbound.shortId}`);
  if (inbound.flow) {
    params.push(`flow=${inbound.flow}`);
  }

  return `vless://${uuid}@${serverAddr}:${inbound.port}?${params.join("&")}#NEMO-${inbound.remark}`;
}

function generateSingBoxConfig(uuid, serverAddr) {
  return {
    log: {
      level: "info",
      timestamp: true,
    },
    dns: {
      servers: [
        {
          tag: "cloudflare",
          address: "https://1.1.1.1/dns-query",
          detour: "proxy",
        },
        {
          tag: "local",
          address: "223.5.5.5",
          detour: "direct",
        },
        {
          tag: "block",
          address: "rcode://success",
        },
      ],
      rules: [
        {
          outbound: "any",
          server: "local",
        },
        {
          rule_set: "geosite-category-ads-all",
          server: "block",
        },
        {
          rule_set: "geosite-ru",
          server: "local",
        },
      ],
      final: "cloudflare",
      strategy: "prefer_ipv4",
    },
    inbounds: [
      {
        type: "tun",
        tag: "tun-in",
        inet4_address: "172.19.0.1/30",
        auto_route: true,
        strict_route: true,
        stack: "mixed",
        sniff: true,
        sniff_override_destination: true,
      },
    ],
    outbounds: [
      {
        type: "vless",
        tag: "proxy",
        server: serverAddr,
        server_port: 8443,
        uuid: uuid,
        flow: "xtls-rprx-vision",
        tls: {
          enabled: true,
          server_name: "www.microsoft.com",
          reality: {
            enabled: true,
            fingerprint: "chrome",
            public_key: "O1iyQMVfn3K6Yp1Ctoo5vuvkt4H0qaSxHAVglCXud2M",
            short_id: "6c6992c8",
          },
        },
      },
      {
        type: "vless",
        tag: "proxy-wl",
        server: serverAddr,
        server_port: 2083,
        uuid: uuid,
        flow: "",
        tls: {
          enabled: true,
          server_name: "www.yandex.ru",
          reality: {
            enabled: true,
            fingerprint: "chrome",
            public_key: "O1iyQMVfn3K6Yp1Ctoo5vuvkt4H0qaSxHAVglCXud2M",
            short_id: "5a3b7f1d",
          },
        },
      },
      {
        type: "direct",
        tag: "direct",
      },
      {
        type: "block",
        tag: "block",
      },
      {
        type: "dns",
        tag: "dns-out",
      },
    ],
    route: {
      rules: [
        {
          protocol: "dns",
          outbound: "dns-out",
        },
        {
          ip_is_private: true,
          outbound: "direct",
        },
        {
          rule_set: "geosite-ru",
          outbound: "direct",
        },
        {
          rule_set: "geoip-ru",
          outbound: "direct",
        },
        {
          rule_set: "geosite-vk",
          outbound: "proxy-wl",
        },
        {
          rule_set: "geosite-mail-ru",
          outbound: "proxy-wl",
        },
      ],
      rule_set: [
        {
          tag: "geosite-ru",
          type: "remote",
          format: "binary",
          url: "https://raw.githubusercontent.com/SagerNet/sing-geosite/rule-set/geosite-ru.srs",
          download_detour: "direct",
        },
        {
          tag: "geoip-ru",
          type: "remote",
          format: "binary",
          url: "https://raw.githubusercontent.com/SagerNet/sing-geoip/rule-set/geoip-ru.srs",
          download_detour: "direct",
        },
        {
          tag: "geosite-category-ads-all",
          type: "remote",
          format: "binary",
          url: "https://raw.githubusercontent.com/SagerNet/sing-geosite/rule-set/geosite-category-ads-all.srs",
          download_detour: "direct",
        },
        {
          tag: "geosite-vk",
          type: "remote",
          format: "binary",
          url: "https://raw.githubusercontent.com/SagerNet/sing-geosite/rule-set/geosite-vk.srs",
          download_detour: "direct",
        },
        {
          tag: "geosite-mail-ru",
          type: "remote",
          format: "binary",
          url: "https://raw.githubusercontent.com/SagerNet/sing-geosite/rule-set/geosite-mail-ru.srs",
          download_detour: "direct",
        },
      ],
      final: "proxy",
      auto_detect_interface: true,
    },
  };
}

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { token, format } = req.query;
  if (!token) {
    return res.status(400).json({ error: "Token required" });
  }

  // Validate UUID format
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(token)) {
    return res.status(400).json({ error: "Invalid token format" });
  }

  const user = await findUserByUUID(token);

  if (!user.found) {
    return res.status(404).json({ error: "Пользователь не найден. Проверьте ваш UUID." });
  }

  if (!user.enable) {
    return res.status(403).json({ error: "Подписка отключена. Обратитесь в поддержку." });
  }

  const serverAddr = SERVER_DOMAIN;
  const requestFormat = format || "singbox";

  // Info format: return user metadata for the subscription page
  if (requestFormat === "info") {
    return res.status(200).json({
      found: true,
      inboundId: user.inboundId,
      email: user.email,
      enable: user.enable,
      expiryTime: user.expiryTime,
      totalGB: user.totalGB,
      // Add expiry date as human-readable
      expiryDate: user.expiryTime > 0 ? new Date(user.expiryTime).toISOString() : null,
      // Traffic info
      totalGBHuman: user.totalGB > 0 ? `${user.totalGB / 1024} TB` : "Безлимит",
    });
  }

  if (requestFormat === "vless") {
    const primaryInbound = user.inboundId === 2 ? INBOUNDS[2] : INBOUNDS[1];
    const uri = generateVLESSUri(token, primaryInbound, serverAddr);
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("Content-Disposition", 'attachment; filename="nemo-vless.txt"');
    return res.status(200).send(uri);
  }

  // Default: sing-box config
  const config = generateSingBoxConfig(token, serverAddr);
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Content-Disposition", 'attachment; filename="nemo-singbox-config.json"');
  return res.status(200).json(config);
}

export const config = {
  api: {
    externalResolver: true,
  },
};
