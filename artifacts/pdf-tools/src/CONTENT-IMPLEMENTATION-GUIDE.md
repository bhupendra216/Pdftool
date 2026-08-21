# PDFKira Phase 2: Content & UX Guide

## New Components

- `src/components/Content/HowToUseSection.jsx` — Step-by-step flow for every tool page
- `src/components/Content/HowToUseSection.module.css` — 3-card responsive styling
- `src/components/Content/RelatedTools.jsx` — Sidebar or bottom related tool cards
- `src/components/Content/RelatedTools.module.css` — related tool card styling
- `src/components/Content/WhyPDFKira.jsx` — reusable trust and value proposition block
- `src/components/Content/WhyPDFKira.module.css` — USP grid styling
- `src/components/Content/FAQSection.jsx` — accessible FAQ section with schema support
- `src/components/Content/FAQSection.module.css` — accordion styling
- `src/components/Content/ToolFeatures.jsx` — highlight cards for tool-specific value
- `src/components/Content/ToolFeatures.module.css` — 2x2 feature cards
- `src/components/Content/UseCases.jsx` — business and personal use case cards
- `src/components/Content/UseCases.module.css` — accent card layout
- `src/components/Content/BlogPreview.jsx` — homepage and category blog preview
- `src/components/Content/BlogPreview.module.css` — blog card styles
- `src/components/Content/StatsBar.jsx` — trust stats strip
- `src/components/Content/StatsBar.module.css` — dark stats bar layout
- `src/components/Content/TestimonialSection.jsx` — customer proof cards
- `src/components/Content/TestimonialSection.module.css` — quote card styling
- `src/components/Content/CTABanner.jsx` — conversion-focused CTA banner
- `src/components/Content/CTABanner.module.css` — button and banner styling
- `src/components/Content/ToolComparisonTable.jsx` — PDFKira vs competitor table
- `src/components/Content/ToolComparisonTable.module.css` — comparison table styling
- `src/components/Content/VideoPlaceholder.jsx` — future video card placeholder
- `src/components/Content/VideoPlaceholder.module.css` — thumbnail and play-button styling
- `src/components/Content/NewsletterSignup.jsx` — email capture form
- `src/components/Content/NewsletterSignup.module.css` — newsletter styling
- `src/components/Content/SocialShare.jsx` — share buttons for tool pages
- `src/components/Content/SocialShare.module.css` — share button row
- `src/components/Content/RecentFiles.jsx` — recent file history with localStorage
- `src/components/Content/RecentFiles.module.css` — recent file list styling
- `src/components/Content/DarkModeToggle.jsx` — theme toggle with localStorage
- `src/components/Content/DarkModeToggle.module.css` — toggle styling
- `src/components/Content/ToolPageLayout.jsx` — assembled page composition for each tool
- `src/components/Content/ToolPageLayout.module.css` — container spacing
- `src/components/Content/HomepageContent.jsx` — homepage assembled layout
- `src/components/Content/HomepageContent.module.css` — homepage spacing
- `src/components/Content/ToolGrid.jsx` — all tools homepage grid
- `src/components/Content/ToolGrid.module.css` — card and filter styling
- `src/components/Content/ScrollProgressBar.jsx` — reading progress indicator
- `src/components/Content/ScrollProgressBar.module.css` — fixed top bar styling
- `src/components/Content/BackToTop.jsx` — floating back-to-top button
- `src/components/Content/BackToTop.module.css` — floating action button styling

## How to Add Content to a New Tool

1. Add the tool content to `src/data/toolContent.js`.
2. Include `howToSteps`, `features`, `useCases`, and `relatedTools`.
3. Use `ToolPageLayout` to render the section flow.
4. Ensure `seoConfig.js` contains FAQs and metadata for the tool.
5. Reuse `RelatedTools` and `FAQSection` for content consistency.

## Content Strategy

- Every tool page has: HowTo, Features, UseCases, WhyPDFKira, FAQ, RelatedTools, Comparison
- Homepage has: Stats, ToolGrid, WhyPDFKira, BlogPreview, Testimonials, Newsletter
- Blog posts have: Article schema, related tools, CTA and newsletter elements

## UX Principles

- Mobile-first design
- Touch targets at least 44px high
- Readable font sizes with strong contrast
- Visible hierarchy and clean spacing
- Fast perceived performance with responsive layouts and lightweight components

## Performance

- Use CSS Modules and lightweight React components
- Keep sections static and memoized where useful
- Lazy-load heavy content when needed in the future
- Use `useIntersectionObserver` for scroll-triggered enhancement
