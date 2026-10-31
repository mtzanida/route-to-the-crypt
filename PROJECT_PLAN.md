# Route to the Crypt — Project Plan

## North star

Build a complete, memorable learning experience for cloud learners who want to reason about traffic-routing failure scenarios before touching a real environment.

**Competition target:** overall prize plus Best Demo. This is an ambition, not a forecast. Keep the Frankenstein category as the project fit, while optimizing the product against every judging criterion.

**Starting point:** the initial scaffold was drafted with ChatGPT on October 31, 2026. For hackathon eligibility, continue substantive specification, implementation, and refinement in Kiro; keep an accurate record of which Kiro features were actually used and do not describe this starter scaffold as Kiro-built.

## Product idea

Route to the Crypt is a spooky control-room simulator. A learner chooses a curated scenario, changes an endpoint health state, watches the illustrative route update, and gets a short explanation of the outcome and the model's assumptions.

It is not a production emulator and will not use AWS credentials or make live AWS changes. All scenario behavior is local and deterministic. Every AWS-specific claim must be verified against official documentation and linked in the final app.

## Audience and problem

- Audience: AWS learners and cloud engineers who need a visual way to reason about routing and endpoint health.
- Problem: routing explanations are often abstract; experimenting in a real account can feel risky or costly.
- Value: safe, repeatable, visual scenarios with a transparent explanation of what is simplified.

## MVP scope

1. Scenario picker with three curated scenarios.
2. Two or three endpoint cards grouped by fictional region.
3. Health-state control for the active scenario.
4. Animated or clearly highlighted illustrative traffic path.
5. Outcome panel with explanation, assumptions, and source links.
6. Export current scenario snapshot as versioned JSON.
7. Responsive, polished haunted-control-room visual design.

## Optional stretch: Crew Debrief

Create a separate Kiro Crew app/repository that accepts the exported scenario JSON and produces a short learning debrief. The core app will not import Crew SDK packages, require a Crew runtime, or wait on this integration. Build this only after the main app is complete. If it is not ready, leave the export feature in place and omit Crew from the submission.

## Judging strategy

| Criterion | Evidence in the project |
|---|---|
| Potential impact | Clear learner audience and a safe, reusable practice tool |
| Technical implementation | Deterministic scenario engine, documented Kiro specs/steering, useful hook |
| Design | Readable haunted control room, coherent route visualization, mobile layout |
| Innovation | Combines cloud-routing concepts with interactive incident scenarios |
| Presentation | A concise end-to-end demo: choose, change, observe, understand |

## Repository structure

```text
route-to-the-crypt/
├── .kiro/
│   ├── steering/                 # Product, architecture, evidence rules
│   ├── specs/route-simulator/     # Requirements, design, tasks
│   └── hooks/                    # Optional quality-of-life automation
├── public/
├── src/
│   ├── components/               # Scenario controls, route view, debrief
│   ├── data/scenarios.ts         # Curated, cited scenario definitions
│   ├── lib/                      # Deterministic model and JSON export
│   ├── App.tsx
│   ├── main.tsx
│   └── styles.css
├── optional-crew-debrief/        # Notes only; later becomes a separate repo
├── LICENSE
├── PROJECT_PLAN.md
└── README.md
```

## Timeline — Thessaloniki time

| Date | Milestone | Definition of done |
|---|---|---|
| Oct 31–Nov 2 | Scope and Kiro setup | Repo name, audience, MVP, `.kiro` steering and spec are clear |
| Nov 3–8 | Source-backed scenario design | Three scenarios and limitations reviewed against AWS docs |
| Nov 9–15 | Core interface | Scenario selection, controls, route view, and export work locally |
| Nov 16–22 | Complete learning flow | Outcome explanations, source links, and mobile layout are in place |
| Nov 23–26 | Design and Kiro evidence | Polish UI; document how specs, steering, and hooks helped |
| Nov 27–Dec 1 | Submission assets | Public deploy, screenshots, blog article, social post; request Kiro credits by Dec 1, 22:00 |
| Dec 2–3 | Demo and submission | Public YouTube demo under 3 minutes; complete Devpost fields |
| Dec 4 | Buffer | Final review and submit before midnight Greece time |

The schedule leaves the first half lighter around the SAP Professional exam on Nov 16. Aim for short sessions before the exam and more build time afterward.

## Submission checklist

- New work created after the Kiroween submission period opened on Oct 30.
- Public GitHub repository with an open-source license and visible `.kiro/` directory.
- Public, working app and setup instructions.
- English Devpost description and Kiro usage write-up.
- Public YouTube demo shorter than three minutes.
- Blog prize entry, if pursued, published during the submission period and explicitly mentions Kiroween 2026.
- Social Blitz post, if pursued, begins with `#KiroweenHackathon26`.
- Optional Crew app is a separate, self-contained repo and is never required by the main app.

## Writing plan

1. **Now — announcement:** explain why I joined Kiroween, introduce the planned learning tool, and be clear that the Global Accelerator research is theoretical and has not been tested in a live application or environment.
2. **After the hackathon — retrospective:** report what I actually built, where Kiro specs/steering/hooks helped or got in the way, which assumptions changed after checking AWS documentation, what worked, what failed, and what I would change next time. Do not draft conclusions before the work is done.
