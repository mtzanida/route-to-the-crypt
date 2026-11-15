# Scenario Vault verification

Verified locally on November 15, 2026. This is evidence for local storage
integration, not live AWS, Global Accelerator routing or contest eligibility.

| Boundary | Observed result |
| --- | --- |
| TypeScript and production build | `npm run build` passed |
| Scenario model and restore schema | 3 Node tests passed |
| Adapter validation, bounds and credential isolation | 6 Python tests passed |
| Actual AWS Emulator | Version 1.0.385, release 2026.11.14 |
| Emulator S3 API | HeadBucket/CreateBucket, PutObject, GetObject round trip passed |
| Vite proxy → Python bridge → emulated S3 | Save and load passed with HTTP 200; changed health state persisted |
| Missing snapshot | HTTP 404 |
| Invalid health type | HTTP 400 |
| Foreign browser origin | HTTP 403 |
| Production bundle | No vault API path or vault interaction code in generated JS |
| Browser interaction / visual check | Not verified: Chromium could not start under the execution environment's socket restrictions |
| Docker on macOS / Apple silicon | Instructions follow AWS's Docker pattern; not executed on macOS |
| Kiro use during implementation | None; see KIRO_EVIDENCE.md |

The live test used a native local emulator extracted from the official Linux
package. No AWS account credentials, real S3 buckets, paid services or AWS
infrastructure deployment were used. The emulator and local servers were stopped
after tests. Resources are ephemeral.

To reproduce:

1. Follow LOCAL_LAB.md and start the emulator.
2. Run `python3 lab/smoke.py` for the SDK round trip.
3. Start the bridge and Vite, then run `python3 lab/http_smoke.py` for proxy/API checks.
4. Manually complete the browser save → change → restore sequence, including mobile
   layout and emulator-offline behavior, before recording the submission video.
