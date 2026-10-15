# Recommended Technology Stack

## Prototype (included)

- React 18 + Vite
- Plain CSS for a self-contained responsive demo
- Lucide React icons
- In-memory sample data and state
- CSV export in browser
- No real patient data, authentication, server, or database

This keeps the prototype runnable immediately and avoids implying that local browser state is suitable for clinical use.

## Production recommendation

| Layer | Recommendation | Reason |
|---|---|---|
| Frontend | React + TypeScript + Vite | Small team, fast iteration, strong typing |
| UI | Watermelon UI components installed through shadcn registry; Tailwind CSS v4 | Reusable accessible controls; source copied into app and editable |
| Routing | React Router | Clear role-oriented screens |
| Forms | React Hook Form + Zod | Input validation and typed schemas |
| Data fetching | TanStack Query | Server state, retries, cache invalidation |
| Backend | Node.js + TypeScript + Fastify (or NestJS if team needs stronger conventions) | Typed API, validation, maintainable modules |
| Database | PostgreSQL | Transactional integrity for patient/task/discharge workflows |
| ORM | Prisma or Drizzle | Schema migrations and typed access |
| Authentication | OIDC provider or facility identity provider; secure server sessions | Avoid building custom password/auth flows |
| Authorization | Server-side RBAC and resource-level checks | Roles and facility/ward scoping |
| Jobs/notifications | PostgreSQL outbox + worker; email/SMS only after policy approval | Reliable reminders and retry handling |
| Hosting | Facility-approved cloud or private infrastructure, based on data residency and procurement requirements | Health data needs an approved environment |
| Observability | Structured logs, error reporting, metrics, uptime checks | Diagnose failures without leaking PHI |
| Testing | Vitest, React Testing Library, Playwright, API integration tests | Unit through end-to-end coverage |
| CI/CD | GitHub Actions or equivalent, dependency scanning, migration checks | Repeatable releases |
| Backups | Encrypted automated backups with tested restore procedure | Recovery and continuity |

## Architectural choice

Start with a **modular monolith**, not microservices. One backend and one PostgreSQL database are simpler to operate for a small facility and team. Separate modules internally: identity/access, census, observations, rounds, discharge, reporting, audit, configuration.

## Deployment environments

- Development: synthetic data only.
- Staging: synthetic or formally de-identified data; production-like access controls.
- Production: approved hosting, TLS, managed secrets, encrypted storage/backups, monitoring, incident response, and documented recovery.

## Cost posture

Use open-source components where practical. Hosting, managed database, identity, SMS, monitoring and compliance costs depend on the facility's approved vendors and deployment model; do not promise a zero-cost production deployment before requirements are known.
