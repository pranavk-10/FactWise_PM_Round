# System Architecture

## Logical components

```text
Nurse / Doctor / Admin / Facility Lead
                 |
         Responsive React UI
     (Watermelon UI + typed forms)
                 |
          HTTPS / JSON API
                 |
  ---------------------------------------
  | Identity & RBAC | Census / Bed Mgmt |
  | Observations    | Doctor Encounters |
  | Discharge       | Outcomes / Reports|
  | Audit / Config  | Notification Jobs |
  ---------------------------------------
                 |
             PostgreSQL
                 |
       Outbox worker / notifications
```

## Core module responsibilities

- **Identity & access:** users, sessions, roles, scope, permission checks.
- **Census:** patient identity within facility, admission, active/discharged status, bed allocation.
- **Observations:** temperature, time, author, device/source, amendment chain, validity.
- **Rounds:** daily expected tasks, completion, exception reason, assignment and handover.
- **Discharge:** eligibility evaluation, doctor approval/rejection, admin acknowledgement, actual discharge and bed release.
- **Outcomes:** cohort definitions, outcome events, aggregation, threshold alerts.
- **Audit:** append-only event record for reads of sensitive records where policy requires, and all writes/approvals.
- **Notifications:** reliable task reminders and discharge notifications through an outbox pattern.

## Key data flow

1. The task generator creates daily task expectations for every active patient according to facility schedule/timezone.
2. A nurse posts an observation. The API validates value, patient status, role, timestamp and duplicate policy.
3. The transaction persists the observation, updates the task state, writes an audit event and enqueues downstream notifications.
4. The doctor queue reads task state and the latest valid observation; urgent cases can use a documented exception.
5. A discharge evaluation service checks the clinician-approved fever-free algorithm and returns candidate/not-candidate plus explanation and missing-data reasons.
6. Doctor approval and admin completion are separate transactions with independent audit events.
7. Outcome reports aggregate the approved cohort and period; the UI shows numerator, denominator, exclusions and last-updated time.

## Reliability requirements

- Database transactions for observation writes and bed allocation.
- Unique constraints for active bed occupancy and task identities.
- Idempotency keys for retryable API writes.
- Outbox pattern for reliable notifications.
- Health checks, structured logs, metrics and alerting.
- Tested database restore and documented downtime procedure.
- No critical workflow should rely on browser local storage as the system of record.
