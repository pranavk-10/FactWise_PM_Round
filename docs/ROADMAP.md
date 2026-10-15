# Delivery Roadmap

Plan for a small team; estimates are indicative and depend on clinical sign-off and infrastructure.

## Phase 0 — Validate workflow (1–3 days)
- Shadow current nurse, doctor and admin workflow.
- Agree task timing, fever definition, “three full days,” exceptions, discharge approval and outcome definitions.
- Assign clinical product owner and acceptance approver.
- Use the included prototype for walkthroughs with synthetic data.

**Exit:** signed workflow and decision log.

## Phase 1 — MVP build (1–2 weeks)
- Authentication and role-based access.
- Patient census and bed allocation.
- Daily task generation and temperature observation.
- Doctor queue and encounter completion.
- Discharge candidate, doctor approval, admin acknowledgement and departure.
- Dashboard, audit trail and basic reports.
- Automated unit/integration tests and staging environment.

**Exit:** P0 workflows pass acceptance tests in staging.

## Phase 2 — Pilot hardening (1 week)
- Staff usability sessions.
- Accessibility and mobile checks.
- Threat model, security review, backup restore, downtime drills.
- Verify reporting definitions and mortality alert behavior with clinical leadership.
- Train users and appoint support owner.

**Exit:** signed pilot readiness checklist.

## Phase 3 — Controlled pilot (2–4 weeks)
- Pilot with one ward/shift before expanding.
- Review task completion, missed readings, duplicate attempts, doctor delay and discharge lag daily.
- Triage usability issues and defects.
- Compare operational metrics against baseline; do not claim clinical outcome improvement without suitable evaluation.

**Exit:** pilot owner approves expansion.

## Phase 4 — Enhancements
- Shift assignment and handover.
- Approved messaging integration.
- Improved mobile layout/offline handling if required.
- EHR/device integrations and multi-site reporting only when justified.

## Suggested team split
- Product/clinical operations lead: workflow, priorities, acceptance.
- Frontend engineer: UI, forms, queues, accessibility.
- Backend engineer: API, database, auth, audit, jobs.
- QA/clinical champion: test cases, workflow validation, training.
- Security/operations support: deployment, backup, monitoring, incident readiness.

For a very small team, combine roles but retain independent clinical sign-off and a second-person review of security-sensitive changes.
