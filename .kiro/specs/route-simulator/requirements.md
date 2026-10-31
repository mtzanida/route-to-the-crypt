# Requirements — Route to the Crypt

## User story

As an AWS learner, I want to change a small routing scenario and see an explanation of the illustrative outcome so I can reason about failure paths without changing a real environment.

## Functional requirements

1. The user can choose one of at least three curated scenarios.
2. The user can change the health state of a scenario endpoint.
3. The app highlights the illustrative active path and reports when the scenario has no available path under the simplified model.
4. The app explains the result and states its assumptions.
5. The user can export the current scenario snapshot as JSON with a schema version.
6. The app remains useful with the optional Crew Debrief entirely absent.

## Quality requirements

- Responsive layout and readable contrast.
- No AWS account, credentials, live calls, or paid API is required.
- Scenario explanations have official AWS documentation links before final submission.
- The app describes itself as an educational model, not an exact AWS emulator.
- All submitted material is in English or includes an English translation.
