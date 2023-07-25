import {
  EntityProvider,
  EntityProviderConnection,
} from '@backstage/plugin-catalog-node';
import {
  EventBroker,
  EventParams,
  EventSubscriber,
} from '@backstage/plugin-events-node';
import { Logger } from 'winston';

export class DemoEventBasedEntityProvider
  implements EntityProvider, EventSubscriber
{
  private readonly logger: Logger;
  private readonly topics: string[];

  constructor(opts: {
    eventBroker: EventBroker;
    logger: Logger;
    topics: string[];
  }) {
    const { eventBroker, logger, topics } = opts;
    console.log('this: ', this)
    this.logger = logger;
    this.topics = topics;
    eventBroker.subscribe(this);
  }

  async onEvent(params: EventParams): Promise<void> {
    console.log('PARAMS: ', params)
    this.logger.info(
      `receieved: topic=${params.topic}, metadata=${JSON.stringify(
        params.metadata,
      )}, payload=${JSON.stringify(params.eventPayload)}`,
    );
  }

  supportsEventTopics(): string[] {
    console.log('here: ')
    return this.topics;
  }

  async connect(_: EntityProviderConnection): Promise<void> {
    console.log('connect: ')

    // not doing anything here
  }

  getProviderName(): string {
    return DemoEventBasedEntityProvider.name;
  }
}