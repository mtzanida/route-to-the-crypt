# Route to the Crypt

An educational, interactive cloud-routing scenario simulator built for Kiroween 2026.

**Category:** Frankenstein  
**Status:** Early prototype, started during the Kiroween 2026 submission period.

## What it is

Route to the Crypt gives cloud learners a safe place to explore a few curated routing and endpoint-health scenarios. Change a scenario, inspect the illustrative traffic path, and read a plain-language debrief.

This is a deterministic educational model. It does not connect to AWS, deploy infrastructure, or claim to reproduce every AWS Global Accelerator behavior. Scenario rules will be checked against public AWS documentation and linked in the app before submission.

## Run locally

Requirements: Node.js 20 or newer.

```bash
npm install
npm run dev
```

Create a production build with `npm run build` and preview it with `npm run preview`.

## Kiro development notes

The `.kiro/` directory contains the product steering and spec. Keep it in the public repository. The optional Crew Debrief experiment is intentionally outside the core runtime; the main app must remain useful when that experiment is absent.

The initial scaffold was drafted with ChatGPT on October 31, 2026. Continue the feature work in Kiro and describe only Kiro actions that were actually used in the final submission.

## Optional Crew Debrief

The core app exports a versioned scenario snapshot as JSON. A separate Kiro Crew app may consume that snapshot and produce an extra learning debrief. It is a stretch feature, not a runtime dependency. If it is not completed, the core app and its built-in explanation still work.

## License

MIT. See [LICENSE](LICENSE).
