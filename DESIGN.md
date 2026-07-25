# Portfolio Design Language

## Direction

The portfolio is an editorial developer profile: sharp typography and structured
technical information, softened by atmospheric blue and violet light. It should feel
confident, inventive, and human rather than corporate or template-driven.

## Visual anchors

- Black italic title slabs identify major sections. Their clipped corners create the
  recurring forward-motion motif.
- Electric blue is the primary action and structure color. Violet is an ambient
  secondary accent, never a competing call to action.
- The page background stays quiet and lightly translucent so glows can establish depth
  without reducing readability.
- Borders are substantial and rounded. Cards feel like outlined interface objects, not
  floating white rectangles.
- The display face is italic, wide, and uppercase; the body face is geometric and
  friendly. Monospace is reserved for dates, indices, and technical metadata.

## Composition

Sections share a recognizable interface vocabulary. Projects and experience use
chronological outlined cards, credentials use a compact two-card record grid, and
skills use a loose constellation. Variation comes from information hierarchy and
spacing while borders, radii, icons, type, and ambient light remain consistent.

Use asymmetry deliberately:

- Offset alternating content when there is enough horizontal space.
- Pair dense information with generous negative space.
- Let ambient gradients cross section boundaries to make the page feel continuous.
- Keep the primary reading column at roughly 900 px.

## Motion and interaction

- Animate only opacity and transforms.
- Keep motion short (200–300 ms) and interruptible.
- Hover states should increase contrast or lift by only a few pixels.
- Disable non-essential motion when `prefers-reduced-motion` is enabled.
- Keyboard focus must be at least as visible as hover.

## Generated CV

The CV is a print interpretation of the site, not a screenshot. It uses a white paper
canvas, a blue-violet edge rail, black italic pill headings, circular timeline markers,
and a compact two-column hierarchy while preserving selectable, ATS-readable text.

The PDF should:

- fit on one A4 page when the current content allows;
- retain selectable text and real links;
- use a restrained color rail rather than background-heavy decoration;
- keep contact, profile, skills, experience, education, and certifications visible;
- be regenerated at request time from the active locale dictionary.

## Accessibility and responsive behavior

- Preserve semantic headings, lists, links, and landmarks.
- Maintain a minimum 44 px touch target for controls.
- Never rely on color alone to communicate hierarchy or state.
- Collapse offsets and multi-column layouts below 700 px.
- Keep text wrapping safe for long translated strings.
- Honor dark mode and `prefers-reduced-motion`.
