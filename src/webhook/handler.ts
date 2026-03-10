import { FastifyReply, FastifyRequest } from 'fastify';
import { createHmac, timingSafeEqual } from 'crypto';
import { createReviewQueue, enqueueReview } from '../queue/queue';
import { ReviewJobData } from '../queue/jobs';
import { GITHUB_EVENT_PULL_REQUEST } from './constants';

const queue = createReviewQueue();

function verifySignature(
  payload: string,
  signatureHeader: string | string[] | undefined,
  secret: string | undefined,
): boolean {
  if (!secret) return true;
  if (!signatureHeader || Array.isArray(signatureHeader)) return false;

  const expected = createHmac('sha256', secret).update(payload).digest('hex');
  const expectedHeader = `sha256=${expected}`;

  const received = Buffer.from(signatureHeader);
  const expectedBuf = Buffer.from(expectedHeader);

  if (received.length !== expectedBuf.length) return false;

  return timingSafeEqual(received, expectedBuf);
}

export async function webhookHandler(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  const event = request.headers['x-github-event'];
  const delivery = request.headers['x-github-delivery'];
  const signature = request.headers['x-hub-signature-256'];

  const secret = process.env.GITHUB_WEBHOOK_SECRET;
  const rawPayload = JSON.stringify(request.body ?? {});

  if (!verifySignature(rawPayload, signature, secret)) {
    request.log.warn({ event, delivery }, 'Invalid GitHub webhook signature');
    reply.code(401).send();
    return;
  }

  request.log.info({ event, delivery }, 'Received GitHub webhook');

  if (event !== GITHUB_EVENT_PULL_REQUEST) {
    reply.code(204).send();
    return;
  }

  const body = request.body as any;
  const pr = body.pull_request;
  const installationId = body.installation?.id;

  if (!pr || !installationId) {
    request.log.warn({ payload: body }, 'Ignoring webhook without PR or installation');
    reply.code(400).send();
    return;
  }

  const job: ReviewJobData = {
    installationId,
    owner: body.repository.owner.login,
    repo: body.repository.name,
    pullNumber: pr.number,
    sha: pr.head.sha,
  };

  await enqueueReview(queue, job);
  request.log.info({ jobId: `${job.owner}/${job.repo}#${job.pullNumber}` }, 'Enqueued review job');

  reply.code(202).send();
}


