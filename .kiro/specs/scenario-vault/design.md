# Design — Scenario Vault

React development panel → same-origin Vite proxy → loopback Python HTTP bridge →
HTTPS AWS Emulator at 127.0.0.1 → emulated S3 bucket.

- One bucket, one key per curated scenario; explicit Save replaces that scenario slot.
- Versioned snapshot schema reuses the existing JSON export.
- Both the bridge and client validate endpoint identity, types and model outcome.
- Boto3 uses only emulator-generated keys/CA, explicit loopback endpoint, path-style S3 and no proxies.
- No real AWS resources, provisioning code, cloud credentials, or deployment workflow.
- The public build omits the local panel; exported JSON remains available.
- Restore must not change route rules, invent live traffic evidence, or require the optional Crew app.

Trade-off: choose a verified S3 round trip over an unverified Global Accelerator
API lab. This advances persistence and repeatable incident replay without claiming
network behavior that the emulator has not demonstrated.
