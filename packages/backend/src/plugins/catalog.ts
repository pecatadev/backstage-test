import { CatalogBuilder } from '@backstage/plugin-catalog-backend';
import { CatalogClient } from '@backstage/catalog-client';
import { ScaffolderEntitiesProcessor } from '@backstage/plugin-scaffolder-backend';
import { Router } from 'express';
import { PluginEnvironment } from '../types';
import { BitbucketCloudEntityProvider } from '@backstage/plugin-catalog-backend-module-bitbucket-cloud';
import { DemoEventBasedEntityProvider } from './DemoEventBasedEntityProvider';
export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  const builder = await CatalogBuilder.create(env);
  builder.setProcessingIntervalSeconds(1800);
  builder.addProcessor(new ScaffolderEntitiesProcessor());
  const demoProvider = new DemoEventBasedEntityProvider({ logger: env.logger, topics: ['example'], eventBroker: env.eventBroker });
  builder.addEntityProvider(demoProvider);
  const bitbucketCloudProvider = BitbucketCloudEntityProvider.fromConfig(
    env.config,
    {
      catalogApi: new CatalogClient({ discoveryApi: env.discovery }),
      logger: env.logger,
      scheduler: env.scheduler,
      tokenManager: env.tokenManager,
    },
  );
  env.eventBroker.subscribe(bitbucketCloudProvider);
  builder.addEntityProvider(bitbucketCloudProvider);

  const { processingEngine, router } = await builder.build();
  await processingEngine.start();
  router.post('api/events/http/topics/bitbucketCloud', async (req, _res) => {
    console.log( ' _res: ', _res, ' -req: ', req)
  })
  return router;
}
