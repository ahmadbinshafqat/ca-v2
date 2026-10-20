# Coders Alley

Landing page for Coders Alley, built with Next.js (App Router) and TypeScript.

## Run it

```
npm install
npm run dev        # http://localhost:3000
npm run build      # production build (also type-checks)
npm start          # serve the production build
```

## Where things live

- `app/page.tsx`: page layout (nav, hero, services, contact, footer)
- `app/globals.css`: all styles; fonts come from `next/font` in `app/layout.tsx`
- `lib/content.ts`: copy and data (chapters, services, ticker, workflow example, form options)
- `components/Film.tsx` + `components/filmRenderer.ts`: the scroll-driven canvas hero
- `components/ProjectModal.tsx`: the "Start a project" form
- `app/icon.svg`: browser tab icon (the logo mark)

## Project requests

The project form emails each request to hr@codersalley.com through FormSubmit
(formsubmit.co). The first submission triggers an activation email to that inbox;
click the link in it once, or requests won't be delivered.

`legacy/index.html` is the original single-file version, kept for reference.
