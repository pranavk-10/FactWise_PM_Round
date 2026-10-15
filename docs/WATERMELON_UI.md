# Watermelon UI Integration

Reference: https://ui.watermelon.sh/ · https://ui.watermelon.sh/components · https://ui.watermelon.sh/cli

Watermelon UI is a free, open-source React component catalog distributed as copy-paste source through a shadcn-compatible registry. This model makes component source part of the app, rather than relying on a runtime Watermelon package.

## Why this approach
- Reuse accessible, familiar UI patterns for cards, buttons, forms, badges, tables, dialogs and tabs.
- Keep the facility workflow-specific logic in our code.
- Keep copied component code reviewable and editable.
- Avoid installing a large UI framework before the MVP scope is settled.

## Suggested component set
Use Watermelon UI's current registry/catalog to select and install suitable variants for:
- Button
- Card
- Badge
- Data Table or Table
- Dialog
- Input
- Select
- Textarea
- Tabs
- Tooltip
- Sonner/toast
- Dashboard block or admin layout if a matching variant fits.

Do not guess component names or use variants without reviewing their current catalog page. The example below demonstrates the documented registry install pattern; replace `<component-name>` with the exact item slug shown by Watermelon.

```bash
npx shadcn@latest init
npx shadcn@latest add https://registry.watermelon.sh/r/<component-name>.json
```

Watermelon UI documents this registry flow at https://ui.watermelon.sh/cli. Tailwind CSS v4 is required by its current framework guidance; React 18+ is supported, with Vite + React recommended.

## Integration sequence
1. Keep the current self-contained demo running as a behavior reference.
2. Initialize shadcn with Tailwind CSS v4 in the production branch.
3. Select exact Watermelon variants for Card, Button, Badge, Table, Dialog, Input, Select and Toast.
4. Replace presentational primitives one screen at a time; do not change business rules in the same commit.
5. Add component tests and keyboard/focus tests.
6. Confirm table readability at 320px and 200% zoom.
7. Pin and review generated source/dependencies through normal code review.

## Prototype status
The included prototype uses React, Lucide React and custom CSS so it runs directly with `npm install && npm run dev`. It is **not falsely represented as already importing generated Watermelon registry files**. The documented integration is the next implementation step; the visual language and component composition are ready to be mapped onto Watermelon components.
