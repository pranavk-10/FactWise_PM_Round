# Compatibility and Accessibility

## Proposed support matrix

| Environment | MVP target | Notes |
|---|---|---|
| Desktop Chrome / Edge, current and previous major | Supported | Primary nurse/admin workstation |
| Desktop Firefox, current and previous major | Supported after QA | Verify table and form interactions |
| Safari on macOS, current and previous major | Supported after QA | Verify date/time and focus behavior |
| Mobile Safari on recent iOS | Responsive target | Nurse workflows must remain usable at bedside |
| Chrome on recent Android | Responsive target | Test low-width screens and virtual keyboard |
| Tablet browsers | Responsive target | Useful for ward rounds |
| Internet Explorer | Not supported | End of life |

The included prototype is responsive CSS, but the table remains horizontally scrollable on narrow screens. A bedside pilot should test whether card-based patient rows are more usable than a dense table.

## Accessibility requirements

- Target WCAG 2.2 AA.
- Full keyboard navigation, visible focus, sensible tab order, and no keyboard traps.
- Accessible names for icon-only controls and form fields.
- Color is never the only indicator of status; include text labels.
- Sufficient text/control contrast and touch targets appropriate for bedside use.
- Error messages are associated with fields and announced to assistive technology.
- Respect reduced-motion preferences if animation is introduced.
- Support zoom to 200% without loss of core functionality.
- Screen-reader test critical temperature and discharge workflows.

## Connectivity and resilience

Production requirements to decide:
- Facility network reliability and downtime duration.
- Whether temporary offline entry is necessary.
- If offline mode is implemented, queue writes securely, show unsynced state, prevent conflicting edits, and reconcile on reconnect.
- Never treat an unsynced observation as visible to other staff or as a basis for discharge eligibility.
- Provide a paper downtime procedure and reconciliation checklist.

## Time and locale

- Store timestamps in UTC; display in the facility's configured timezone.
- Generate task dates using facility timezone, not the user's device timezone.
- Test daylight-saving transitions if deployed outside a fixed-offset timezone.
- Display temperature units explicitly and configure allowed input precision.
