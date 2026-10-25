---
name: figma-to-screen
description: Build a WebBlock screen or component from a Figma frame URL, adapting the design to the project's routes, features, design tokens and existing common components.
argument-hint: <figma-url> [route or feature]
---

Build the screen from: $ARGUMENTS

1. Read the Figma frame through the Figma MCP server (design context + screenshot for the node in the
   URL). If the server isn't connected, stop and tell me to run `/mcp` to authenticate Figma.
2. Treat the Figma output as a REFERENCE, not code to paste:
   - Map Figma colours, fonts and spacing to the tokens in `src/app/globals.css`. Never paste hex values.
   - Replace Figma elements with existing components: `StatusBadge`, `DataTable`, `Modal`,
     `SegmentedTabs`, `KpiCard`, `toast`, sidebars. List any element with no existing component and
     ask before creating a new common component.
   - Use real semantic HTML (buttons, links, tables, labels), not absolutely positioned divs.
3. Decide placement: which route group, which feature. Data comes from the feature's `api.ts`
   (create mock data if missing — follow `/new-feature` rules). Text that is data (names, prices,
   statuses) comes from mocks, not hardcoded JSX.
4. Respect the invariants: website CTAs are "Contact us"-style and use tel:/mailto:/Maps/https only.
5. Build loading, empty and error states even if Figma only shows the filled state.
6. Run `/verify`, then compare the result with the Figma screenshot and list visible differences.
