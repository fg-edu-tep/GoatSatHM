# GOATSat — Assets Needed to Finish the Website

> All items below are **missing** from the current implementation.
> Items already handled via CSS/SVG/CDN are noted as resolved.

---

## 🔴 REQUIRED — Must have before launch

### 1. `favicon.ico` + `favicon.svg`
- **What:** Browser tab icon — the "GS" badge from the nav, rendered as a 32×32 and 180×180 icon
- **Spec:** Dark background (`#03060f`), blue gradient letters "GS" or satellite silhouette
- **Tool:** [Favicon.io](https://favicon.io) or Figma export
- **Files needed:**
  - `/favicon.ico` (16×16, 32×32)
  - `/favicon.svg` (scalable)
  - `/apple-touch-icon.png` (180×180)

### 2. `og-image.jpg` — Open Graph / Social Share Card
- **What:** 1200×630px preview card for LinkedIn / Twitter / WhatsApp when sharing `goatsat.co`
- **Spec:** Dark background, GOATSat logo, tagline "Don't replace. Upgrade in space.", key KPIs (NPV $194.7M, IRR 76.8%)
- **Tool:** Figma, Canva, or a Vercel OG generation endpoint

### 3. GOATSat Logo — Full Wordmark (SVG)
- **What:** `logo.svg` — the full "GOATSat" wordmark with the orbital ring motif
- **Spec:** Two variants — white for dark mode, dark navy for light mode
- **Currently:** Replaced by inline CSS "GS" badge. A proper logo file is needed for:
  - `<meta property="og:image">`
  - Footer brand mark
  - PDF exports / whitepaper cover

---

## 🟡 RECOMMENDED — Significantly improves quality

### 4. Hero Background — Earth/Orbit Image
- **What:** High-resolution Earth-from-orbit photograph for the hero section background (currently using CSS starfield only)
- **Free source options:**
  - NASA Scientific Visualization Studio: https://svs.gsfc.nasa.gov
  - NASA Earth Observatory: https://earthobservatory.nasa.gov/images
  - Suggested image: NASA's "Blue Marble" 21600×10800px (public domain)
  - Specific URL: https://visibleearth.nasa.gov/images/57752/blue-marble-land-surface-shallow-water-and-shaded-topography
- **Usage:** CSS `background-image`, 20–30% opacity overlay behind hero text
- **File:** `/assets/earth-hero.jpg` (compress to ≤ 800KB for web)

### 5. Satellite Technical Illustration — Mechanical Explosion Drawing
- **What:** An exploded-view line drawing of the GOATSat docking interface showing M-Layer components
- **Used in:** The Standard section (bento wide card), Mechanical drawer
- **Free source options:**
  - NASA 3D Resources (STL/OBJ models, public domain): https://nasa3d.arc.nasa.gov/models
  - Render in Blender (free) from the GOAT-Sat v0.1 paper diagrams
  - Convert Fig. 1 (block diagram from the iLCSS paper PDF) into a clean SVG illustration
- **File:** `/assets/sat-exploded.svg` or `/assets/sat-exploded.png` (2x @800px width)

### 6. Action Plan Timeline Image (from slides)
- **What:** The "Action Plan" infographic from Image 1 (Year 1–Year 6-10 timeline)
- **Status:** Exists as uploaded PNG but needs to be exported at 2× resolution and saved as `/assets/action-plan.png`
- **Usage:** Could be embedded in the Financial Roadmap section or Phase Timeline area

### 7. Market Opportunity Chart (from slides)
- **What:** The "Capturing the In-Orbit Maintenance Opportunity" slide from Image 2 (TAM/SAM/SOM + replenishment cost chart)
- **Status:** Exists as uploaded PNG — needs `/assets/market-opportunity.png`
- **Usage:** Problem section or a dedicated Market slide between Problem and Standard

---

## 🟢 ALREADY RESOLVED (no asset file needed)

| Item | How it's handled |
|---|---|
| Starfield background | CSS canvas animation (pure JS) |
| Satellite SVG illustration | Inline SVG in `<section id="hero">` |
| Colombian flag icon | CSS-only tricolor `<div>` in nav |
| Colombian condor | Unicode emoji `🦅` in footer |
| FCF Waterfall Chart | Chart.js via CDN (no image needed) |
| Orbital ring animations | CSS keyframe animations |
| All icons (bento cards) | Unicode emoji (⚙️ ⚡ 🧩 etc.) |
| Fonts | Google Fonts CDN (Syne + IBM Plex Sans + IBM Plex Mono) |
| Chart.js library | CDN: `cdn.jsdelivr.net/npm/chart.js@4.4.0` |

---

## 📁 Recommended `/assets/` folder structure

```
/
├── index.html
├── favicon.ico
├── favicon.svg
├── apple-touch-icon.png
├── assets/
│   ├── og-image.jpg          ← social share card
│   ├── earth-hero.jpg        ← NASA Blue Marble (compressed)
│   ├── sat-exploded.svg      ← mechanical explosion drawing
│   ├── action-plan.png       ← from slides (2x)
│   ├── market-opportunity.png ← from slides (2x)
│   └── logo.svg              ← wordmark (light + dark variants)
└── ASSETS_NEEDED.md
```

---

## 🔧 Vercel deployment notes

- All paths are relative — no build step required (pure static HTML)
- Add `vercel.json` for headers:
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-Content-Type-Options", "value": "nosniff" }
      ]
    }
  ]
}
```
- Recommended: enable Vercel Analytics (one-line script) for investor visit tracking
