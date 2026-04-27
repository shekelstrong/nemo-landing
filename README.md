<div align="center">

# ⚓ NEMO VPN Landing

**Dark-themed one-page landing for [NEMO VPN](https://t.me/nemo_vpn_bot?start=6318513424)**

[![Live](https://img.shields.io/badge/Live-nemo--landing.vercel.app-58a6ff?style=flat-square&logo=vercel&logoColor=white)](https://nemo-landing.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js_14-000000?style=flat-square&logo=nextdotjs&logoColor=white)](https://nextjs.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)

</div>

---

## Overview

Single-page landing for NEMO VPN — a VPN service running on VLESS Reality protocol. Built with brutalist underground aesthetic: dark theme, monospace fonts, minimal color palette.

### Features

- Pricing tiers with toggle (Standard / Premium)
- FAQ accordion sections
- Setup guides with copy-to-clipboard code blocks
- Responsive design (mobile-first)
- SEO meta tags & Open Graph

## Tech Stack

- **Next.js 14** — SSG for fast page loads
- **React 18** — UI components
- **Tailwind CSS 3** — utility-first styling
- **Lucide React** — icon set

## Getting Started

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Build for production
npm run build
```

## Project Structure

```
pages/
  index.js        # Main landing page (all sections)
  _app.js         # App wrapper with global styles
styles/
  globals.css     # Tailwind base + custom theme
```

## Deployment

Deployed on [Vercel](https://vercel.com) — pushes to `main` auto-deploy.

## License

MIT
