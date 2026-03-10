export interface ReviewJobData {
  installationId: number;
  owner: string;
  repo: string;
  pullNumber: number;
  sha: string;
}

export function makeReviewJobId(data: ReviewJobData): string {
  const shortSha = data.sha.slice(0, 8);
  return `${data.owner}/${data.repo}#${data.pullNumber}@${shortSha}`;
}

