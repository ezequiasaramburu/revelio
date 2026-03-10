import dotenv from 'dotenv';
import { Worker, Job } from 'bullmq';
import IORedis from 'ioredis';
import { ReviewJobData } from './queue/jobs';
import { REVIEW_QUEUE_NAME } from './queue/constants';

dotenv.config();

function createRedisConnection() {
  const host = process.env.REDIS_HOST ?? 'localhost';
  const port = Number(process.env.REDIS_PORT) || 6379;
  return new IORedis({ host, port });
}

async function handleReviewJob(job: Job<ReviewJobData>): Promise<void> {
  const data = job.data;
  // Later phases will fetch diff, call LLM, and post review.
  // eslint-disable-next-line no-console
  console.log('Processing review job', {
    jobId: job.id,
    installationId: data.installationId,
    owner: data.owner,
    repo: data.repo,
    pullNumber: data.pullNumber,
    sha: data.sha,
  });
}

async function main(): Promise<void> {
  const connection = createRedisConnection();

  const worker = new Worker<ReviewJobData>(REVIEW_QUEUE_NAME, async job => handleReviewJob(job), {
    connection: connection as any,
    concurrency: 5,
  });

  worker.on('completed', job => {
    // eslint-disable-next-line no-console
    console.log('Job completed', { id: job.id });
  });

  worker.on('failed', (job, err) => {
    // eslint-disable-next-line no-console
    console.error('Job failed', { id: job?.id, err });
  });
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
main();

