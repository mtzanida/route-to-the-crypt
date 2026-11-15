# Scenario Vault: local AWS Emulator lab

The public game remains a static React app. This optional developer lab uses S3
APIs to save a scenario, change endpoint health and restore the saved state. It
exercises storage integration, not AWS Global Accelerator routing or failover.

## Cost boundary

There is no Terraform, CloudFormation, CDK or AWS deployment command in this lab.
“Provision” here means creating one in-memory S3 bucket **inside AWS Emulator**.
The adapter hardcodes HTTPS to `127.0.0.1` and reads only emulator-generated keys.
It ignores real environment keys, AWS profiles and public endpoint overrides.
If the emulator is unavailable, it fails. It never falls back to AWS.

Downloading the package/image and running Docker use your computer and internet.
No AWS account, subscription, real S3 bucket or Global Accelerator is needed.
Deploy only the static `dist/` output to a static host if you want a public demo;
that is separate from this lab. Do not provision real AWS infrastructure for it.

## Prerequisites

- Node.js 22+, Python 3.11+, and Docker on macOS/Windows, or native Linux emulator.
- AWS Emulator with authentication enabled. Tested locally with **1.0.385**.
- Ports 5173 (Vite), 8787 (bridge), 9297 (emulator) available on loopback.

From the repository root:

```bash
npm ci
python3 -m venv .venv
source .venv/bin/activate
python3 -m pip install -r lab/requirements.txt
```

## Start AWS Emulator

### macOS / Docker

The Dockerfile follows the official AWS installation pattern and pins the tested
emulator version. For Apple silicon:

```bash
docker build --build-arg EMULATOR_ARCH=aarch64 -t crypt-emulator -f lab/Dockerfile .
```

For Intel/AMD, omit the build argument. Create the mount directory, then start:

```bash
mkdir -p "$HOME/.aws/emulator"
docker run --rm --memory=2g --memory-swap=2g \
  -p 127.0.0.1:9297:9297 \
  -e HOME="$HOME" \
  -v "$HOME/.aws/emulator:$HOME/.aws/emulator" \
  crypt-emulator -p 9297
```

Keep authentication on; do not pass `--auth off`. The mount shares only the
emulator directory, not your normal AWS credentials. Telemetry is disabled by the
Dockerfile. On Linux Docker, add `--user "$(id -u):$(id -g)"` so files belong to you.

### Native Linux

Install AWS Emulator using the official guide linked below, then:

```bash
aws-emulator -t off --idle-timeout 600
```

The emulator creates temporary keys and its CA certificate under
`~/.aws/emulator/9297/`. The bridge uses explicit keys, certificate verification,
path-style S3, disabled proxies and one attempt per request. You do not need to
export AWS credentials or endpoint variables.

## Start the lab

In another terminal with the virtual environment active:

```bash
python3 lab/wait_ready.py
npm run lab
```

This creates the emulated bucket and binds the bridge to `127.0.0.1:8787`.
In another terminal:

```bash
npm run dev
```

Open http://127.0.0.1:5173. In **The Scenario Vault**:

1. Select a scenario and save its snapshot.
2. Change endpoint health and observe the changed illustrative route.
3. Restore the snapshot; the saved health states return.
4. Look for the actual `PutObject` / `GetObject` success message.
5. Try restoring a scenario you have not saved; expect an explicit error.

Each scenario has one saved slot; saving again replaces that slot. This is not
long-term storage. Stopping the emulator loses all snapshots. Stopping the bridge
must leave the rest of the game usable. The vault panel is excluded from production
builds, so public visitors do not need a local backend.

If using a different emulator port, set only `CRYPT_EMULATOR_PORT` for the bridge
and smoke test. Only numeric ports 1024–65535 are accepted. Vite uses a fixed 5173
port so the local-origin checks match. Do not expose either server to the network.

## Checks

```bash
npm test
npm run test:lab
npm run build
# Opt-in: requires the local emulator above
python3 lab/smoke.py
```

The smoke test creates the emulated bucket if needed and overwrites the
`quiet-night` slot with a synthetic fixture. Default CI runs offline unit tests and
a production build. Manually dispatching Local checks also runs a real emulator
round trip on the runner. Neither path uses AWS credentials or deploys AWS resources.

A 501 / unsupported-operation response is a failed integration test, not a
successful save. API fidelity depends on the emulator release. We verified only
the operations used by this feature; we do not claim IAM, routing, latency or
multi-region behavior was reproduced.

## Public static demo without AWS

After merging, select GitHub repository Settings → Pages → Source: GitHub Actions.
Manually run **Publish static demo** from main. It builds and publishes only `dist/`
to GitHub Pages and does not run the bridge, emulator or AWS provisioning. Relative
asset paths support the repository's Pages URL. No AWS role, access key or cloud
infrastructure is needed. This workflow has not been run as part of this PR.
GitHub hosting/Actions availability follows your GitHub plan; it creates no AWS charges.

## Kiro / Kiroween demo

This addition combines a spooky educational UI with a real local AWS SDK storage
exercise, a plausible extension of the Frankenstein direction. Keep the hosted
core demo working independently. Show the optional local round trip in the video
only if it works on your machine.

Implementation in this PR was produced with Codex, not Kiro. The tracked
`.kiro/specs/scenario-vault/` files are inputs for your next substantive Kiro
implementation/refinement session, not proof of Kiro use. Record actual Kiro
sessions, changes, spec decisions and hook results in `docs/KIRO_EVIDENCE.md`.
Insufficient Kiro use can disqualify a submission; this PR alone does not establish
eligibility. Confirm the current rules and do not invent tool-use claims.

## References

- [AWS Emulator Docker setup](https://docs.aws.amazon.com/emulator/latest/userguide/getting-started-docker.html)
- [AWS Emulator SDK setup](https://docs.aws.amazon.com/emulator/latest/userguide/point-sdk-to-emulator.html)
- [AWS Emulator fidelity](https://docs.aws.amazon.com/emulator/latest/userguide/fidelity.html)
- [Kiroween official rules](https://kiroween.devpost.com/rules)
