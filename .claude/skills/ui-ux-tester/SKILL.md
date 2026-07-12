---
name: ui-ux-tester
description: Visual and usability QA — audits theme consistency, responsive layout, accessibility, interactive states, and design system compliance. Read-only (never modifies source code).
---

# /ui-ux-tester — Visual & Usability Quality Audit (Read-Only)

> **Role:** Act as a strict UI/UX Quality Inspector for the YoeYarZay E-commerce App
> (Next.js 16, plain CSS — no Tailwind). Your job is to **discover and record** visual, design, and
> usability issues — **NEVER fix code directly.** All findings go to the report file for
> `/code-fix` to consume.
>
> **Parent Rules:** [AGENTS.md](../../../AGENTS.md)
> **Guardrails:** [architecture-guardrails/SKILL.md](../architecture-guardrails/SKILL.md)

---

## [STRICT CONSTRAINT: READ-ONLY]

⛔ **DO NOT** modify any source code, CSS, or configuration files.
✅ **DO** inspect code, open the browser (with permission), take screenshots, and **record all findings** to the report file.

---

> **Fastest path — run the static audit script first** to front-load every greppable check
> (hardcoded colors, inline styles, inline fontSize, clickable `<div>`, `<img>` without alt,
> dark-mode coverage). Read-only; combine its output with the browser check (Step 8):
>
> ```bash
> bash .agents/skills/ui-ux-tester/scripts/run_ui_audit.sh
> ```
> ```powershell
> powershell -File .agents/skills/ui-ux-tester/scripts/run_ui_audit.ps1   # Windows (primary shell)
> ```

---

## Step 1: Design System & Theme Consistency Audit

### This project's theme tokens (the CORRECT way — do NOT flag these)
This project has **no Tailwind**. Theming is plain CSS classes backed by CSS custom
properties defined in [globals.css](../../../src/app/globals.css):

| Token (CSS var) | Meaning |
|---|---|
| `--color-bg`, `--color-bg-secondary`, `--color-surface` | surface/background colors |
| `--color-text`, `--color-text-secondary` | foreground text |
| `--color-border`, `--color-border-light` | border colors |
| `--color-primary`, `--color-primary-light`, `--color-primary-dark`, `--color-primary-ghost` | brand blue `#2563eb` |
| `--color-success`, `--color-warning`, `--color-danger`, `--color-danger-light` | semantic status colors |

A **violation** is a raw `#hex` / `rgb()` / `hsl()` literal (in a `.tsx` file or a *new* CSS rule
outside `globals.css`'s own token definitions) where one of the `var(--color-*)` tokens above
should be used instead.

### Theme Compliance
Scan all `src/**/*.{ts,tsx}` files for violations:

| Check | How to detect | Severity |
|---|---|---|
| **Hardcoded colors** | Search for `#[0-9a-f]`, `rgb(`, `hsl(` inside `.tsx`/inline styles that should be a `var(--color-*)` token or existing CSS class | High |
| **Hardcoded font sizes** | Search for inline `fontSize:` instead of an existing CSS class | Normal |
| **Hardcoded spacing** | Search for inline `margin:`/`padding:` pixel values instead of an existing CSS class | Normal |
| **Inline styles** | Search for `style={{` in TSX — flag when an existing CSS class in `globals.css` already covers it | Normal |
| **Inconsistent color usage** | Same semantic meaning (e.g., "success", "danger") using different colors across components instead of the shared token | High |

### Dark/Light Mode
- Check that new color rules live under `[data-theme="dark"]` (or the `prefers-color-scheme`
  media query) in `globals.css` alongside their light-mode counterpart, not just one side
- Identify components that render incorrectly in dark mode (missing dark-mode override)

### Typography
- Verify font family consistency (Google Fonts like Inter/Roboto vs browser defaults)
- Check heading hierarchy (`h1` > `h2` > `h3` — proper nesting, single `h1` per page)

---

## Step 2: Responsive Layout Audit

### Breakpoint Coverage
Check that key pages handle these viewport widths:

| Breakpoint | Width | What to check |
|---|---|---|
| `sm` | 640px | Mobile layout — sidebar collapsed, stacked layouts |
| `md` | 768px | Tablet — adjusted grid columns |
| `lg` | 1024px | Desktop — full layout |
| `xl` | 1280px | Wide screen — no excessive whitespace |

### Common Issues to Flag
- Horizontal overflow (content wider than viewport)
- Text truncation without `title` attribute or tooltip
- Images/tables not responsive (fixed widths)
- Sidebar/navigation unusable on mobile
- Touch targets too small for mobile (< 44px)

---

## Step 3: Component Reuse & Consistency Audit

### Shared Components Check
- Read `src/components/` to understand available shared components
- Scan feature pages for **duplicate UI patterns** that should use shared components:
  - Multiple button styles that should be one `Button` component
  - Repeated modal patterns that should use a shared `Modal`
  - Duplicate loading spinners, error messages, empty states

### Naming & Structure
- Component file names follow PascalCase convention
- Props are destructured consistently
- Components are focused (single visual responsibility)

---

## Step 4: Interactive States Audit

For each interactive element (buttons, inputs, links, cards), verify these states exist:

| State | What to check |
|---|---|
| **Default** | Base appearance is clear and intentional |
| **Hover** | Visual feedback on mouse hover (`:hover` CSS rule) |
| **Focus** | Keyboard focus ring visible (`:focus`, `:focus-visible`) |
| **Active/Pressed** | Click feedback (`:active` CSS rule) |
| **Disabled** | Grayed out + `cursor-not-allowed` + non-interactive |
| **Loading** | Spinner or skeleton while async operation runs |
| **Error** | Red border/text for validation errors, error messages |
| **Empty** | Empty state message when no data (not just blank space) |

Priority pages to check:
- `/products`, `/products/[id]` (catalog, product detail)
- `/cart`, `/checkout` (cart line items, checkout form)
- `/register`, auth callback (login/signup forms)
- `/admin/products`, `/admin` (category CRUD, admin tables)

---

## Step 5: Animation & Transition Audit

### Smooth Transitions
- Modal open/close — fade + scale or slide animation
- Sidebar expand/collapse — smooth width transition
- Page navigation — no jarring jumps
- Tab switching — smooth content transition
- Loading states — skeleton or spinner, not sudden content pop

### Performance
- No janky animations (check for layout thrashing — animating `width`, `height`, `top`, `left` instead of `transform`, `opacity`)
- `transition` or `animation` CSS properties used (not just instant state changes)

---

## Step 6: Accessibility (a11y) Audit

| Check | How to verify | Severity |
|---|---|---|
| **Semantic HTML** | `<button>` for clicks (not `<div onClick>`), `<nav>`, `<main>`, `<section>` | High |
| **ARIA labels** | Interactive elements have `aria-label` or visible text | High |
| **Alt text** | All `<img>` tags have meaningful `alt` attributes | Normal |
| **Color contrast** | Text meets WCAG AA (4.5:1 for normal text, 3:1 for large text) | High |
| **Keyboard navigation** | Tab order is logical, all features usable without mouse | Normal |
| **Screen reader** | Important content not hidden from assistive technology | Normal |
| **Focus management** | Focus moves logically after modal open/close, page change | Normal |

---

## Step 7: User Flow & UX Logic Audit

### Clarity & Feedback
- **CTAs (Call to Action):** Are primary actions obvious? Is there visual hierarchy between primary/secondary buttons?
- **Error messages:** Are they helpful? Do they tell the user what went wrong AND how to fix it?
- **Success feedback:** After completing an action, does the user get confirmation?
- **Destructive actions:** Are delete/reset actions confirmed with a dialog?
- **Progress indication:** Long operations show progress (not just a spinner)

### Navigation
- Breadcrumbs or back buttons where needed
- Active page highlighted in sidebar/navigation
- Consistent page layout structure across routes

---

## Step 8: Browser Visual Check (Requires Permission)

> ⚠️ **BEFORE launching any browser instance**, you MUST ask the user for explicit permission.
> If denied, skip this step entirely and note it in the report.

If permitted:
1. Start the app — this is a **Next.js** project: run `npm run dev` from the repo root
   (serves on `http://localhost:3000`). There is no bun script.
2. Take screenshots of key pages
3. Resize to different breakpoints and capture responsive behavior
4. Toggle dark/light mode if available
5. Test interactive elements (hover, click, focus)
6. Record any visual bugs with screenshots

---

## Step 9: Categorize & Record Findings

### 🔴 High Priority (ဦးစားပေး — အမြန်ပြင်သင့်)
- Hardcoded colors/styles when theme tokens exist (design system violation)
- Missing semantic HTML (clickable `<div>` instead of `<button>`)
- Color contrast failures (WCAG AA)
- Broken responsive layout (content overflow, unusable on mobile)
- Inconsistent color usage for same semantic meaning

### 🟡 Normal Priority (ပုံမှန် — မပြင်သေးလဲ ဖြစ်)
- Missing hover/focus/disabled states
- Missing empty/loading/error states
- Component duplication (should use shared component)
- Animation/transition improvements
- Typography/spacing inconsistencies
- Alt text missing on images
- Keyboard navigation gaps

### Record Format

Write findings to [`../../reports/ui_ux_tester_records.md`](../../reports/ui_ux_tester_records.md) — **create the file if it does not exist yet** (append new dated sections on later runs):

```markdown
## YYYY-MM-DD — UI/UX Tester Run

### 🔴 High Priority
- [ ] **[AREA]** `file/path.ext:L##` — Description of the issue
  - Evidence: screenshot / code snippet showing the problem
  - Impact: what users experience

### 🟡 Normal Priority
- [ ] **[AREA]** `file/path.ext` — Description of the issue
  - Suggestion: recommended fix approach
```

---

## Step 10: Report Summary

Provide a **bilingual summary** (English + Burmese):
- Total findings count (High / Normal per category)
- Worst offending pages/components
- Overall design system compliance score (approximate %)
- Instruct the user to run `/code-fix` when ready to remediate

---

*Myanmar — အနှစ်ချုပ်:*
*ဒီ skill က project ရဲ့ visual design နဲ့ usability quality ကို စစ်ဆေးပေးတဲ့ UI/UX tester ဖြစ်ပါတယ်။ Theme consistency, responsive layout, component reuse, interactive states, animation, accessibility (a11y), user flow logic — အကုန်စစ်ပြီး findings ကို `.agents/reports/ui_ux_tester_records.md` ထဲ record ထားပေးပါတယ်။ Code ကို ကိုယ်တိုင် **မပြင်ပါ** — ပြင်ဖို့ `/code-fix` ကို ခေါ်ပါ။*
