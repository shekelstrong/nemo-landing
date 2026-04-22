import { useState } from "react";
import {
  Shield, Zap, Smartphone, Globe, ChevronDown, ChevronUp,
  Mail, CreditCard, Send, ExternalLink, Terminal, Lock,
  Monitor, Apple, Smartphone as Android, Server
} from "lucide-react";

/* ───── helpers ───── */
function Accordion({ title, children }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-zinc-800 rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-zinc-800/50 transition"
      >
        <span className="font-medium">{title}</span>
        {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </button>
      {open && <div className="px-5 pb-5 text-zinc-400 leading-relaxed">{children}</div>}
    </div>
  );
}

function CopyBlock({ text }) {
  const [copied, setCopied] = useState(false);
  const copy = () => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  return (
    <div className="relative bg-zinc-900 rounded p-3 mt-2 text-sm font-mono text-green-400 border border-zinc-700">
      <button onClick={copy} className="absolute top-2 right-2 text-xs text-zinc-500 hover:text-zinc-300">Копировать</button>
      <pre className="whitespace-pre-wrap pr-20">{text}</pre>
      {copied && <span className="absolute top-2 right-20 text-xs text-blue-400">Скопировано!</span>}
    </div>
  );
}

/* ───── data ───── */
const plans = [
  { name: "Basic", price: "500 ₽", period: "/мес", traffic: "50 ГБ", devices: "2 устройства" },
  { name: "Pro", price: "900 ₽", period: "/мес", traffic: "150 ГБ", devices: "5 устройств", popular: true },
  { name: "Ultimate", price: "1 500 ₽", period: "/мес", traffic: "Безлимит", devices: "10 устройств" },
];

const features = [
  { icon: Shield, title: "Обход РКН", desc: "Доступ к заблокированным ресурсам без ограничений" },
  { icon: Zap, title: "Авто-маршрутизация", desc: "Российские сайты работают напрямую, заблокированные — через VPN" },
  { icon: Smartphone, title: "iOS Per-App VPN", desc: "VPN только для выбранных приложений" },
  { icon: Globe, title: "Резидентские IP", desc: "Чистые IP-адреса, не детектируемые как VPN" },
];

const instructions = [
  {
    icon: Apple, title: "iOS / iPadOS",
    content: (
      <>
        <p>Автоматическое переключение VPN для российских и заблокированных сервисов.</p>
        <CopyBlock text="Скачать Streisand из TestFlight → Открыть ссылку-ключ → Готово" />
        <p className="mt-3 text-xs text-zinc-500">Видео-инструкция скоро будет доступна</p>
        <div className="mt-2 bg-zinc-800 rounded-lg h-48 flex items-center justify-center text-zinc-600 text-sm">
          <Monitor size={32} className="mr-2" /> Видео-заглушка
        </div>
        <p className="mt-3 font-medium text-zinc-300">Per-App VPN настройка:</p>
        <p className="text-sm">Настройки → VPN → Streisand → (i) → «Использовать VPN для» → выберите приложения</p>
      </>
    ),
  },
  {
    icon: Android, title: "Android",
    content: (
      <>
        <p>VLESS Reality + автоматическая маршрутизация через v2rayNG или NekoBox.</p>
        <CopyBlock text="Скачать v2rayNG → Скопировать ссылку-ключ → Импорт из буфера → Подключиться" />
      </>
    ),
  },
  {
    icon: Monitor, title: "macOS / Windows",
    content: (
      <>
        <p>Используйте клиент v2rayN (Windows) или Streisand/FoXray (macOS).</p>
        <CopyBlock text="Скопировать ссылку-ключ → Импорт → Подключиться" />
      </>
    ),
  },
  {
    icon: Server, title: "Linux",
    content: (
      <>
        <p>Настройка через xray-core с конфигурационным файлом.</p>
        <CopyBlock text={`xray run -c /etc/xray/config.json\n# Конфиг будет отправлен на ваш email`} />
      </>
    ),
  },
];

const faqData = [
  { cat: "Общие", items: [
    { q: "Что такое VLESS Reality?", a: "Современный протокол VPN, который маскирует трафик под обычный HTTPS. РКН не может его обнаружить и заблокировать." },
    { q: "Какие устройства поддерживаются?", a: "iOS, Android, macOS, Windows, Linux. До 10 устройств одновременно на тарифе Ultimate." },
  ]},
  { cat: "Оплата", items: [
    { q: "Как оплатить подписку?", a: "Через Telegram-бот. Выбираете тариф, оплачиваете картой или криптовалютой, ключи приходят на email." },
    { q: "Есть ли возврат?", a: "Да, в течение 24 часов с момента покупки, если не использовали более 1 ГБ трафика." },
  ]},
  { cat: "Настройка", items: [
    { q: "Сложно ли настроить?", a: "Нет — достаточно скопировать одну ссылку-ключ в приложение. На iOS работает автоматически через Streisand." },
  ]},
  { cat: "Технические", items: [
    { q: "Логируется ли трафик?", a: "Нет. Мы не храним логи подключений. Ваша приватность — наш приоритет." },
    { q: "Какая скорость?", a: "Ограничена только вашим тарифом. Протокол VLESS Reality даёт минимальные задержки." },
  ]},
];

/* ───── page ───── */
export default function Home() {
  const [selectedPlan, setSelectedPlan] = useState(1);
  const [email, setEmail] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [activeFaqCat, setActiveFaqCat] = useState("Общие");

  const handlePay = (e) => {
    e.preventDefault();
    setShowModal(true);
  };

  return (
    <div className="min-h-screen bg-[#18181b] text-zinc-200">
      {/* ── HERO ── */}
      <section className="relative overflow-hidden">
        {/* Matrix-like bg dots */}
        <div className="absolute inset-0 opacity-5" style={{backgroundImage:"radial-gradient(circle,#3b82f6 1px,transparent 1px)",backgroundSize:"24px 24px"}} />

        <div className="relative max-w-5xl mx-auto px-4 pt-24 pb-20 text-center">
          <div className="inline-flex items-center gap-2 bg-zinc-800/60 border border-zinc-700 rounded-full px-4 py-1.5 text-sm mb-8">
            <Lock size={14} className="text-blue-400" />
            <span>VLESS Reality Protocol</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight mb-6">
            NEMO VPN —{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">
              свобода без границ
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-zinc-400 max-w-2xl mx-auto mb-10">
            Обход РКН, белых списков платформ. Автоматическая маршрутизация. VLESS&nbsp;Reality.
          </p>

          <a href="#pricing" className="glow-btn inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-8 py-4 rounded-xl transition text-lg">
            Получить доступ <Send size={18} />
          </a>

          {/* Features grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-20">
            {features.map((f) => (
              <div key={f.title} className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-6 text-left hover:border-blue-600/40 transition">
                <f.icon className="text-blue-400 mb-3" size={28} />
                <h3 className="font-semibold mb-1">{f.title}</h3>
                <p className="text-sm text-zinc-500">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" className="max-w-5xl mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">Тарифы</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {plans.map((p, i) => (
            <button
              key={p.name}
              onClick={() => setSelectedPlan(i)}
              className={`relative rounded-xl p-6 text-left border transition ${
                selectedPlan === i
                  ? "border-blue-500 bg-zinc-900 shadow-lg shadow-blue-500/10"
                  : "border-zinc-800 bg-zinc-900/50 hover:border-zinc-700"
              }`}
            >
              {p.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-xs px-3 py-1 rounded-full font-medium">Популярный</span>
              )}
              <h3 className="text-xl font-bold">{p.name}</h3>
              <p className="mt-2 text-3xl font-bold text-blue-400">
                {p.price}<span className="text-base text-zinc-500 font-normal">{p.period}</span>
              </p>
              <ul className="mt-4 space-y-2 text-sm text-zinc-400">
                <li>✓ {p.traffic}</li>
                <li>✓ {p.devices}</li>
                <li>✓ VLESS Reality</li>
                <li>✓ Авто-маршрутизация</li>
              </ul>
            </button>
          ))}
        </div>

        {/* Order form */}
        <form onSubmit={handlePay} className="max-w-md mx-auto flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
            <input
              type="email"
              required
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:border-blue-500 transition text-sm"
            />
          </div>
          <button type="submit" className="glow-btn flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6 py-3 rounded-lg transition">
            <CreditCard size={18} /> Оплатить
          </button>
        </form>
        <p className="text-center text-xs text-zinc-600 mt-3">
          Выбран: {plans[selectedPlan].name} ({plans[selectedPlan].price}/мес)
        </p>
      </section>

      {/* ── INSTRUCTIONS ── */}
      <section className="max-w-3xl mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center mb-4">Инструкции</h2>
        <p className="text-center text-zinc-500 mb-10">Настройка за 2 минуты на любом устройстве</p>
        <div className="space-y-3">
          {instructions.map((inst) => (
            <Accordion key={inst.title} title={
              <span className="flex items-center gap-3">
                <inst.icon size={20} className="text-blue-400" /> {inst.title}
              </span>
            }>
              {inst.content}
            </Accordion>
          ))}
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="max-w-3xl mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center mb-4">FAQ</h2>
        <p className="text-center text-zinc-500 mb-8">Часто задаваемые вопросы</p>

        <div className="flex gap-2 flex-wrap justify-center mb-8">
          {faqData.map((c) => (
            <button
              key={c.cat}
              onClick={() => setActiveFaqCat(c.cat)}
              className={`px-4 py-1.5 rounded-full text-sm border transition ${
                activeFaqCat === c.cat ? "bg-blue-600 border-blue-600 text-white" : "border-zinc-700 text-zinc-400 hover:border-zinc-500"
              }`}
            >
              {c.cat}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {faqData.filter((c) => c.cat === activeFaqCat)[0].items.map((item) => (
            <Accordion key={item.q} title={item.q}>
              <p>{item.a}</p>
            </Accordion>
          ))}
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-zinc-800 py-10">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-zinc-500">© 2026 NEMO VPN</p>
          <div className="flex gap-6 text-sm text-zinc-500">
            <a href="https://t.me/nemovpn_bot" target="_blank" rel="noreferrer" className="hover:text-blue-400 transition flex items-center gap-1">
              <Send size={14} /> Telegram
            </a>
            <a href="#" className="hover:text-blue-400 transition flex items-center gap-1">
              <ExternalLink size={14} /> GitHub
            </a>
            <a href="#" className="hover:text-blue-400 transition flex items-center gap-1">
              <ExternalLink size={14} /> VK
            </a>
          </div>
        </div>
      </footer>

      {/* ── MODAL ── */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
          <div className="bg-zinc-900 border border-zinc-700 rounded-2xl p-8 max-w-sm w-full text-center" onClick={(e) => e.stopPropagation()}>
            <div className="text-5xl mb-4">🚧</div>
            <h3 className="text-xl font-bold mb-2">В разработке</h3>
            <p className="text-zinc-400 text-sm mb-6">
              Интеграция с платёжной системой и Telegram-ботом скоро будет доступна. Следите за обновлениями!
            </p>
            <button onClick={() => setShowModal(false)} className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg transition">
              Понятно
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
