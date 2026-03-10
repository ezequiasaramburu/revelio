## Contributing to Revelio

First off, thank you for taking the time to contribute — thoughtful contributions are what will make Revelio useful for real teams.

### Ground rules

- **No nitpicks**: Contributions should respect Revelio’s philosophy — focus on high-signal, real issues (bugs, security, logic, architecture), not style bikeshedding.
- **Production mindset**: Prefer small, well-scoped PRs that improve correctness, reliability, or clarity.
- **Tests and types**: Keep TypeScript strictness high and add/adjust tests when you change behavior.
- **Local ↔ AWS parity**: Changes to the local pipeline should keep the architecture compatible with the AWS CDK stack and vice versa.

### How to set up your dev environment

1. **Install dependencies**

```bash
git clone https://github.com/<your-org>/revelio.git
cd revelio
npm install
```

2. **Create a `.env`**

Copy `.env.example` to `.env` and fill in:

- GitHub App details (`GITHUB_APP_ID`, `GITHUB_APP_PRIVATE_KEY`, `GITHUB_WEBHOOK_SECRET`)
- Redis connection (`REDIS_HOST`, `REDIS_PORT` if non-default)
- LLM provider + API key(s) (`LLM_PROVIDER`, `ANTHROPIC_API_KEY` / `OPENAI_API_KEY` / `GEMINI_API_KEY`)

3. **Run locally**

In one terminal:

```bash
npm run docker:up
```

This starts Redis, the Fastify server, and the worker via Docker Compose.

Or, to run without Docker:

```bash
npm run dev      # Fastify server
npm run worker   # Queue worker
```

4. **Tests**

```bash
npm test
```

This runs a TypeScript build followed by Jest over the `tests/` directory.

### Contribution workflow

1. **Open an issue first** (recommended)
   - For non-trivial changes, open a GitHub issue describing:
     - What you want to change
     - Why it matters (bug, reliability, UX, infra, etc.)
     - Rough approach you plan to take

2. **Work on a feature branch**

```bash
git checkout -b feature/my-change
```

3. **Keep PRs focused**
   - One logical change per PR whenever possible.
   - Avoid mixing refactors with behavior changes unless they’re tightly coupled.
   - If you have to touch a lot of files (e.g., renames), call that out clearly in the description.

4. **Add or update tests**
   - For new behavior, add tests under `tests/` that cover:
     - Happy path
     - Key edge cases
     - Failure handling when appropriate
   - For refactors, keep existing tests passing and prefer adding coverage where it’s missing.

5. **Follow the existing style**
   - TypeScript strict mode, no `any`.
   - Absolute imports from `src/` where configured.
   - Keep comments focused on **why**, not what (the code should explain itself).

6. **Write a good PR description**
   - **What**: Brief summary of the change.
   - **Why**: The problem it solves or behavior it improves.
   - **How**: Any important implementation details or trade-offs.
   - **Testing**: How you tested (commands, scenarios).

### Good first contribution ideas

- **Tests and reliability**
  - Add tests for uncovered but important paths (e.g. error handling, edge cases in diff parsing).
  - Improve logging or error messages where they are vague or unhelpful.

- **Developer experience**
  - Small improvements to the README or `CONTRIBUTING.md` to make setup easier.
  - Better sample configs or example `.revelio.yml` patterns.

- **AWS infra polish**
  - Non-breaking improvements to the CDK stack (e.g. more precise IAM policies, clearer parameter names, tagging).

### Adding a new LLM provider

One of the primary extension points is supporting new LLMs.

- Implement the `LLMProvider` interface from `src/llm/types.ts`.
- Place your implementation under `src/llm/providers/<provider>.ts`.
- Wire it up in `src/llm/factory.ts` and extend tests in `tests/llm/factory.test.js`.
- Document any new required env vars in:
  - `.env.example`
  - `README.md` (LLM providers section)

### Code of conduct

Please be respectful and constructive in issues and PRs. Assume good intent, focus on the work, and remember that the goal is to make Revelio a genuinely useful, high-signal reviewer for everyone.

