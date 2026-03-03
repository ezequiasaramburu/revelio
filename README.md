revelio/
│
├── src/ # All application source code
│ │
│ ├── index.ts # 🚀 Fastify server entrypoint
│ ├── worker.ts # ⚙️ BullMQ worker entrypoint
│ │
│ ├── webhook/
│ │ └── handler.ts # Receives & validates GitHub webhook events
│ │
│ ├── queue/
│ │ ├── queue.ts # BullMQ queue definition + enqueue helper
│ │ └── jobs.ts # Job type definitions (ReviewJobData, etc.)
│ │
│ ├── github/
│ │ ├── client.ts # Octokit wrapper (GitHub App auth)
│ │ └── diff.ts # Fetches raw PR diff from GitHub API
│ │
│ ├── diff/
│ │ └── chunker.ts # Splits large diffs into LLM-sized chunks
│ │
│ ├── llm/
│ │ ├── types.ts # LLMProvider interface — the core abstraction
│ │ ├── factory.ts # createProvider() — reads env, returns provider
│ │ └── providers/
│ │ ├── claude.ts # Anthropic Claude implementation
│ │ ├── openai.ts # OpenAI GPT implementation
│ │ └── gemini.ts # Google Gemini implementation
│ │
│ ├── review/
│ │ ├── prompt.ts # Builds system + user prompts
│ │ ├── parser.ts # Parses LLM JSON → ReviewComment[]
│ │ └── poster.ts # Posts review comments back to GitHub
│ │
│ └── config/
│ ├── schema.ts # Zod schema for .revelio.yml
│ └── loader.ts # Loads + validates per-repo config
│
├── infra/ # AWS CDK (TypeScript) — mirrors local arch
│ ├── bin/
│ │ └── app.ts # CDK app entrypoint
│ └── lib/
│ └── revelio-stack.ts # API Gateway + SQS + Lambda/ECS + SSM
│
├── tests/
│ ├── diff/
│ │ └── chunker.test.ts
│ ├── llm/
│ │ └── factory.test.ts
│ └── review/
│ └── parser.test.ts
│
├── docker/
│ └── docker-compose.yml # Redis + server + worker for local dev
│
├── .revelio.yml.example # Per-repo config template
├── .env.example # Env variables template
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
