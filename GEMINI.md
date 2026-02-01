# Project Overview: 24to12converter.com

This project is a high-performance, SEO-optimized utility website for time conversion, specifically between 24-hour, 12-hour (AM/PM), and military time formats. It is built as a static site with a focus on speed, accessibility, and broad reach through localization and granular SEO pages.

## Tech Stack
- **Frontend:** HTML5, Vanilla JavaScript.
- **Styling:** Tailwind CSS v4 (Alpha/Beta CLI version).
- **Icons:** Lucide SVG icons (embedded in JS/HTML).
- **Backend/Build:** Node.js for static site generation and asset compilation.

## Project Structure
- `/`: Main English tool (12h to 24h).
- `/military-time-converter/`: Dedicated military time tool (4-digit input).
- `/time-chart/`: Static conversion chart.
- `/time/HH-MM/`: 24 generated SEO pages for each hour of the day (e.g., `/time/18-00/`).
- `/[lang]/`: Localized versions of the above tools (supported: `de`, `es`, `fr`, `it`, `ja`, `ko`, `pt`, `zh-tw`).
- `src/input.css`: Tailwind v4 source entry point.
- `dist/app.css`: Compiled and minified production CSS.
- `script.js`: Core client-side logic for conversion, input masking, and UI interactions.

## Key Build & Maintenance Commands
- **CSS Compilation:** `npm run build:css`
  - Runs: `npx @tailwindcss/cli -i ./src/input.css -o ./dist/app.css --minify`
- **SEO Page Generation:** `node generate_time_pages.js`
  - Generates the `/time/` directory content using `index.html` as a template.
- **Multilingual Generation:** `node generate_multilingual_pages.js` (Inferred)
  - Synchronizes localized versions of tools.
- **Sitemap Updates:** `node update_sitemap.js` and `node update_sitemap_multilingual.js`.
- **Linting:** `npx htmlhint **/*.html`.

## Development Conventions
- **Tailwind v4:** Note that this project uses Tailwind CSS v4. Standard v3 `tailwind.config.js` does not exist; configuration is done via CSS `@theme` blocks or JS plugins if necessary (though currently minimalist).
- **Static First:** Content is kept as static HTML where possible. Interactive elements use vanilla JS to minimize dependencies and maximize performance.
- **SEO Focus:** Granular page generation for specific search queries (e.g., "what is 18:00 in military time") is a core growth strategy.
- **Accessibility:** Ensure Lucide icons have proper ARIA labels and focus states are maintained.
- **Consistency:** When adding features to the root `index.html`, ensure they are propagated to localized folders and the `/time/` template via the generation scripts.
