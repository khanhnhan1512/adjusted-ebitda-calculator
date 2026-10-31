# Adjusted EBITDA Calculator — Aspen Valuations

Works out a business's Adjusted EBITDA and Adjusted EBITDA margin from its
income statement. Replaces the earlier Base44 app at
`adjusted-ebitda-calculator-0a5c0e0a.base44.app`, and is linked from step 1 of
the [Business Valuation Calculator](https://github.com/khanhnhan1512/business-valuation-calculator)
for owners who do not have an EBITDA figure to hand.

All calculation happens in the browser and updates as you type. No contact
details are collected.

## Calculation

```
EBITDA          = net income + interest + taxes + depreciation + amortization

Adjusted EBITDA = EBITDA
                  + one-time expenses
                  − one-time income
                  + discretionary expenses
                  ± owner compensation above / below market
                  ± rent above / below market

Margin          = Adjusted EBITDA ÷ revenue
```

The fields, their copy and the formula live in
[`src/lib/ebitda.ts`](src/lib/ebitda.ts).

## Changes from the Base44 version

- **Signed inputs.** Base44 stripped minus signs, so a loss, or owner pay or
  rent below market, could not be entered. Net income now has a Profit / Loss
  switch and the two market adjustments have Above / Below market switches.
- **No lead form.** Base44 required a name, email and owner/advisor role before
  showing the result, and listed submissions on an admin page. This version
  shows the result straight away, matching the valuation calculator.
- **Live result with a breakdown** of every line from net income to Adjusted
  EBITDA, instead of a single total after pressing Calculate.
- **Whole dollars**, formatted the same way as the valuation calculator, with a
  Copy button so the figure pastes straight into it.

## Stack

- Next.js 16 (App Router) + React 19 + TypeScript
- Tailwind CSS v4
- No backend, no environment variables

## Getting started

```bash
npm install
npm run dev     # http://localhost:3000
npm run build
npm run lint
```

## Project structure

```
src/
  app/
    layout.tsx            # fonts, metadata
    page.tsx              # hero, calculator, how it works, formula, CTA
    globals.css           # Aspen brand tokens
  components/
    EbitdaCalculator.tsx  # input groups, direction switches, layout, mobile bar
    EbitdaResults.tsx     # sticky summary (with Copy) and line-by-line breakdown
    SiteHeader.tsx, SiteFooter.tsx, AspenLogo.tsx
  lib/
    ebitda.ts             # fields, formula, formatting
```

## Outstanding items

- **Brand logo** — `public/aspen-logo-white.png` (footer) was recoloured from
  the official PNG; swap in Aspen's own reversed logo, and an SVG of both, if
  available.
- **CBV stamp** — the footer submark is a placeholder; replace with the official
  stamp at `public/cbv-stamp.svg`.
- **Typography** — DIN Next LT Pro is first in the font stack, with Barlow as
  the free web fallback and Arial last. Self-host the licensed files under
  `public/fonts/` to use the real brand face.

## Deployment

Deployed on Vercel with the GitHub integration, so every push to `master`
deploys. No build configuration or environment variables are required.
