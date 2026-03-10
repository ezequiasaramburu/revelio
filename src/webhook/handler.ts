import { FastifyReply, FastifyRequest } from 'fastify';
import { createReviewQueue, enqueueReview } from '../queue/queue';
import { ReviewJobData } from '../queue/jobs';
import { GITHUB_EVENT_PULL_REQUEST } from './constants';

const queue = createReviewQueue();

export async function webhookHandler(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  const event = request.headers['x-github-event'];
  const delivery = request.headers['x-github-delivery'];

  request.log.info({ event, delivery }, 'Received GitHub webhook');

  if (event !== GITHUB_EVENT_PULL_REQUEST) {
    reply.code(204).send();
    return;
  }

  const payload = request.body as any;
  const pr = payload.pull_request;
  const installationId = payload.installation?.id;

  if (!pr || !installationId) {
    request.log.warn({ payload }, 'Ignoring webhook without PR or installation');
    reply.code(400).send();
    return;
  }

  const job: ReviewJobData = {
    installationId,
    owner: payload.repository.owner.login,
    repo: payload.repository.name,
    pullNumber: pr.number,
    sha: pr.head.sha,
  };

  await enqueueReview(queue, job);
  request.log.info({ jobId: `${job.owner}/${job.repo}#${job.pullNumber}` }, 'Enqueued review job');

  reply.code(202).send();
}


