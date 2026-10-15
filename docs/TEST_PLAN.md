# QA and Acceptance Test Plan

## Unit tests
- Temperature input validation, unit conversion if later supported, precision and boundary values.
- Daily task generation by facility timezone and date boundary.
- Fever-free eligibility using approved rule, including incomplete days, missing observations, late observations, repeat readings and exact 72-hour/three-calendar-day boundary cases.
- Mortality and survival numerator/denominator definitions.
- Permission checks for each role and endpoint.

## Integration tests
- Patient admission and unique bed allocation under concurrent requests.
- Temperature save creates observation, completes the task, records audit event and enqueues notification in one reliable flow.
- Duplicate/idempotent request does not create unintended duplicate tasks.
- Amendment preserves original observation and requires a reason.
- Doctor visit updates the correct task and audit history.
- Discharge candidate -> doctor approval -> admin acknowledgement -> actual discharge -> bed release.
- Notification retry and duplicate delivery handling.
- Outcome report filters cohort and period correctly.

## End-to-end scenarios
1. Admit patient, record temperature, complete doctor visit.
2. Patient with no temperature remains visible as due; missing data does not advance fever-free eligibility.
3. High reading is flagged according to configured protocol and does not generate a treatment recommendation.
4. Urgent doctor visit can be documented with an exception.
5. Three full fever-free days make the patient a candidate only if the approved rule's data requirements are met.
6. Doctor rejects discharge review; admin cannot discharge.
7. Doctor approves; admin acknowledges and records actual discharge; bed becomes available.
8. Unauthorized user cannot view/edit the record.
9. Concurrent admissions cannot assign one bed twice.
10. Audit history explains every amendment and discharge decision.
11. Export contains only authorized fields and is audit logged.
12. Browser refresh preserves production data because the database, not browser memory, is the source of truth.

## Non-functional tests
- Load test at 74 active patients with expected staff concurrency plus agreed safety margin.
- API latency, database failure, notification outage and recovery.
- Restore from backup into a clean environment.
- Keyboard-only and screen-reader workflow.
- Mobile viewport, zoom and browser compatibility.
- Security testing for broken access control, session issues, injection, XSS, CSRF, and sensitive data in logs.

## Release gate
No real patient data or clinical deployment until P0 acceptance tests, clinical rule sign-off, access-control review, security review, backup/restore test, and downtime procedure are approved.
