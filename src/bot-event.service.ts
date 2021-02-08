import { DiscoveryService } from '@nestjs-plus/discovery';
import { Injectable, Logger } from '@nestjs/common';
import { BOT_EVENT } from './bot.constants';
import { InjectBotInstance } from './bot.decorators';
import { BotInstance } from './bot.instance';

@Injectable()
export class BotEventService {
	private logger = new Logger('BotEvent');

	constructor(@InjectBotInstance() private bot: BotInstance, private discover: DiscoveryService) {}

	async initializeEvents() {
		(await this.discover.providerMethodsWithMetaAtKey(BOT_EVENT)).forEach((event) => {
			const instance = event.discoveredMethod.parentClass.instance;
			const handler = event.discoveredMethod.handler.bind(instance);

			this.bot.registerEvent(event.meta as string, handler);
			this.logger.log(`Registered Handler for ${event.meta}`);
		});
	}
}
