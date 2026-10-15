# Umbrella Corporation — Hive Facility Operations MVP

A responsive, interactive frontend prototype for the Umbrella Corporation's 74-bed containment & quarantine facility. It focuses on daily biometric tracking, virology-round coordination, decontamination clearance review, and transparent quality metrics.

> **Safety notice:** This prototype uses fictional sample records and local browser state. It is not a production clinical system, does not give treatment recommendations, and must not be used to make real patient-care or discharge decisions. Clinical leadership must validate all rules before deployment.

## Run locally

Requirements: Node.js 20+ and npm.

```bash
npm install
npm run dev
```

Open the local URL printed by Vite. To validate a production build:

```bash
npm run build
npm run preview
```

## What works in this prototype

- Facility dashboard showing active census, temperature completion, doctor-visit completion, and discharge-review queue.
- Patient list search by patient name, ID, or room.
- Filters for temperature due, doctor pending, and discharge review.
- Record a temperature in °C, with basic range validation and a note.
- Record a doctor visit and visit note.
- Add a patient to the demo census.
- Mark a patient discharged in the demo.
- Export active census to CSV.
- Quality page documenting the 15% mortality / 85% survival benchmark.
- Responsive desktop and mobile layout.
- Interactions update in-memory state; refreshing restores sample data.

## Documentation

- [`docs/PRD.md`](docs/PRD.md) — product requirements and acceptance criteria
- [`docs/TECH_STACK.md`](docs/TECH_STACK.md) — recommended production stack
- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — services and data flow
- [`docs/DATA_MODEL_API.md`](docs/DATA_MODEL_API.md) — core schema and API contract
- [`docs/USER_REVIEW.md`](docs/USER_REVIEW.md) — personas, user journeys, and usability review
- [`docs/COMPATIBILITY.md`](docs/COMPATIBILITY.md) — browser, device, and accessibility plan
- [`docs/SECURITY_PRIVACY.md`](docs/SECURITY_PRIVACY.md) — security and privacy requirements
- [`docs/TEST_PLAN.md`](docs/TEST_PLAN.md) — QA and acceptance testing
- [`docs/ROADMAP.md`](docs/ROADMAP.md) — MVP delivery sequence
- [`docs/WATERMELON_UI.md`](docs/WATERMELON_UI.md) — Watermelon UI integration plan
- [`docs/OPEN_QUESTIONS.md`](docs/OPEN_QUESTIONS.md) — decisions needed before production

## Watermelon UI

Watermelon UI distributes copy-paste React components through the shadcn registry. See `docs/WATERMELON_UI.md` for the install commands and integration plan. The current demo is deliberately self-contained so it runs immediately after `npm install`, without requiring generated registry components. Its layout follows the same component-led approach; the production implementation should replace the local presentation primitives with installed Watermelon components and retain the facility-specific workflows.

Reference: https://ui.watermelon.sh/ and https://ui.watermelon.sh/cli

## Important product assumptions

1. “3 full days without a fever” needs a clinically approved definition of fever, observation schedule, time-window calculation, missing-reading handling, and whether antipyretic use affects the rule. The prototype only displays a simplified sample counter and never auto-discharges a patient.
2. Temperature threshold 38°C is used only to color fictional sample readings in the UI. Confirm the facility's actual protocol before production use.
3. A doctor visit should normally follow a recorded temperature, but urgent exceptions must be supported by a clinician-approved override workflow.
4. Outcome benchmarks require a defined cohort and reporting period. Small sample sizes and transfers can distort apparent mortality; the system should show counts alongside rates.
5. Authentication, server persistence, audit logs, backups, alerts, and integrations are not implemented in this prototype.

## Status

- [x] Interactive frontend prototype
- [x] Product and technical documentation
- [ ] Authentication and role-based access control
- [ ] Persistent backend and database
- [ ] Immutable clinical audit trail
- [ ] Clinical sign-off and validation
- [ ] Security review and deployment readiness
