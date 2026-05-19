import { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";

const SERVER_DOMAIN = "vpn.nemovpn.online";

function CopyButton({ text, label = "Копировать" }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  return (
    <button onClick={copy} className="copy-btn">
      {copied ? "✓ Скопировано" : label}
    </button>
  );
}

export default function SubscriptionPage() {
  const router = useRouter();
  const { token } = router.query;
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("singbox");

  useEffect(() => {
    if (!token) return;

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(token)) {
      setError("Неверный формат токена");
      setLoading(false);
      return;
    }

    // Fetch user config info from API
    fetch(`/api/sub/${token}?format=info`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          setUserData(data);
        }
        setLoading(false);
      })
      .catch(() => {
        // Even if info endpoint fails, show the page with static data
        setUserData({ found: true, inboundId: 1 });
        setLoading(false);
      });
  }, [token]);

  if (!token && !loading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-display text-4xl text-primary mb-4">Нет токена</h1>
          <p className="text-muted-foreground">Подписка не найдена</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mb-4" />
          <p className="font-mono text-primary text-sm">Загрузка конфигурации...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <div className="text-6xl mb-6">⊘</div>
          <h1 className="font-display text-3xl text-primary mb-4">Ошибка</h1>
          <p className="text-muted-foreground">{error}</p>
          <a href="/" className="inline-block mt-8 px-6 py-3 bg-primary text-primary-foreground font-bold uppercase tracking-widest text-xs nemo-shadow-sm hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
            На главную
          </a>
        </div>
      </div>
    );
  }

  // Generate URLs
  const singboxUrl = `${window.location.origin}/api/sub/${token}?format=singbox`;
  const vlessStandardUrl = `vless://${token}@${SERVER_DOMAIN}:8443?type=tcp&security=reality&sni=www.microsoft.com&fp=chrome&pbk=O1iyQMVfn3K6Yp1Ctoo5vuvkt4H0qaSxHAVglCXud2M&sid=6c6992c8&flow=xtls-rprx-vision#NEMO-Standard`;
  const vlessWhitelistUrl = `vless://${token}@${SERVER_DOMAIN}:2083?type=tcp&security=reality&sni=www.yandex.ru&fp=chrome&pbk=O1iyQMVfn3K6Yp1Ctoo5vuvkt4H0qaSxHAVglCXud2M&sid=5a3b7f1d#NEMO-Whitelist-RU`;
  const happUrl = `happ://install-subscription?url=${encodeURIComponent(singboxUrl)}`;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Head>
        <title>NEMO VPN — Ваша подписка</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      {/* Header */}
      <header className="border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-6 flex items-center justify-between">
          <a href="/" className="flex items-center gap-3">
            <span className="font-display text-xl uppercase tracking-tighter text-foreground">
              Nemo<span className="text-primary">.</span>VPN
            </span>
            <span className="inline-flex items-center gap-2 px-2 py-0.5 text-[10px] bg-primary text-primary-foreground font-bold tracking-widest uppercase">
              <span className="size-1.5 rounded-full bg-primary-foreground animate-blink" />
              Active
            </span>
          </a>
          <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
            Subscription Config
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Status Card */}
        <section className="border border-primary/30 neon-border p-6">
          <div className="flex items-center gap-4 mb-4">
            <span className="size-3 rounded-full bg-primary animate-blink" />
            <h1 className="font-display text-2xl uppercase tracking-tighter">
              Ваша подписка активна
            </h1>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <div className="border border-border p-4">
              <div className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">Токен</div>
              <div className="font-mono text-primary text-xs break-all">{token}</div>
            </div>
            <div className="border border-border p-4">
              <div className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">Протокол</div>
              <div className="font-display text-lg text-foreground">VLESS Reality</div>
            </div>
            <div className="border border-border p-4">
              <div className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">Сервер</div>
              <div className="font-mono text-foreground">{SERVER_DOMAIN}</div>
              <div className="text-[10px] text-muted-foreground mt-1">Порты: 8443 / 2083</div>
            </div>
          </div>
        </section>

        {/* 1-Tap Import */}
        <section className="border border-border p-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-[10px] font-bold uppercase tracking-widest bg-primary text-primary-foreground px-2 py-0.5">1-TAP</span>
            <h2 className="font-display text-xl uppercase tracking-tighter">Быстрый импорт в Happ</h2>
          </div>
          <p className="text-muted-foreground text-sm mb-4">
            Нажмите кнопку ниже — Happ откроется автоматически и предложит импортировать конфигурацию с маршрутами (RU-сайты напрямую, остальные через VPN).
          </p>
          <a
            href={happUrl}
            className="inline-block bg-primary text-primary-foreground px-8 py-4 font-bold uppercase tracking-widest text-sm nemo-shadow-sm hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
          >
            Открыть в Happ →
          </a>
        </section>

        {/* Tabs */}
        <section className="border border-border">
          <div className="flex border-b border-border">
            {[
              { id: "singbox", label: "sing-box конфиг", desc: "Рекомендуется" },
              { id: "vless", label: "VLESS URI", desc: "Ручной импорт" },
              { id: "details", label: "Детали", desc: "Параметры" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 p-4 text-left transition-colors ${
                  activeTab === tab.id
                    ? "bg-surface border-b-2 border-primary"
                    : "hover:bg-surface/50"
                }`}
              >
                <div className={`text-sm font-bold uppercase tracking-wider ${activeTab === tab.id ? "text-primary" : "text-muted-foreground"}`}>
                  {tab.label}
                </div>
                <div className="text-[10px] text-muted-foreground mt-0.5">{tab.desc}</div>
              </button>
            ))}
          </div>

          <div className="p-6">
            {/* sing-box config tab */}
            {activeTab === "singbox" && (
              <div className="space-y-4">
                <div className="flex items-start gap-3 mb-4">
                  <span className="mt-1 text-primary">⚡</span>
                  <div>
                    <h3 className="font-bold text-foreground">Готовый конфиг для sing-box / Happ</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Содержит split routing: российские сайты идут напрямую, заблокированные — через VPN.
                      Также включает Whitelist-RU inbound для обхода белых списков (VK, Mail.ru).
                    </p>
                  </div>
                </div>
                <div className="bg-background border border-border p-4 font-mono text-xs text-primary overflow-x-auto">
                  <pre className="whitespace-pre-wrap break-all">{singboxUrl}</pre>
                </div>
                <div className="flex flex-wrap gap-3">
                  <CopyButton text={singboxUrl} label="Копировать ссылку" />
                  <a
                    href={`/api/sub/${token}?format=singbox`}
                    download="nemo-singbox-config.json"
                    className="inline-block border border-primary text-primary px-4 py-2 text-xs font-bold uppercase tracking-widest hover:bg-primary hover:text-primary-foreground transition-all"
                  >
                    Скачать .json
                  </a>
                </div>

                <div className="mt-6 border-t border-border pt-6">
                  <h4 className="font-bold text-foreground text-sm mb-3">Инструкция для Happ / sing-box:</h4>
                  <ol className="space-y-3 text-sm text-muted-foreground">
                    <li className="flex gap-3">
                      <span className="text-primary font-mono font-bold">01</span>
                      <span>Скопируйте ссылку выше или скачайте .json файл</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-primary font-mono font-bold">02</span>
                      <span>Откройте Happ → Профиль → Импорт из URL (или нажмите 1-TAP выше)</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-primary font-mono font-bold">03</span>
                      <span>Подключитесь — российские сайты пойдут напрямую, остальные через VPN</span>
                    </li>
                  </ol>
                </div>
              </div>
            )}

            {/* VLESS URI tab */}
            {activeTab === "vless" && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-primary font-mono text-xs font-bold">INBOUND 1</span>
                      <span className="text-[10px] text-muted-foreground uppercase tracking-widest">Standard — порт 8443</span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">Основной inbound. Все заблокированные сайты через VPN.</p>
                    <div className="bg-background border border-border p-4 font-mono text-xs text-primary overflow-x-auto">
                      <pre className="whitespace-pre-wrap break-all">{vlessStandardUrl}</pre>
                    </div>
                    <div className="mt-2">
                      <CopyButton text={vlessStandardUrl} label="Копировать VLESS URI" />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-primary font-mono text-xs font-bold">INBOUND 2</span>
                      <span className="text-[10px] text-muted-foreground uppercase tracking-widest">Whitelist-RU — порт 2083</span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">Whitelist inbound. Для обхода белых списков (VK, Mail.ru видят российский выходной IP).</p>
                    <div className="bg-background border border-border p-4 font-mono text-xs text-primary overflow-x-auto">
                      <pre className="whitespace-pre-wrap break-all">{vlessWhitelistUrl}</pre>
                    </div>
                    <div className="mt-2">
                      <CopyButton text={vlessWhitelistUrl} label="Копировать VLESS URI" />
                    </div>
                  </div>
                </div>

                <div className="border-t border-border pt-6">
                  <h4 className="font-bold text-foreground text-sm mb-3">Инструкция для ручного импорта:</h4>
                  <ol className="space-y-3 text-sm text-muted-foreground">
                    <li className="flex gap-3">
                      <span className="text-primary font-mono font-bold">01</span>
                      <span>Скопируйте VLESS URI нужного inbound</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-primary font-mono font-bold">02</span>
                      <span>Откройте Happ / v2rayNG / Netsphere → Импорт из буфера обмена</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-primary font-mono font-bold">03</span>
                      <span>Для split routing используйте sing-box конфиг (вкладка выше)</span>
                    </li>
                  </ol>
                </div>
              </div>
            )}

            {/* Details tab */}
            {activeTab === "details" && (
              <div className="space-y-4">
                <h3 className="font-bold text-foreground mb-4">Параметры подключения</h3>

                <div className="space-y-3">
                  {[
                    { label: "Сервер", value: SERVER_DOMAIN, sub: "IP: 81.26.180.40" },
                    { label: "Протокол", value: "VLESS" },
                    { label: "Безопасность", value: "Reality" },
                    { label: "UUID", value: token, mono: true },
                    { label: "", type: "divider" },
                    { label: "Standard Inbound", type: "header" },
                    { label: "Порт", value: "8443" },
                    { label: "SNI", value: "www.microsoft.com" },
                    { label: "Short ID", value: "6c6992c8" },
                    { label: "Public Key", value: "O1iyQMVfn3K6Yp1Ctoo5vuvkt4H0qaSxHAVglCXud2M", mono: true },
                    { label: "Flow", value: "xtls-rprx-vision" },
                    { label: "", type: "divider" },
                    { label: "Whitelist-RU Inbound", type: "header" },
                    { label: "Порт", value: "2083" },
                    { label: "SNI", value: "www.yandex.ru" },
                    { label: "Short ID", value: "5a3b7f1d" },
                    { label: "Public Key", value: "O1iyQMVfn3K6Yp1Ctoo5vuvkt4H0qaSxHAVglCXud2M", mono: true },
                    { label: "Flow", value: "(пустой)" },
                  ].map((item, i) => {
                    if (item.type === "divider") {
                      return <div key={i} className="border-t border-border my-2" />;
                    }
                    if (item.type === "header") {
                      return (
                        <div key={i} className="font-display text-primary uppercase tracking-wider text-sm pt-2">
                          {item.label}
                        </div>
                      );
                    }
                    return (
                      <div key={i} className="flex justify-between items-start gap-4 py-1">
                        <span className="text-xs text-muted-foreground uppercase tracking-widest shrink-0">{item.label}</span>
                        <div className="text-right">
                          <span className={`text-sm ${item.mono ? "font-mono text-primary text-xs" : "text-foreground"}`}>
                            {item.value}
                          </span>
                          {item.sub && (
                            <div className="text-[10px] text-muted-foreground">{item.sub}</div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-6 border-t border-border pt-6">
                  <h4 className="font-bold text-foreground text-sm mb-3">Маршрутизация (sing-box конфиг)</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="border border-border p-4">
                      <div className="text-[10px] text-primary font-bold uppercase tracking-widest mb-2">Прямое соединение</div>
                      <ul className="space-y-1 text-xs text-muted-foreground">
                        <li>✓ Российские сайты (geosite-ru)</li>
                        <li>✓ Российские IP (geoip-ru)</li>
                        <li>✓ Локальные адреса</li>
                        <li>✓ DNS кеш</li>
                      </ul>
                    </div>
                    <div className="border border-border p-4">
                      <div className="text-[10px] text-primary font-bold uppercase tracking-widest mb-2">Через VPN</div>
                      <ul className="space-y-1 text-xs text-muted-foreground">
                        <li>✓ Заблокированные сайты</li>
                        <li>✓ Международные сервисы</li>
                        <li>✓ Прочие домены</li>
                      </ul>
                    </div>
                    <div className="border border-primary/30 bg-primary/5 p-4 sm:col-span-2">
                      <div className="text-[10px] text-primary font-bold uppercase tracking-widest mb-2">Whitelist-RU (порт 2083)</div>
                      <p className="text-xs text-muted-foreground">
                        VK, Mail.ru и другие российские сервисы с белыми списками — через специальный inbound
                        с российским SNI, чтобы они видели российский контент без блокировок.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Client Download Links */}
        <section className="border border-border p-6">
          <h2 className="font-display text-xl uppercase tracking-tighter mb-4">Клиенты для подключения</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { name: "Happ", platforms: "iOS, Android, macOS, Windows, Linux", desc: "Рекомендуется. Поддерживает sing-box конфиг с маршрутизацией.", url: "https://happ.plus" },
              { name: "v2rayNG", platforms: "Android", desc: "Альтернатива. Импортируйте VLESS URI.", url: "https://github.com/2dust/v2rayNG" },
              { name: "Nekoray", platforms: "Windows, Linux", desc: "Альтернатива для десктопа. Импорт VLESS URI.", url: "https://github.com/MatsuriDayo/nekoray" },
              { name: "NekoBox", platforms: "Android", desc: "Альтернатива с поддержкой sing-box.", url: "https://github.com/MatsuriDayo/NekoBox" },
            ].map((client) => (
              <a
                key={client.name}
                href={client.url}
                target="_blank"
                rel="noopener noreferrer"
                className="border border-border p-4 hover:border-primary transition-colors group"
              >
                <div className="flex items-baseline justify-between mb-1">
                  <span className="font-bold text-foreground group-hover:text-primary transition-colors">{client.name}</span>
                  <span className="text-[10px] text-muted-foreground">{client.platforms}</span>
                </div>
                <p className="text-xs text-muted-foreground">{client.desc}</p>
              </a>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center py-6 border-t border-border">
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest">
            NEMO VPN — Без логов · Без следов · Без компромиссов
          </p>
          <a href="/" className="inline-block mt-2 text-xs text-primary border-b border-primary pb-0.5 hover:opacity-80">
            ← На главную
          </a>
        </footer>
      </main>
    </div>
  );
}
