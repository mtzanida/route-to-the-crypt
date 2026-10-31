# Architecture steering

- Frontend: React, TypeScript, and Vite.
- Store curated scenario data locally and run a deterministic scenario model in the browser.
- Keep UI components separate from scenario rules and scenario content.
- Export a versioned JSON snapshot so optional tools can consume it without coupling to the main runtime.
- Do not add a backend, AWS credentials, AWS SDK, or paid service unless the owner explicitly changes scope.
- The optional Kiro Crew experiment belongs in a separate app/repository and must not be imported by the main app.
- Keep `.kiro/` tracked in Git; do not add it to `.gitignore`.
