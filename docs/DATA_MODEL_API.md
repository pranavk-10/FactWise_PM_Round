# Data Model and API Contract

## Core entities

| Entity | Important fields |
|---|---|
| User | id, display_name, login_subject, role, active, last_login_at |
| Patient | id, facility_patient_number, display_name, date_of_birth or age policy, admission_at, status |
| Bed | id, ward, room, bed_label, active |
| BedAssignment | id, patient_id, bed_id, started_at, ended_at, assigned_by |
| DailyTask | id, patient_id, task_date, task_type, status, assignee_id, completed_at, exception_reason |
| TemperatureObservation | id, patient_id, measured_at, value, unit, recorded_by, source, note, supersedes_id |
| DoctorEncounter | id, patient_id, visited_at, clinician_id, note, exception_reason |
| DischargeReview | id, patient_id, candidate_at, rule_version, clinical_decision, decision_by, decision_at, rejection_reason |
| DischargeEvent | id, patient_id, approved_at, admin_ack_at, discharged_at, recorded_by |
| OutcomeEvent | id, patient_id, outcome, occurred_at, cohort_id, notes |
| AuditEvent | id, actor_id, action, resource_type, resource_id, timestamp, request_id, reason, safe_diff |
| FacilityConfig | timezone, expected observation windows, fever definition, discharge rule version, alert threshold |

Store UTC timestamps and render them in the facility timezone. Keep an explicit rule version on every discharge evaluation so later policy changes do not silently rewrite historical decisions.

## API outline

All endpoints require authentication unless explicitly identified as health-check endpoints. Authorization must be enforced by the API, not only by hiding UI controls.

- `GET /api/v1/dashboard?date=YYYY-MM-DD`
- `GET /api/v1/patients?status=active&search=...`
- `POST /api/v1/patients`
- `GET /api/v1/patients/:id`
- `POST /api/v1/patients/:id/temperature-observations`
- `GET /api/v1/patients/:id/temperature-observations?from=...&to=...`
- `POST /api/v1/patients/:id/doctor-encounters`
- `GET /api/v1/rounds?date=YYYY-MM-DD&type=temperature|doctor`
- `POST /api/v1/tasks/:id/complete`
- `POST /api/v1/tasks/:id/exception`
- `POST /api/v1/patients/:id/discharge-reviews`
- `POST /api/v1/discharge-reviews/:id/decision`
- `POST /api/v1/patients/:id/discharge-events`
- `GET /api/v1/reports/outcomes?from=...&to=...`
- `GET /api/v1/audit-events?resource_id=...` (permission-restricted)

## Example temperature payload

```json
{
  "measuredAt": "2026-10-15T08:14:00+05:30",
  "value": 36.8,
  "unit": "C",
  "note": "Patient comfortable at time of measurement",
  "idempotencyKey": "client-generated-unique-value"
}
```

## Validation and business rules

- Reject unknown patient IDs, invalid units, malformed timestamps, and values outside configured device/protocol bounds.
- Do not silently overwrite an observation. Corrections create a linked amendment with reason and author.
- A missing observation is not evidence of no fever.
- Only one expected daily task exists for a patient/task type/date, while permitted repeat observations are separately recorded.
- A doctor encounter before a reading requires an explicit exception reason; emergency care is never blocked by the application.
- Candidate discharge is not clinical approval. Approval and administrative discharge require separate permissions and events.
- Occupied beds must be unique across active assignments.
- API responses must not expose more patient data than the requesting role needs.
