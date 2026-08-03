# RISE — Artist Development Platform

A multi-page static website for RISE, an artist development platform for electronic music creators. Built for Netlify deployment.

## Quick Start

### Local Use
- **macOS:** Double-click `start.command`
- **Windows:** Double-click `start.bat`
- **Manual:** Open `index.html` directly in Chrome

### Netlify Deployment
1. Go to [app.netlify.com](https://app.netlify.com)
2. Click "Add new site" → "Deploy manually"
3. Drag the **contents** of the `rise-dashboard` folder (not the folder itself)
4. Wait for deployment → optionally set a custom domain

---

## Site Structure

```
rise-dashboard/
├── index.html                          Main landing page
├── styles.css                          Main site styles
├── customer-styles.css                 Customer pages styles
├── config.js                           Configuration (payments, codes, content)
├── app.js                              Main page logic
├── assets/
│   ├── logo.png                        RISE logo
│   ├── logo.jpg / logo-data.js         Logo for PDF embedding
│   └── photos/                         Event photos (photo-1 through photo-5)
├── libs/
│   └── pdf-generator.js                Custom PDF generator
├── customers/
│   ├── index.html                      Customer portal (4 products)
│   ├── course/
│   │   ├── index.html                  Code entry
│   │   └── access/index.html           Personalized landing page
│   ├── platform/
│   │   ├── index.html                  Code entry
│   │   └── access/index.html           Personalized landing page
│   ├── community/
│   │   ├── index.html                  Code entry
│   │   └── access/index.html           Personalized landing page
│   └── coaching/
│       ├── index.html                  Code entry
│       └── access/index.html           Personalized landing page
├── terms/index.html                    Terms & Conditions
├── privacy/index.html                  Privacy Policy
└── README.md
```

## Customer Flow

1. Visitor lands on main page → clicks **Customers** button (top-right)
2. Customer Portal shows 4 products → clicks **Open Access**
3. Code Entry page → enters valid access code → Continue
4. Personalized Landing Page → reads offer → clicks payment button → Stripe checkout

---

## Configuration (config.js)

### Access Codes

```js
courseAccessCodes: ['RISE-COURSE-2026', 'COURSE-ACCESS'],
platformAccessCodes: ['RISE-PLATFORM-2026', 'PLATFORM-ACCESS'],
communityAccessCodes: ['RISE-COMMUNITY-2026', 'COMMUNITY-ACCESS'],
coachingAccessCodes: ['RISE-COACHING-2026', 'COACHING-ACCESS'],
```

Codes are case-insensitive. Add or remove as needed.

### Payment Links

```js
coursePaymentUrl: 'https://buy.stripe.com/...',
platformPaymentUrl: '',
communityPaymentUrl: 'https://buy.stripe.com/...',
coachingPaymentUrl: 'https://buy.stripe.com/...',
```

Leave empty to show "Payment link not set yet."

### Images

Hero backgrounds on personalized pages:
- Course → `photo-2.jpg`
- Platform → `photo-1.jpg`
- Community → `photo-3.jpg`
- Coaching → `photo-4.jpg`

Replace files in `assets/photos/` to update.

### Customer Page Content

Edit directly in `customers/[product]/access/index.html`. Sections: Hero, What You Get, What Happens Next, What to Expect, Why This Matters, CTA.

---

## Brand Palette

| Color | Hex | Usage |
|-------|-----|-------|
| Orange | #fd562a | Primary accent |
| Dark | #1e1e1e | Surface backgrounds |
| Deep | #7f1900 | Deep accent |
| Gray | #a6a6a6 | Secondary text |
| White | #ffffff | Primary text |

---

## Logo & PDF

Upload a logo via the branding panel on the main page. It persists in localStorage and appears on all generated PDFs. A bundled logo is included as fallback.

---

## Offline Use

Everything works offline except payment buttons (they open external Stripe checkout links).
