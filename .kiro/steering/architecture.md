# Architecture steering

- Frontend: React, TypeScript, and Vite.
- Store curated scenario data locally and run a deterministic scenario model in the browser.
- Keep UI components separate from scenario rules and scenario content.
- Export a versioned JSON snapshot so optional tools can consume it without coupling to the main runtime.
- Owner-authorized extension: an optional loopback-only Python bridge may use generated AWS Emulator credentials and S3 APIs for scenario snapshots. Never use real AWS credentials, public AWS endpoints, or cloud fallback. Keep the production app static and independent of this lab.
- The optional Kiro Crew experiment belongs in a separate app/repository and must not be imported by the main app.
- Keep `.kiro/` tracked in Git; do not add it to `.gitignore`.
