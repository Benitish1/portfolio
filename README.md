# Benitha Ishimwe — Portfolio

Personal portfolio of **Benitha Ishimwe**, a Full-Stack Developer and Mobile Application Developer and a graduate of **Rwanda Coding Academy** (Software Programming and Embedded Systems, 2023 – July 2026).

## What's on the site

| Section | Contents |
|---|---|
| Hero | Name, role, short intro, GitHub / CV / projects buttons, TWatch phone preview |
| Mobile | TWatch (React Native + Expo) spotlight, plus ShopEase, Mobile Notifications and ATELIER |
| Projects | SafeGuard FEMS, LuxeStay, Vehicle Analytics System, RentEase, Face Recognition & IoT Lock |
| Skills | Mobile, Frontend, Backend, Databases, Tools, Embedded & AI |
| About | Background and education at Rwanda Coding Academy |
| GitHub | Live list of recently updated public repositories (GitHub REST API, with loading and error states) |
| Contact | Email, phone, GitHub, and a form that opens the visitor's email app |

## Tech

It's a static site with no build step and no dependencies:

- `index.html`: all page content
- `css/portfolio.css`: styles, with a dark theme (default) and a light theme
- `js/portfolio.js`: theme toggle, mobile menu, scroll reveal, GitHub feed, contact form
- `images/projects/`: screenshots captured from the live LuxeStay and Vehicle Analytics deployments
- `images/profile.jpg`: portrait

Fonts (Inter, JetBrains Mono) load from Google Fonts. Icons are inline SVG.

> The `css/vendor`, `js/vendor`, `light/` and other template files are from the previous version of the site. The new page doesn't use them, and they can be deleted.

## Run locally

Any static file server works. From this folder:

```bash
# Python
python -m http.server 5500

# or Node
npx serve .
```

Then open http://localhost:5500.

(Opening `index.html` directly also works, but the GitHub feed and some browser features behave better over `http://`.)

## Deploy

### Vercel (current host)

1. Push to the `main` branch of https://github.com/Benitish1/portfolio.
2. In Vercel, import the repo with **Framework preset: Other**, no build command, and output directory `./`.
3. Every push to `main` redeploys automatically.

Or from the CLI:

```bash
npm i -g vercel
vercel --prod
```
