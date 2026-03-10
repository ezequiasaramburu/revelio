export const GITHUB_EVENT_PULL_REQUEST = 'pull_request' as const;

export type GitHubWebhookEvent = typeof GITHUB_EVENT_PULL_REQUEST | string;

