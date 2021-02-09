import { DiscoveryService } from '@nestjs-plus/discovery';
import { Injectable, Logger } from '@nestjs/common';
import { InjectBotInstance } from './bot.decorators';
import { BotEvents } from './bot.events';
import { UnknownBotEvent } from './bot.exeptions';
import { BotInstance } from './bot.instance';
import { BOT_EVENT } from './constants';

@Injectable()
export class BotEventService {
  private logger = new Logger('BotEvent');

  constructor(
    @InjectBotInstance() private bot: BotInstance,
    private discover: DiscoveryService,
  ) {}

  async initializeEvents() {
    (await this.discover.providerMethodsWithMetaAtKey(BOT_EVENT)).forEach(
      (event) => {
        const instance = event.discoveredMethod.parentClass.instance;
        const handler = event.discoveredMethod.handler.bind(instance);

        if (!Object.keys(BotEvents).includes(event.meta as string))
          throw new UnknownBotEvent(
            `Event ${event.meta} is not defined. Check your spelling`,
          );
        this.bot.registerEvent(event.meta as keyof BotEvents, handler);
        this.logger.log(`Registered Handler for ${event.meta}`);
      },
    );
  }
}
