# Product Requirements Document — QuarantineOS

**Version:** 0.1 · **Status:** MVP proposal · **Owner:** Product + Clinical Operations

## 1. Summary

QuarantineOS is an internal web application for a 74-bed quarantine/treatment facility. It coordinates the daily patient temperature check, same-day doctor visit, discharge workflow, and aggregate outcome reporting. Its primary purpose is operational reliability: making outstanding tasks visible, preventing avoidable duplicate work, and shortening administrative discharge delays.

## 2. Problem statement

Paper journals and verbal handoffs do not provide a shared, real-time view of which patients have been checked, seen by a doctor, or cleared for discharge review. This causes missed or duplicated observations, doctors arriving before readings are available, and patients occupying beds longer than necessary. The facility also lacks a consistent way to compare mortality outcomes with the stated 15% benchmark.

## 3. Goals

- Every active patient has a visible daily temperature-task state.
- Staff can see outstanding work without inspecting paper journals or asking colleagues.
- Doctors can prioritize patients with recorded readings and patients requiring urgent review.
- The three-day fever-free criterion is calculated from documented observations using a clinician-approved rule.
- Discharge eligibility, clinical approval, administrative notification, and actual discharge are separate auditable states.
- Leadership can review mortality and survival counts/rates with a defined cohort and reporting window.
- Deliver a small, usable MVP quickly, then iterate.

## 4. Non-goals for MVP

- AI-generated diagnosis or treatment recommendations.
- Autonomous discharge or treatment decisions.
- Predictive mortality scoring.
- Patient/relative portal, billing, pharmacy, lab, or EHR integration.
- Wearables or continuous temperature device ingestion.
- Multi-facility enterprise analytics unless needed by pilot.

## 5. Users and permissions

| Persona | Core needs | MVP permissions |
|---|---|---|
| Nurse | Find assigned patients, record temperature, view prior observations | Read assigned patient profile; create temperature observation; correct via audited amendment |
| Doctor | Review readings, document visit, record clinical discharge decision | Read patient chart; create encounter note; approve/reject discharge eligibility |
| Administrator | Manage bed census and discharge coordination | Admit/assign bed; see approved discharge queue; record notification and physical discharge |
| Facility lead | Track completion and outcomes | Read aggregate dashboard and audit reports; no default editing of clinical observations |
| System administrator | Manage users, configuration, backup and access | Technical configuration; clinical access only when explicitly authorized |

## 6. MVP requirements

### P0 — launch-critical

**Patient census**
- Create a patient record with unique facility ID, admission timestamp, status, and bed.
- Show current occupancy against 74 beds and prevent assigning a bed already occupied.
- Search by patient ID, name, and bed.
- Preserve history when patient is discharged; never hard-delete clinical records.

**Temperature observations**
- Show each active patient's daily status: due, recorded, exception, or overdue.
- Record value, unit, observation timestamp, author, and optional factual note.
- Prevent accidental duplicate daily observations; if policy permits a repeat, record it as a separate observation with a reason rather than overwriting the first.
- Highlight configured out-of-range values for clinician review; the software must not infer treatment.
- Missing data must never be interpreted as an afebrile day.

**Doctor rounds**
- Show patients whose temperature is recorded but doctor visit is pending.
- Record encounter timestamp, clinician, note, and completion state.
- Permit an urgent visit before a temperature reading only through an explicit exception reason and follow-up task; clinical workflow must not block urgent care.

**Discharge**
- Calculate “candidate for discharge review” using a clinically approved rule based on complete observations and three full fever-free days.
- Require explicit doctor decision and record its timestamp/author.
- Notify administration and track acknowledgement, discharge date/time, and bed release.
- Never automatically discharge or equate a candidate flag with discharge approval.

**Dashboard and reporting**
- Show active census/capacity, temperature completion, doctor-round completion, discharge queue, and overdue tasks.
- Define completion denominators clearly: e.g. active patients expected to have tasks today.
- Show deaths, eligible cohort size, transfers, survivors, mortality rate, survival rate, and reporting window when outcome data becomes available.
- Alert leadership when the agreed mortality metric exceeds 15%, with counts and small-sample caveats.

**Access and audit**
- Authenticated users only; role-based permissions.
- Append-only audit trail for create, amend, approve, discharge, and configuration events.
- Server-side validation and secure session management.

### P1 — after pilot

- Shift handover and assignment to nurse/doctor teams.
- Acknowledgement-based in-app notifications.
- Printable handover and discharge summaries.
- Daily completion report and CSV export with PHI controls.
- Offline-safe draft queue only if facility connectivity demands it.
- Multilingual interface.

### P2 — later

- Hospital information system integration.
- Device integration and automated import.
- Multi-site benchmarking and advanced analytics.
- Patient/relative communication portal.

## 7. Critical workflows

### Daily care
1. Census is refreshed and today's expected task list is generated.
2. Nurse opens “Temperature rounds,” sees due patients, records each reading.
3. Reading appears on the patient chart and doctor queue.
4. Doctor reviews the reading and records the visit.
5. Missing tasks remain visible until completed or resolved with an authorized exception.
6. Shift lead sees outstanding work and handover status.

### Discharge
1. System computes a *candidate* status from complete, valid observations.
2. Doctor reviews the chart and confirms or rejects clinical discharge.
3. If approved, admin receives a discharge task and acknowledges it.
4. Admin records actual discharge timestamp and releases the bed.
5. The system retains the full event history.

## 8. Acceptance criteria

- A nurse can identify every active patient missing today's temperature in no more than two interactions from the dashboard.
- A saved observation is timestamped and attributed to the logged-in user.
- The same observation cannot be silently overwritten; corrections retain the original value and reason.
- A doctor queue excludes patients already visited today and includes eligible pending patients.
- An urgent exception is possible without silently bypassing the normal workflow.
- A discharge candidate cannot be marked discharged without the required approval and admin completion steps.
- The system never treats missing observations as fever-free.
- Dashboard denominators are visible and consistent with the selected reporting period.
- An unauthorized role cannot access or mutate restricted records.
- Critical workflows work on a supported mobile browser and desktop browser.

## 9. Success metrics

- Daily temperature completion rate.
- Same-day doctor-visit completion rate.
- Duplicate observation rate.
- Median time between temperature recording and doctor visit.
- Median time from doctor discharge approval to administrative discharge.
- Bed occupancy and median length of stay.
- Percentage of discharge records with complete approval/audit trail.
- Mortality rate, survival rate, absolute outcome counts, and trend over clinically approved periods.

Operational metrics must not incentivize unsafe early discharge or under-documentation. Clinical outcomes require quality review and risk adjustment where appropriate.

## 10. Risks and mitigations

- **Incorrect fever-free calculation:** clinical owner signs off the exact rule; tests cover missing data and boundary timestamps.
- **Urgent patient delayed by workflow:** explicit emergency override; never use software sequencing as a reason to delay care.
- **Staff adoption:** co-design with nurses, doctors and admins; keep data entry short; provide shift handover.
- **Incorrect mortality comparisons:** define cohort, time window, transfers and deaths consistently; show counts and uncertainty.
- **Sensitive health data exposure:** least privilege, encryption, audit, retention policy, backups and incident response.
