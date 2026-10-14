# LATS Black Cars: website

Redesign of ltsblackcars.com for Lammi Airport Transportation Service (LATS), Columbus, Ohio.

React 19 · TypeScript · Vite · Tailwind CSS 4 · Framer Motion · React Router.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # type-checks, then builds to dist/
npm run preview    # serves the production build
```

## Pages

| Route       | Purpose                                                                          |
| ----------- | -------------------------------------------------------------------------------- |
| `/`         | Home: promise, services carousel, arrival story, fleet viewer, owner, reservation |
| `/services` | Six services, pricing and policies (accordion)                                   |
| `/fleet`    | The Chevrolet Suburban: interactive hotspots, features, seating planner          |
| `/about`    | Owner story, languages, regions served, contact form                             |
| `/book`     | Three-step reservation form with a live preview of the chauffeur's name sign     |

`/book?service=airport` and `/book?riders=4` pre-fill the form (the Services and Fleet pages link this way).

## Before it goes live

1. **Deliver the forms.** Create a free form endpoint (Formspree, Web3Forms, Getform) that forwards to the
   owner's inbox, then copy `.env.example` to `.env` and set `VITE_FORM_ENDPOINT`. Without it, the reservation
   and contact forms fall back to a pre-filled text message to 614-483-5876 and say so plainly. Nothing is
   silently dropped, but nothing reaches an inbox either.
2. **Review the copy.** Facts (phone, address, owner story, services, rate model, wait-time and cleaning
   policies, vehicle features) come from the existing site. Headlines, descriptions and feature wording are new.
3. **Replace the stock photography.** The skyline, airport, conference, wedding and office images come from
   the existing site. Real photos of the LATS vehicles and chauffeurs would lift the site further.
   Add them under `public/images/` and update `src/data/site.ts`.

## Where things live

- `src/data/site.ts`: business details, services, policies, nav. Edit content here.
- `src/index.css`: palette (black, white, the site's forest green `#2b5336`) and the type scale (Albert Sans).
- `src/components/Logo.tsx`: the LATS mark (an L drawn as a road) and wordmark.
- `src/components/Intro.tsx`: the loading screen. It tracks fonts and page assets, and holds each page's
  entrance animations until it lifts (`src/lib/motion.ts`).
- `src/components/Placard.tsx`: the chauffeur's name sign, used on Home and the reservation form.
- Motion respects `prefers-reduced-motion`.
