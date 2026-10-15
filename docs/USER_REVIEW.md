# User Review and Usability Plan

## Personas and jobs to be done

### Nurse — “I need to know who I have not checked yet.”
**Success:** sees assigned patients and due/complete state; records a reading in seconds; can recognize a duplicate and document a repeat safely.

### Doctor — “I need the reading before I enter the room, without missing the patient who needs me most.”
**Success:** queue prioritizes clinically urgent work according to approved protocol, shows latest observations and missing data, records the visit once, and allows a documented urgent exception.

### Administrator — “I need to prepare the next bed without chasing verbal approvals.”
**Success:** sees doctor-approved discharge tasks, knows who has been notified, records physical departure, and sees the bed released only after the departure event.

### Facility lead — “I need to know whether operations are improving.”
**Success:** views task completion and delay measures, with clear reporting windows, counts and definitions. Mortality alerts are reviewed clinically, not interpreted as causal proof.

## Prototype review

**Strengths**
- Outstanding tasks appear on the overview and have dedicated queues.
- The table displays temperature and doctor task status together.
- Search and filters reduce the time spent scanning a full census.
- Discharge review is a separate state from monitoring.
- Responsive layout and visible status labels support quick scanning.

**Issues to resolve before pilot**
- The demo uses in-memory state and resets on refresh; this is not persistence.
- The demo allows temperature overwrite with a warning; production should use append-only amendments.
- Fever-free days are sample counters, not calculated from a validated timeline.
- The prototype does not implement logins, permissions, assignment, task scheduling, audit, or real notifications.
- It uses fictional sample names and temperatures; replace them with no real patient data.
- A production doctor queue needs an approved urgency rule, not just “first in list.”
- Accessibility testing with real staff and assistive technology is still required.

## Lightweight usability test

Recruit 2 nurses, 2 doctors and 1 administrator. Use synthetic cases; do not test with identifiable patient data.

1. Find a patient whose temperature is due.
2. Record a temperature and explain what happens next.
3. Find a patient whose temperature is recorded but doctor visit is pending.
4. Record a visit and verify it is no longer in the pending queue.
5. Identify a patient who is a discharge-review candidate; explain why that does not automatically mean discharge.
6. Search by room and export a census.
7. Explain how to handle an urgent doctor visit when a temperature is missing.

**Measures:** task completion, time on task, errors, duplicate attempts, assistance required, and confidence. Observe rather than coach. Any misunderstanding of discharge eligibility or urgent exceptions is a launch-blocking usability issue.
