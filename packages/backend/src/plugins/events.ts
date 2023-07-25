import {
  EventsBackend,
  HttpPostIngressEventPublisher,
} from '@backstage/plugin-events-backend';
import { Router } from 'express';
import { PluginEnvironment } from '../types';

import { BitbucketCloudEventRouter } from '@backstage/plugin-events-backend-module-bitbucket-cloud'

export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  const eventsRouter = Router();
  const bitbucketCloudEventRouter = new BitbucketCloudEventRouter();
  const http = HttpPostIngressEventPublisher.fromConfig({
    config: env.config,
    logger: env.logger,
    ingresses: {
      // github: {
      //   validator: createGithubSignatureValidator(env.config),
      // },
    },
  });
  http.bind(eventsRouter);

  await new EventsBackend(env.logger)
    .setEventBroker(env.eventBroker)
    .addPublishers(http, bitbucketCloudEventRouter)
    .addSubscribers(bitbucketCloudEventRouter)
    .start();

  return eventsRouter;
}

