# NEMO VPN Landing

One-page site for selling VPN subscriptions. Dark theme, VLESS Reality branding.

## Quick Start

```bash
npm install
npm run dev
# → http://localhost:3000
```

## Deploy to Vercel

```bash
npx vercel
```

Or connect the GitHub repo to Vercel dashboard — zero config needed.

## Structure

```
nemo-landing/
├── package.json
├── next.config.js
├── tailwind.config.js
├── postcss.config.js
├── styles/
│   └── globals.css
├── pages/
│   ├── _app.js
│   ├── index.js          ← Main page (all sections)
│   └── api/
│       └── send-keys.js  ← Stub API endpoint
└── README.md
```

## Customization

- **Colors:** edit `tailwind.config.js` and `globals.css`
- **Plans/prices:** edit the `plans` array in `pages/index.js`
- **FAQ:** edit the `faqData` array
- **Telegram bot link:** update the footer `<a href="https://t.me/...">`
- **Payment integration:** replace `setShowModal(true)` in `handlePay` with actual API call
