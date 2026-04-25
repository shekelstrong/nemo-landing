import { useState, useEffect } from "react";
import Head from "next/head";

/* ───── Accordion ───── */
function Accordion({ title, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-border">
      <button onClick={() => setOpen(!open)} className="accordion-trigger">
        <span className="flex items-baseline gap-4">
          <span className="text-xs font-mono text-primary tabular-nums">{title.num}</span>
          {title.text}
        </span>
        <span className={`text-primary transition-transform ${open ? "rotate-180" : ""}`}>▾</span>
      </button>
      {open && <div className="accordion-content">{children}</div>}
    </div>
  );
}

/* ───── CopyBlock ───── */
function CopyBlock({ text }) {
  const [copied, setCopied] = useState(false);
  const copy = () => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  return (
    <div className="relative bg-background border border-border p-3 mt-3 text-sm font-mono text-primary">
      <button onClick={copy} className="absolute top-2 right-2 text-xs text-muted-foreground hover:text-primary transition">Копировать</button>
      <pre className="whitespace-pre-wrap pr-24">{text}</pre>
      {copied && <span className="absolute top-2 right-28 text-xs text-primary">Скопировано!</span>}
    </div>
  );
}

/* ───── DATA ───── */

// Тарифы из vpn_bot/config.py: базовая цена 100₽/мес, VIP 300₽/мес
// Скидки: 3м=10%, 6м=17%, 12м=25%
// Скидка 50% для тех, у кого уже есть платный VPN
const standardTiers = [
  { months: 1, label: "1 месяц", price: 100, monthly: 100 },
  { months: 3, label: "3 месяца", price: 270, monthly: 90, discount: "10%", highlight: false },
  { months: 6, label: "6 месяцев", price: 498, monthly: 83, discount: "17%", highlight: true },
  { months: 12, label: "1 год", price: 900, monthly: 75, discount: "25%", highlight: false },
];

const premiumTiers = [
  { months: 1, label: "1 месяц", price: 300, monthly: 300 },
  { months: 3, label: "3 месяца", price: 810, monthly: 270, discount: "10%" },
  { months: 6, label: "6 месяцев", price: 1494, monthly: 249, discount: "17%" },
  { months: 12, label: "1 год", price: 2700, monthly: 225, discount: "25%" },
];

const logLines = [
  "[SYSTEM] INITIALIZING VLESS-REALITY...",
  "[AUTH] HANDSHAKE → 200 OK",
  "[TUNNEL] BYPASSING DPI... DONE",
  "[ROUTE] WHITELIST_BREAK = TRUE",
  "[NODE] AMSTERDAM_02 // 12ms",
  "[STEALTH] MODE: ACTIVE",
];

const guides = [
  { tag: "iOS", title: "Happ: импорт ключа и Per-App VPN", duration: "02:30", type: "ВИДЕО" },
  { tag: "Android", title: "Happ: настройка за 60 секунд", duration: "01:45", type: "ВИДЕО" },
  { tag: "macOS", title: "Happ на macOS — подключение", duration: "02:00", type: "ВИДЕО" },
  { tag: "Windows", title: "Happ на Windows — первый запуск", duration: "02:15", type: "ВИДЕО" },
  { tag: "Linux", title: "Happ на Linux — установка", duration: "03:00", type: "ВИДЕО" },
  { tag: "iOS PRO", title: "Быстрые команды: авто on/off VPN", duration: "10 шагов", type: "ДОКУМЕНТ" },
];

const faqs = [
  { q: "Это законно?", a: "Использование VPN в России законно для физических лиц. Запрещена только публичная реклама обхода блокировок и использование VPN для доступа к экстремистскому контенту. NEMO не хранит логи и не несёт ответственности за то, к каким ресурсам вы подключаетесь." },
  { q: "Что приходит на email после оплаты?", a: "Два артефакта: (1) VPN-ключ — подключает зашифрованный туннель через VLESS Reality, и (2) ключ маршрутизации — направляет российские сайты напрямую, а заблокированные через VPN. Оба ключа импортируются в Happ одним нажатием." },
  { q: "Работает ли с банковскими приложениями?", a: "Да. Через Per-App VPN на iOS и split tunneling на Android туннель автоматически отключается при открытии RU-приложений из whitelist и снова поднимается для заблокированных сервисов. Никаких ручных переключателей." },
  { q: "Что если ноду заблокируют?", a: "Подписка автоматически переключится на резервный сервер. Subscription URL обновляется на лету — никаких действий от вас не требуется. У нас всегда 5+ свежих нод в ротации." },
  { q: "Сколько устройств можно подключить?", a: "На стандартном тарифе — без device tracking, подключайте сколько нужно. На VIP — device tracking активирован для защиты от расшаривания аккаунта." },
  { q: "Какие протоколы поддерживаются?", a: "VLESS, VLESS-Reality, XTLS-Vision. Reality — самый стелс-протокол: маскирует трафик под легитимный TLS-handshake популярных сайтов." },

  { q: "Есть ли лог-политика?", a: "Zero-logs. Мы не пишем ни IP, ни DNS-запросы, ни время сессий. Технически логи отключены на уровне Xray-конфигов." },
  { q: "Как получить скидку 50%?", a: "Если у вас уже есть платный VPN — покажите скриншот оплаты в боте и получите 50% скидку на аналогичный период. Платили за 1 месяц — получите 1 месяц за полцены. За год — год за полцены." },
  { q: "Что такое VIP тариф?", a: "VIP тариф (300₽/мес) — это обход белых списков платформ. Если Wildberries, Ozon или банк блокируют вас через VPN — VIP решает эту проблему через резидентные IP и продвинутую маршрутизацию. Включает лимит трафика: 100 ГБ на месяц, 350 ГБ на 3 месяца, 800 ГБ на 6 месяцев, 2048 ГБ на год. Можно докупать: 50 ГБ за 100₽, 100 ГБ за 200₽." },
  { q: "Сколько трафика на стандартном тарифе?", a: "Стандартный тариф (100₽/мес) — это полный безлимит. Никаких ограничений по трафику. Серфите, смотрите видео, скачивайте — без счётчика." },
];

/* ───── PAGE ───── */
export default function Home() {
  const [shown, setShown] = useState([]);
  const [selectedTier, setSelectedTier] = useState(2); // 6 months default
  const [showDiscount, setShowDiscount] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeTab, setActiveTab] = useState("standard");

  useEffect(() => {
    let i = 0;
    const id = setInterval(() => {
      setShown(s => (s.length >= logLines.length ? [logLines[0]] : [...s, logLines[i % logLines.length]]));
      i++;
    }, 700);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const tiers = activeTab === "standard" ? standardTiers : premiumTiers;
  const currentTier = tiers[selectedTier] || tiers[0];
  const discountPrice = showDiscount ? Math.round(currentTier.price / 2) : null;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Head>
        <title>NEMO VPN — Stealth-туннель для свободного интернета</title>
        <meta name="description" content="VLESS Reality VPN. Обход РКН, DPI, белых списков. Оплата МИР/СБП. 24ч бесплатно." />
      </Head>

      {/* ═══ NAVBAR ═══ */}
      <nav className={`fixed top-0 inset-x-0 z-50 border-b transition-colors ${scrolled ? "border-border bg-background/85 backdrop-blur-md" : "border-transparent bg-transparent"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <a href="#top" className="flex items-center gap-3">
            <span className="font-display text-xl uppercase tracking-tighter text-foreground">
              Nemo<span className="text-primary">.</span>VPN
            </span>
            <span className="hidden sm:inline-flex items-center gap-2 px-2 py-0.5 text-[10px] bg-primary text-primary-foreground font-bold tracking-widest uppercase">
              <span className="size-1.5 rounded-full bg-primary-foreground animate-blink" />
              Network Active
            </span>
          </a>
          <div className="hidden md:flex gap-7 text-xs uppercase tracking-widest font-bold">
            {[
              { href: "#manifesto", label: "Манифест" },
              { href: "#protocol", label: "Как работает" },
              { href: "#pricing", label: "Тарифы" },
              { href: "#setup", label: "Настройка" },
              { href: "#faq", label: "FAQ" },
            ].map(l => (
              <a key={l.href} href={l.href} className="text-muted-foreground hover:text-primary transition-colors">{l.label}</a>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden lg:block text-[10px] text-primary font-mono">NODE: RU-MOS-01 // 99.94%</span>
            <a href="#pricing" className="px-3 py-2 bg-primary text-primary-foreground text-[11px] font-bold uppercase tracking-widest hover:translate-x-0.5 hover:translate-y-0.5 transition-transform">
              Тарифы
            </a>
          </div>
        </div>
      </nav>

      {/* ═══ HERO ═══ */}
      <header id="top" className="relative pt-32 pb-20 px-4 sm:px-6 nemo-noise">
        <div className="absolute inset-0 pointer-events-none nemo-scan" />
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 relative">
          <div className="lg:col-span-8 flex flex-col justify-center">
            <div className="inline-flex w-fit items-center gap-2 mb-6 px-3 py-1 border border-border text-[10px] font-bold tracking-widest uppercase text-primary">
              <span className="size-1.5 bg-primary animate-blink" />
              Сборка v1.0.42 / VLESS Reality
            </div>
            <h1 className="font-display text-5xl sm:text-6xl md:text-7xl xl:text-8xl uppercase leading-[0.88] tracking-tighter text-foreground">
              Свобода начинается <span className="text-primary">здесь</span>.
            </h1>
            <p className="mt-8 max-w-[54ch] text-base sm:text-lg text-muted-foreground leading-relaxed">
              NEMO VPN — VPN-сервис с ключом маршрутизации. Заблокированные сайты через VPN, российские — напрямую. VLESS Reality, без логов, без следов.
            </p>
            <div className="mt-10 flex flex-wrap gap-4 items-stretch">
              <a href="#pricing" className="bg-primary text-primary-foreground px-7 py-4 font-bold uppercase tracking-widest text-sm nemo-shadow-sm hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
                Получить доступ
              </a>
              <a href="#discount" className="px-7 py-4 border-2 border-red-500 text-red-500 font-bold uppercase tracking-widest text-sm animate-red-blink hover:bg-red-500 hover:text-white transition-all">
                VPN за полцены
              </a>
              <a href="#setup" className="px-7 py-4 border border-border text-foreground font-bold uppercase tracking-widest text-sm hover:border-primary hover:text-primary transition-colors">
                Инструкции
              </a>
              <div className="px-5 py-3 border border-border flex flex-col justify-center">
                <span className="text-[10px] text-muted-foreground uppercase tracking-widest">Цена</span>
                <span className="font-bold tabular-nums text-foreground">от 100 ₽ / мес</span>
              </div>
            </div>
            <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-[11px] uppercase tracking-widest text-muted-foreground">
              <span>✓ No logs</span>
              <span>✓ VLESS / Reality</span>
              <span>✓ Ключ маршрутизации</span>
              <span>✓ Per-App VPN iOS</span>
              <span>✓ Telegram Mini-App</span>
              <span>✓ −50% если есть платный VPN</span>
            </div>
          </div>
          <aside className="lg:col-span-4 border border-border bg-surface p-3 relative">
            <div className="absolute -top-3 left-3 px-2 py-0.5 bg-background border border-border text-[10px] tracking-widest text-muted-foreground uppercase">
              ENCRYPTED_PREVIEW.DAT
            </div>
            <div className="bg-background aspect-[3/4] flex flex-col gap-1.5 p-4 overflow-hidden text-[11px] text-primary font-mono border border-border/50">
              {shown.map((line, idx) => (
                <div key={idx} className="animate-fade-up">{line}</div>
              ))}
              <div className="mt-auto space-y-1">
                <div className="opacity-50 text-foreground">01011101 01100001 01111000</div>
                <div className="opacity-30 text-foreground">11010110 00110111 11011100</div>
                <div className="h-10 w-full bg-primary/20 relative overflow-hidden">
                  <div className="absolute inset-y-0 w-1/3 bg-primary/60 animate-blink" />
                </div>
                <div className="flex justify-between text-[10px] text-muted-foreground uppercase">
                  <span>UPTIME 99.94%</span>
                  <span>0.00% LEAK</span>
                </div>
              </div>
            </div>
          </aside>
        </div>

        {/* Marquee */}
        <div className="mt-16 border-y border-border py-3 overflow-hidden">
          <div className="flex gap-12 animate-marquee whitespace-nowrap text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
            {[...Array(4)].map((_, k) => (
              <div key={k} className="flex gap-12 shrink-0">
                <span>★ Обход РКН</span>
                <span>★ Обход белых списков</span>
                <span>★ VLESS Reality</span>
                <span>★ Без логов</span>
                <span>★ Per-App VPN</span>
                <span>★ Telegram Mini-App</span>
                <span>★ Анонимная оплата</span>
                <span>★ 99.94% Аптайм</span>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* ═══ MANIFESTO ═══ */}
      <section id="manifesto" className="px-4 sm:px-6 py-24 sm:py-32 relative">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-7">
            <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-primary">/ Манифест</span>
            <h2 className="mt-6 font-display text-4xl sm:text-5xl md:text-6xl uppercase leading-[0.95] tracking-tighter text-foreground">
              Интернет должен быть <span className="text-primary italic">свободным</span>. <br />
              Мы делаем его таким снова.
            </h2>
            <div className="mt-8 space-y-5 text-muted-foreground text-base sm:text-lg max-w-[60ch] leading-relaxed">
              <p>
                NEMO построен инженерами для тех, кто устал от того, что государство решает,
                какой контент вам потреблять. Никаких заявок, никаких объяснений, никаких
                «это для вашей безопасности».
              </p>
              <p>
                Мы используем актуальные stealth-протоколы (VLESS-Reality, XTLS, Vision),
                маскируем трафик под обычный HTTPS и держим ноды там, где их не достанут
                суверенные фаерволы. Если ноду банят — поднимаем новую за 4 минуты.
              </p>
            </div>
          </div>
          <div className="lg:col-span-5 border border-border">
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-px bg-border">
              {[
                { k: "DPI", v: "Обход" },
                { k: "РКН", v: "Не видит" },
                { k: "Белые списки", v: "Обход" },
                { k: "Логи", v: "Ноль" },
              ].map(p => (
                <div key={p.k} className="bg-background p-5 sm:p-8 group hover:bg-surface transition-colors flex flex-col justify-center items-center text-center">
                  <div className="text-[10px] sm:text-[11px] uppercase tracking-widest text-muted-foreground mb-2">// {p.k}</div>
                  <div className="font-display text-xl sm:text-2xl lg:text-3xl uppercase text-primary">{p.v}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ HOW IT WORKS ═══ */}
      <section id="protocol" className="border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 flex items-baseline gap-4">
          <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-primary">/ Как это работает</span>
          <div className="h-px grow bg-border" />
          <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-muted-foreground">3 шага</span>
        </div>
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 border-t border-l border-border">
          {[
            { n: "01", title: "Оплата", body: "Карта МИР, СБП или крипта через защищённый чекаут. Нужен только email для доставки ключей. Никакой регистрации.", highlight: false },
            { n: "02", title: "Два ключа", body: "На email и в Telegram мгновенно приходят: VPN-ключ + ключ маршрутизации. VPN-ключ подключает туннель, ключ маршрутизации направляет РУ-сайты напрямую, а заблокированные — через VPN.", highlight: true },
            { n: "03", title: "Happ — один клиент", body: "Единственное приложение — Happ. Работает на iOS, Android, macOS, Windows, Linux. Импорт ключа — один клик. Per-App VPN на iOS автоматически включает туннель только для заблокированных.", highlight: false },
          ].map(s => (
            <article key={s.n} className={`p-10 lg:p-12 border-r border-b border-border ${s.highlight ? "bg-primary text-primary-foreground" : "bg-background"}`}>
              <div className={`font-display text-5xl italic mb-6 ${s.highlight ? "text-primary-foreground" : "text-primary"}`}>{s.n}</div>
              <h3 className={`text-2xl font-bold uppercase mb-4 ${s.highlight ? "text-primary-foreground" : "text-foreground"}`}>{s.title}</h3>
              <p className={`text-sm leading-relaxed ${s.highlight ? "text-primary-foreground/80" : "text-muted-foreground"}`}>{s.body}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ═══ PRICING ═══ */}
      <section id="pricing" className="bg-surface border-y border-border px-4 sm:px-6 py-24">
        <div className="max-w-7xl mx-auto">

          {/* 50% Promo Banner — FIRST thing visible */}
          <div className="mb-16 border-2 border-primary neon-border p-8 md:p-10 text-center max-w-3xl mx-auto">
            <div className="inline-block bg-primary text-primary-foreground px-4 py-1 text-lg font-bold uppercase tracking-widest mb-4">
              −50%
            </div>
            <h3 className="font-display text-2xl sm:text-3xl uppercase tracking-tighter text-foreground mb-3">
              Уже есть VPN? Переходи за полцены
            </h3>
            <p className="text-muted-foreground max-w-lg mx-auto leading-relaxed">
              Покажите действующую платную подписку на любой VPN — и получите NEMO со скидкой 50% на такой же срок.
              Месяц у конкурента = месяц NEMO за полцены. Год = год за полцены.
            </p>
            <p className="text-primary text-sm mt-4 font-bold uppercase tracking-widest">
              Скриншот → AI-проверка → 2 минуты → готово
            </p>
          </div>

          <div className="text-center mb-16">
            <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-primary">/ Тарифы</span>
            <h2 className="mt-4 font-display text-4xl sm:text-5xl md:text-6xl uppercase tracking-tighter">
              Выберите режим доступа
            </h2>
            <p className="mt-4 text-muted-foreground text-sm max-w-md mx-auto">
              Универсальный доступ ко всем нодам и протоколам. Оплата МИР / СБП / крипта.
            </p>
          </div>

          {/* Tab switcher */}
          <div className="flex justify-center gap-2 mb-10">
            {[
              { id: "standard", label: "Стандарт" },
              { id: "premium", label: "VIP (Обход белых списков)" },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setSelectedTier(0); }}
                className={`px-4 py-2 text-xs uppercase tracking-widest font-bold transition-all ${
                  activeTab === tab.id
                    ? "bg-primary text-primary-foreground"
                    : "border border-border text-muted-foreground hover:border-primary hover:text-primary"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {tiers.map((t, i) => (
              <button
                key={t.months}
                onClick={() => setSelectedTier(i)}
                className={`relative p-8 flex flex-col text-left transition-all neon-border ${
                  selectedTier === i
                    ? t.highlight
                      ? "border-2 border-primary nemo-glow bg-background"
                      : "border-2 border-primary bg-background"
                    : "border border-border bg-background hover:border-primary/50"
                }`}
              >
                {t.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-3 py-0.5 text-[10px] font-bold uppercase tracking-widest">
                    Популярный
                  </div>
                )}
                <div className="text-[11px] text-muted-foreground uppercase tracking-widest mb-3">{t.label}</div>
                {t.discount && (
                  <div className="text-[10px] text-primary font-bold uppercase mb-2">Скидка {t.discount}</div>
                )}
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-4xl font-display font-bold tabular-nums text-foreground">
                    {t.price}<span className="text-lg text-muted-foreground"> ₽</span>
                  </span>
                </div>
                <div className="text-xs text-muted-foreground mb-6">{t.monthly} ₽ / мес</div>
                <ul className="space-y-3 mb-8 text-sm">
                  <li className="flex items-start gap-3 text-muted-foreground">
                    <span className="mt-1.5 size-1.5 bg-primary shrink-0" />
                    <span>VLESS Reality</span>
                  </li>
                  <li className="flex items-start gap-3 text-muted-foreground">
                    <span className="mt-1.5 size-1.5 bg-primary shrink-0" />
                    <span>{activeTab === "standard" ? "Безлимит" : "100 ГБ / мес"}</span>
                  </li>
                  <li className="flex items-start gap-3 text-muted-foreground">
                    <span className="mt-1.5 size-1.5 bg-primary shrink-0" />
                    <span>{activeTab === "standard" ? "Без device tracking" : "Device tracking"}</span>
                  </li>
                  <li className="flex items-start gap-3 text-muted-foreground">
                    <span className="mt-1.5 size-1.5 bg-primary shrink-0" />
                    <span>{activeTab === "standard" ? "Все ноды" : "Все ноды + резидентные IP"}</span>
                  </li>
                  {activeTab === "premium" && (
                    <li className="flex items-start gap-3 text-muted-foreground">
                      <span className="mt-1.5 size-1.5 bg-primary shrink-0" />
                      <span>Обход белых списков</span>
                    </li>
                  )}
                  <li className="flex items-start gap-3 text-muted-foreground">
                    <span className="mt-1.5 size-1.5 bg-primary shrink-0" />
                    <span>Per-App VPN iOS</span>
                  </li>
                  <li className="flex items-start gap-3 text-muted-foreground">
                    <span className="mt-1.5 size-1.5 bg-primary shrink-0" />
                    <span>Telegram Mini-App</span>
                  </li>
                </ul>
                <div className={`mt-auto w-full py-3 text-center font-bold uppercase tracking-widest text-xs transition-all ${
                  selectedTier === i
                    ? "bg-primary text-primary-foreground"
                    : "border border-border text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary"
                }`}>
                  {selectedTier === i ? "Выбрано ✓" : "Выбрать"}
                </div>
              </button>
            ))}
          </div>

          {/* Кнопка оплаты */}
          <div className="mt-8 text-center">
            <button
              onClick={() => setShowPaymentModal(true)}
              className="bg-primary text-primary-foreground px-10 py-4 font-bold uppercase tracking-widest text-sm nemo-shadow-sm hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
            >
              Оплатить {showDiscount ? Math.round(currentTier.price / 2) : currentTier.price} ₽
            </button>
          </div>

          {/* Модальное окно оплаты */}
          {showPaymentModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={() => setShowPaymentModal(false)}>
              <div className="bg-background border border-border p-8 max-w-md w-full mx-4 relative" onClick={e => e.stopPropagation()}>
                <button onClick={() => setShowPaymentModal(false)} className="absolute top-4 right-4 text-muted-foreground hover:text-primary transition-colors text-xl">✕</button>
                <div className="text-center space-y-4">
                  <div className="text-5xl">🚧</div>
                  <h3 className="font-display text-2xl uppercase tracking-tighter text-foreground">Оплата скоро будет доступна</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Мы готовим для вас удобную оплату через СБП и криптовалюту. А пока — напишите нам в Telegram-бот, и мы оформим подписку вручную.
                  </p>
                  <div className="text-3xl font-display font-bold tabular-nums text-primary">
                    {showDiscount ? Math.round(currentTier.price / 2) : currentTier.price} ₽
                    <span className="text-sm text-muted-foreground ml-2">/ {currentTier.label}</span>
                    {activeTab === "premium" && " (VIP)"}
                  </div>
                  <a
                    href="https://t.me/nemo_vpn_bot"
                    target="_blank"
                    rel="noopener"
                    className="inline-block bg-primary text-primary-foreground px-7 py-4 font-bold uppercase tracking-widest text-sm nemo-shadow-sm hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all mt-4"
                  >
                    Написать в @nemo_vpn_bot
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Discount banner with interactive toggle */}
          <div id="discount" className="mt-10 border border-primary/30 bg-background p-6 max-w-2xl mx-auto neon-border">
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-primary text-primary-foreground px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest">−50%</span>
              <span className="text-sm text-muted-foreground">Если уже есть платный VPN</span>
            </div>
            <div className="flex items-center gap-4 mb-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  className="vpn-toggle"
                  checked={showDiscount}
                  onChange={() => setShowDiscount(!showDiscount)}
                />
                <span className="text-sm font-bold text-foreground">У меня уже есть VPN</span>
              </label>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Если у вас уже есть платный VPN — мы даём <strong className="text-primary">50% скидку</strong> на аналогичный период.
              Платили за 1 месяц — получите 1 месяц за полцены. За 3 месяца — 3 месяца за полцены. За год — год за полцены.
            </p>
            <p className="text-xs text-muted-foreground mt-2">Покажите скриншот оплаты в <a href="https://t.me/nemo_vpn_bot" className="text-primary border-b border-primary pb-0.5">@nemo_vpn_bot</a></p>
            {showDiscount && (
              <div className="mt-4 p-3 bg-surface border border-primary discount-reveal">
                <div className="font-mono text-sm">
                  <span className="text-muted-foreground">Старая цена: </span>
                  <span className="text-muted-foreground line-through">{currentTier.price} ₽</span>
                  <span className="text-muted-foreground ml-4">Новая цена: </span>
                  <span className="text-primary font-bold tabular-nums text-lg">{Math.round(currentTier.price / 2)} ₽</span>
                  <span className="text-muted-foreground ml-2">/ {currentTier.label}</span>
                </div>
                <div className="mt-2 text-xs text-primary">
                  Экономия: {Math.round(currentTier.price / 2)} ₽
                </div>
              </div>
            )}
          </div>

          <p className="mt-10 text-center text-[11px] text-muted-foreground uppercase tracking-widest">
            После оплаты ключи приходят на email и в Telegram в течение 30 секунд. 24ч бесплатно.
          </p>
        </div>
      </section>

      {/* ═══ iOS Per-App VPN ═══ */}
      <section className="px-4 sm:px-6 py-24 nemo-noise">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-primary">/ iOS Automation</span>
            <h2 className="mt-4 font-display text-4xl sm:text-5xl md:text-6xl uppercase tracking-tighter leading-[0.95]">
              Per-App <span className="text-primary italic">VPN</span>
            </h2>
            <p className="mt-6 text-muted-foreground text-base sm:text-lg max-w-[55ch] leading-relaxed">
              Настройте VPN для каждого приложения отдельно. Instagram, YouTube и ChatGPT работают через VPN,
              а Сбер, Госуслуги и Wildberries — через прямое соединение. Без переключателей. Автоматически.
            </p>
            <ul className="mt-8 space-y-4">
              {[
                "Не садит батарею — туннель активен только для нужных приложений",
                "Банки и маркетплейсы видят российский IP — никаких блокировок",
                "Работает с iOS 16+, iPadOS, macOS Sonoma",
                "Настраивается за 2 минуты через Happ",
              ].map(b => (
                <li key={b} className="flex gap-4 items-start">
                  <span className="mt-2 size-1.5 bg-primary shrink-0" />
                  <span className="text-foreground/80">{b}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="relative">
            <div className="absolute -inset-3 border border-primary/30" />
            <div className="relative bg-background border border-border p-5 font-mono text-xs">
              <div className="flex items-center justify-between mb-4 text-[10px] uppercase tracking-widest text-muted-foreground">
                <span>PER_APP_VPN.conf</span>
                <span className="text-primary animate-blink">● ACTIVE</span>
              </div>
              <pre className="text-[11px] text-muted-foreground leading-relaxed whitespace-pre-wrap">{`# NEMO Per-App VPN Configuration
# iOS Settings → VPN → Happ → Настройки

[vpn-apps]
# Через VPN (заблокированные):
connect = [
  "com.instagram",
  "com.google.youtube",
  "com.openai.chatgpt",
  "com.spotify.client",
]

# Напрямую (российские):
bypass = [
  "ru.sberbank.mobile",
  "com.vkontakte",
  "ru.ozon.android",
  "ru.wildberries",
  "ru.gosuslugi",
]

[default]
route = vpn  # всё остальное через VPN`}</pre>
              <div className="mt-4 grid grid-cols-2 gap-2">
                {[
                  { trigger: "Open: Instagram", action: "VPN → ON", on: true },
                  { trigger: "Open: YouTube", action: "VPN → ON", on: true },
                  { trigger: "Open: Сбер", action: "VPN → OFF", on: false },
                  { trigger: "Open: Wildberries", action: "VPN → OFF", on: false },
                ].map(row => (
                  <div key={row.trigger} className="border border-border p-3 flex flex-col gap-1">
                    <span className="text-[10px] text-muted-foreground uppercase tracking-widest">{row.trigger}</span>
                    <span className={`text-[11px] font-bold ${row.on ? "text-primary" : "text-muted-foreground line-through"}`}>
                      → {row.action}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ TELEGRAM BOT ═══ */}
      <section className="px-4 sm:px-6 py-24 bg-surface border-y border-border">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative order-2 lg:order-1">
            <div className="absolute -inset-3 border border-primary/30" />
            <div className="relative bg-background border border-border aspect-[9/16] max-w-sm mx-auto p-4 flex flex-col">
              <div className="flex items-center justify-between text-[10px] font-mono text-muted-foreground uppercase tracking-widest pb-3 border-b border-border">
                <span>@nemo_vpn_bot</span>
                <span className="text-primary">● online</span>
              </div>
              <div className="flex-1 flex flex-col gap-3 py-4 overflow-hidden">
                <div className="self-start max-w-[80%] bg-surface border border-border px-3 py-2 text-xs">
                  👋 Привет! Твоя подписка <span className="text-primary">Standard</span> активна до 22.05.2026
                </div>
                <div className="self-end max-w-[80%] bg-primary text-primary-foreground px-3 py-2 text-xs font-bold">/stats</div>
                <div className="self-start max-w-[85%] bg-surface border border-border px-3 py-2 text-xs space-y-1">
                  <div>📊 Использовано: 14.2 GB</div>
                  <div>🌐 Активная нода: AMS-02</div>
                  <div>⚡ Пинг: 12ms</div>
                </div>
                <div className="self-end max-w-[80%] bg-primary text-primary-foreground px-3 py-2 text-xs font-bold">
                  Открыть Mini-App ↗
                </div>
              </div>
              <div className="border-t border-border pt-3 grid grid-cols-3 gap-1.5">
                {["Keys", "Stats", "Help"].map(b => (
                  <div key={b} className="border border-border py-2 text-[10px] font-bold uppercase tracking-widest text-center text-muted-foreground">{b}</div>
                ))}
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-primary">/ Telegram Mini-App</span>
            <h2 className="mt-4 font-display text-4xl sm:text-5xl md:text-6xl uppercase tracking-tighter leading-[0.95]">
              Контроль из <span className="text-primary italic">кармана</span>
            </h2>
            <p className="mt-6 text-muted-foreground text-base sm:text-lg max-w-[55ch] leading-relaxed">
              Управляйте VPN-аккаунтом прямо в Telegram через Mini-App: продление, ротация ключей, статистика, переключение нод.
            </p>
            <ul className="mt-8 space-y-3">
              {[
                "Управление подпиской и продление",
                "Ротация ключей в один тап",
                "Статистика трафика и подключений",
                "Смена сервера и протокола на лету",
                "Поддержка прямо в чате 24/7",
              ].map(f => (
                <li key={f} className="flex items-start gap-3 text-foreground/80">
                  <span className="mt-2 size-1.5 bg-primary shrink-0" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <a href="https://t.me/nemo_vpn_bot" target="_blank" rel="noopener" className="mt-10 inline-flex bg-primary text-primary-foreground px-7 py-4 font-bold uppercase tracking-widest text-sm nemo-shadow-sm hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
              Открыть @nemo_vpn_bot
            </a>
          </div>
        </div>
      </section>

      {/* ═══ SETUP GUIDES ═══ */}
      <section id="setup" className="px-4 sm:px-6 py-24">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between flex-wrap gap-6 mb-12">
            <div>
              <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-primary">/ Инструкции</span>
              <h2 className="mt-4 font-display text-4xl sm:text-5xl md:text-6xl uppercase tracking-tighter max-w-3xl">
                Инструкции
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-border border border-border">
            {guides.map(g => (
              <div key={g.title} className="bg-background p-6 group hover:bg-surface transition-colors flex flex-col gap-5">
                <div className="aspect-video bg-surface relative overflow-hidden border border-border">
                  <div className="absolute inset-0 opacity-30" style={{backgroundImage: "repeating-linear-gradient(45deg, hsl(70 100% 50% / 0.15) 0 2px, transparent 2px 12px)"}} />
                  <div className="absolute top-3 left-3 px-2 py-0.5 bg-background border border-border text-[10px] uppercase tracking-widest text-primary">{g.tag}</div>
                  <div className="absolute bottom-3 right-3 px-2 py-0.5 bg-primary text-primary-foreground text-[10px] uppercase tracking-widest font-bold">{g.type}</div>
                </div>
                <div>
                  <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors">{g.title}</h3>
                  <div className="mt-2 text-[11px] uppercase tracking-widest text-muted-foreground">{g.duration}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Detailed instructions */}
          <div className="mt-16 max-w-3xl mx-auto space-y-6">
            <h3 className="font-display text-2xl uppercase tracking-tighter text-foreground mb-8">Подробные инструкции</h3>

            <Accordion title={{ num: "01", text: "iOS / iPadOS — Happ + Per-App VPN" }} defaultOpen>
              <div className="space-y-3">
                <p><strong className="text-foreground">Автоматическое переключение VPN для российских и заблокированных сервисов.</strong></p>
                <CopyBlock text="Скачать Happ (App Store) → Импортировать VPN-ключ из бота → Настроить Per-App VPN" />
                <p className="text-sm mt-3"><strong className="text-primary">Per-App VPN настройка:</strong></p>
                <ol className="list-decimal pl-5 space-y-1 text-sm">
                  <li>Настройки → VPN → Happ → Настройки маршрутизации</li>
                  <li>«Использовать VPN для» → выберите приложения</li>
                  <li>Instagram, YouTube, ChatGPT — через VPN</li>
                  <li>Сбер, ВТБ, Госуслуги, Wildberries — напрямую</li>
                  <li>Всё переключается автоматически</li>
                </ol>
              </div>
            </Accordion>

            <Accordion title={{ num: "02", text: "Android — Happ" }}>
              <div className="space-y-3">
                <p>Простой и быстрый VPN-клиент Happ для Android.</p>
                <CopyBlock text="Скачать Happ (Google Play) → Импортировать ключ → Подключиться" />
                <p className="text-xs text-muted-foreground mt-2">Split tunneling доступен в настройках приложения</p>
              </div>
            </Accordion>

            <Accordion title={{ num: "03", text: "macOS / Windows / Linux — Happ" }}>
              <div className="space-y-3">
                <p>Универсальный клиент Happ для всех десктопных платформ.</p>
                <CopyBlock text="Скачать Happ для вашей платформы → Импортировать ключ → Подключиться" />
              </div>
            </Accordion>

            <Accordion title={{ num: "04", text: "Роутер — Keenetic / OpenWRT" }}>
              <div className="space-y-3">
                <p>Настройка через Xray-core для роутеров с поддержкой пользовательских пакетов.</p>
                <CopyBlock text="opkg install xray-core → Скопировать конфиг → /etc/xray/config.json → Запустить" />
                <p className="text-xs text-muted-foreground">Конфигурационный файл доступен в Telegram-боте по команде /router</p>
              </div>
            </Accordion>
          </div>
        </div>
      </section>

      {/* ═══ FAQ ═══ */}
      <section id="faq" className="px-4 sm:px-6 py-24 bg-surface border-y border-border">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-primary">/ FAQ</span>
            <h2 className="mt-4 font-display text-4xl sm:text-5xl md:text-6xl uppercase tracking-tighter">
              Вопросы и ответы
            </h2>
          </div>

          <div className="border-t border-border">
            {faqs.map((f, i) => (
              <Accordion key={i} title={{ num: String(i + 1).padStart(2, "0"), text: f.q }}>
                <p>{f.a}</p>
              </Accordion>
            ))}
          </div>

          <p className="mt-10 text-center text-[11px] uppercase tracking-widest text-muted-foreground">
            Не нашли ответ? Напишите в{" "}
            <a href="https://t.me/nemo_vpn_bot" className="text-primary border-b border-primary pb-0.5">@nemo_vpn_bot</a>{" "}
            — отвечаем в течение 5 минут
          </p>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="px-4 sm:px-6 py-12 border-t border-border">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
          <div className="md:col-span-5">
            <div className="font-display text-3xl uppercase tracking-tighter">
              Nemo<span className="text-primary">.</span>VPN
            </div>
            <div className="mt-2 text-[10px] text-muted-foreground uppercase tracking-[0.2em]">
              Основан 2024 / Создано для свободы
            </div>
            <p className="mt-6 text-sm text-muted-foreground max-w-sm">
              Stealth-туннель для тех, кому нужен интернет без границ. Без логов, без рекламы, без компромиссов.
            </p>
          </div>
          <div className="md:col-span-3">
            <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-4">Продукт</div>
            <ul className="space-y-2 text-sm">
              <li><a href="#pricing" className="hover:text-primary transition-colors">Тарифы</a></li>
              <li><a href="#setup" className="hover:text-primary transition-colors">Инструкции</a></li>
              <li><a href="#faq" className="hover:text-primary transition-colors">FAQ</a></li>
            </ul>
          </div>
          <div className="md:col-span-2">
            <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-4">Контакт</div>
            <ul className="space-y-2 text-sm">
              <li><a href="https://t.me/nemo_vpn_bot" className="text-primary border-b border-primary pb-0.5">@nemo_vpn_bot</a></li>
            </ul>
          </div>
          <div className="md:col-span-2 text-right">
            <div className="text-[10px] text-primary font-mono">СИГНАЛ_100%</div>
            <div className="text-[10px] text-muted-foreground font-mono mt-1">БЕЗ_СЛЕДОВ</div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-border flex flex-col md:flex-row justify-between gap-3 text-[10px] uppercase tracking-widest text-muted-foreground">
          <div>© 2024–2026 NEMO Networks // Без логов · Без следов · Без компромиссов</div>
        </div>
      </footer>
    </div>
  );
}
