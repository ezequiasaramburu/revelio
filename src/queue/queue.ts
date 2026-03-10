import { Queue, JobsOptions } from 'bullmq';
import IORedis from 'ioredis';
import { ReviewJobData, makeReviewJobId } from './jobs';
import { REVIEW_QUEUE_NAME } from './constants';

function createRedisConnection() {
  const host = process.env.REDIS_HOST ?? 'localhost';
  const port = Number(process.env.REDIS_PORT) || 6379;
  return new IORedis({ host, port });
}

export function createReviewQueue(): Queue<ReviewJobData> {
  const connection = createRedisConnection();
  return new Queue<ReviewJobData>(REVIEW_QUEUE_NAME, { connection } as any);
}

export async function enqueueReview(
  queue: Queue<ReviewJobData>,
  data: ReviewJobData,
  options: JobsOptions = {},
): Promise<void> {
  const jobId = makeReviewJobId(data);
  await queue.add(REVIEW_QUEUE_NAME, data, {
    jobId,
    attempts: 3,
    backoff: { type: 'exponential', delay: 1000 },
    removeOnComplete: 1000,
    removeOnFail: 1000,
    ...options,
  });
}

