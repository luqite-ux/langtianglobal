# Langtian motion plan

This record documents the current v0 handoff and its implementation. It was written after the source download, so it does not claim that the plan existed before the v0 generation call.

## Design fit

Langtian supplies composite sheets, felts and panels for automotive interior parts. Buyers need to see material surfaces, compare forms, read specifications and reach an inquiry. The red and dark customer Banner artwork supplies the brand's visual rhythm. Motion stays brief so that product structure and certificate details remain readable.

## External candidates reviewed

| Candidate | Source | Decision | Reason |
| --- | --- | --- | --- |
| Scroll Image Reveal | [Motion example](https://motion.dev/examples/react-scroll-image-reveal) | Do not adopt | A scroll-linked center curtain would temporarily crop the customer's product, equipment and certificate photos. It adds scroll work across the 20-photo manufacturing page and would weaken immediate image recognition on phones. |
| Scroll Word Reveal | [Motion example](https://motion.dev/examples/react-text-scroll-word-reveal) | Do not adopt | Word-by-word opacity would make specification and certificate copy slower to read, and complicate accessible reading order for dense B2B content. |

Both candidates were compared for brand fit, information hierarchy, inquiry help, recent-customer similarity, desktop and 390px behavior, runtime cost, and reduced-motion fallback. The project uses bounded CSS and IntersectionObserver behavior without purchasing Motion+ examples or copying third-party code.

## Four implemented scenes

1. **Customer Banner sequence — narrative.** Three supplied Banner compositions rotate with manual previous/next controls, direct slide buttons and pause. Real HTML title, text and CTA sit in each source image's reserved copy area. Mobile retains the image subject and moves copy to a dedicated safe area. The carousel pauses outside the viewport and for reduced motion. Evidence: `home-desktop.png`, `home-mobile.png`, `banner-2-mobile-full.png`, `banner-3-desktop.png`, `banner-3-mobile.png`.
2. **Independent viewport reveals — content.** Main sections, product cards, factory photographs, facts and certificates each use their own IntersectionObserver. The normal entrance is 22px / 640ms with short capped per-card delays. Content is visible before JavaScript mounts and when observers are unavailable. No global timeout marks unseen sections as complete. Reduced-motion shows content immediately. Evidence: desktop and 390px screenshots of Home, Products, Manufacturing, Quality, About, News and Contact; full lifecycle evidence remains to be recorded.
3. **Inquiry path line — process.** The four sampling steps reveal individually; each step's red top rule extends from left to right when its own item enters view. The rule is fully visible without JavaScript or when reduced motion is enabled. This emphasizes the procurement sequence without hiding the step text. Evidence: full-page Home screenshots and pending lifecycle observation.
4. **Controls and cards — interaction.** Navigation, product/category cards, carousel controls, FAQ accordion and inquiry form provide short hover, focus, active or expand feedback. Touch users can read and operate every item without hover. Reduced motion removes decorative transitions while retaining focus and state cues. Evidence: product, FAQ and contact screenshots; keyboard/touch behavior remains to be captured in terminal review.

## Verification status

Local desktop and 390px screenshots exist for representative routes and all three Banner states. The full route-by-route viewport lifecycle, long idle then scroll, no-JavaScript, slow-load and reduced-motion checks are still pending. This plan is not a claim of motion PASS or Production verification.
