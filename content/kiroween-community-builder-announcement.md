# I’m joining Kiroween 2026 to explore cloud routing safely

As an AWS Community Builder in the Serverless category, I’m always looking for practical ways to turn an architecture question into something other people can learn from.

Recently, while studying AWS routing concepts, I found myself asking a simple question: **What could happen if I change how traffic is routed and the outcome isn’t what I expected?** It made me think about how we learn these services safely. Reading the documentation is important, but some ideas become easier to understand when we can see a scenario unfold.

That’s why I’ve decided to take part in the **Kiroween 2026 hackathon**.

I’m starting a project called **Route to the Crypt**: a small, interactive learning experience where people can explore selected cloud-routing and endpoint-health scenarios. The idea is to choose a scenario, change an endpoint’s health state, and see how a simple teaching model illustrates the result.

I want to be clear about the boundaries from the beginning: **my research so far is theoretical. I have not tested AWS Global Accelerator in a live application or environment.** Route to the Crypt will not connect to an AWS account, change real infrastructure, or claim to reproduce every detail of the service. I’ll check scenario explanations against public AWS documentation, link the sources, and label any simplifications in the app.

I’m also interested in using Kiro’s structured development features as part of the process. My plan is to define the requirements in a spec, use steering files to keep the project’s evidence and safety boundaries clear, and try a small hook for a repeatable development task. I’m at the beginning, so this is a plan rather than a report of results. After the hackathon, I’ll write a follow-up about what actually worked, what didn’t, and what I learned while building it.

For me, the goal is to make an architecture question easier to explore without pretending that a simplified demo is the same as a real AWS environment. If you teach or study cloud networking, what routing or failover scenario would you like to explore in a safe visual tool?

*I’m writing this as part of the Kiroween 2026 hackathon.*

### Links

- [Kiroween 2026 hackathon](https://kiroween.devpost.com/)
- [AWS Global Accelerator documentation](https://docs.aws.amazon.com/global-accelerator/latest/dg/what-is-global-accelerator.html)
- [Kiro specs documentation](https://kiro.dev/docs/specs/)
- [Kiro steering documentation](https://kiro.dev/docs/steering/)
- [Kiro hooks documentation](https://kiro.dev/docs/hooks/)
