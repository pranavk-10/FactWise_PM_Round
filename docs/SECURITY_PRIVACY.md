# Security, Privacy and Clinical Safety

## Minimum production controls

- Use a facility-approved identity provider where possible; enforce MFA for privileged users.
- Secure, HTTP-only, SameSite cookies; short-lived sessions and revocation.
- Server-side role and resource-level authorization on every endpoint.
- TLS in transit and encryption at rest, including backups.
- Store secrets in a managed secret store, never in source code or frontend variables.
- Validate inputs on the server; use parameterized database operations.
- Apply rate limits, CSRF protections where relevant, secure headers, and dependency scanning.
- Keep append-only audit events for observations, amendments, clinical decisions, discharge and permission changes.
- Log actor, timestamp, resource, action, reason, and correlation ID; avoid logging unnecessary clinical details.
- Backups, restore drills, incident response, breach escalation, and retention/deletion policy.
- Least-privilege database access and separation of development, staging and production.
- Review exports: restrict access, minimize columns, log export events, and prevent public links.
- Threat-model shared workstations, unattended sessions, printed sheets, and lost mobile devices.

## Privacy and compliance

Before any real patient data is used, the facility must determine applicable Indian health-data, privacy, medical-record retention, and institutional requirements with qualified legal/compliance staff. This document is not legal advice and does not assert that the prototype is compliant with any regulation or certification.

## Clinical safety constraints

- Software records and coordinates care; it does not prescribe treatment.
- Do not automatically discharge a patient.
- Missing or stale observations cannot be treated as fever-free.
- Thresholds and time calculations require clinical sign-off and versioned configuration.
- Urgent care must not be delayed because a task is incomplete in software.
- Mortality alerts must include counts, cohort definition and period; they are signals for review, not causal conclusions.
- Any algorithm/configuration change requires approval, test evidence, effective date, and audit history.
