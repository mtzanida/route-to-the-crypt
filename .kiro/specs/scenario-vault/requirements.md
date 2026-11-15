# Requirements — Scenario Vault

Owner requested a useful AWS Emulator extension with no AWS provisioning charges.

1. The game SHALL work with no emulator or backend.
2. In local development, a learner SHALL save and restore a selected scenario's endpoint health.
3. The bridge SHALL use authenticated local AWS Emulator S3 APIs and reject cloud endpoint overrides.
4. Invalid, oversized or incompatible snapshots SHALL fail without updating the UI.
5. Missing snapshots and unsupported operations SHALL produce an explicit error.
6. The UI SHALL distinguish snapshot persistence from routing simulation and explain ephemeral storage.
7. Production builds SHALL exclude vault controls and need no AWS runtime.
8. Tests SHALL verify no fallback to environment credentials or public AWS endpoints.
9. Submission materials SHALL identify actual Kiro use separately from Codex-assisted implementation.
