```text
GitHub Event
    │
    ▼
[ Fastify :3000 ] ←── src/index.ts
[ webhook/handler ] validates HMAC signature
    │
    │ enqueue(ReviewJobData)
    ▼
[ BullMQ Queue ] ←── src/queue/queue.ts
[ "review" ] local: Redis / AWS: SQS
    │
    │ job picked up
    ▼
[ Worker Process ] ←── src/worker.ts
    │
    ├──▶ [ github/client ] fetch PR diff
    ├──▶ [ config/loader ] load .revelio.yml from repo
    ├──▶ [ diff/chunker ] split diff into chunks
    │
    └──▶ [ llm/factory ] createProvider() from env
    │
    ├── ClaudeProvider
    ├── OpenAIProvider
    └── GeminiProvider
    │
    ▼
[ review/prompt ] build prompts per chunk
[ review/parser ] JSON → ReviewComment[]
[ review/poster ] post to GitHub PR
```
