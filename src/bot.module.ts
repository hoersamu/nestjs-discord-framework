import { DiscoveryModule } from '@nestjs-plus/discovery';
import { DynamicModule, Global, Module, Provider } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { BotCommandService } from './bot-command.service';
import { BotEventService } from './bot-event.service';
import { BotOptions } from './bot.config';
import { BOT_CLIENT, BOT_INSTANCE, BOT_OPTIONS } from './bot.constants';
import { BotInstance, DiscordInstance } from './bot.instance';

@Global()
@Module({ imports: [DiscoveryModule] })
export class BotModule {
	static forRoot(options: BotOptions): DynamicModule {
		const instance = new DiscordInstance();

		instance.createClient(options);

		const providers: Provider[] = [
			{ provide: BOT_OPTIONS, useValue: options || {} },
			{
				provide: BOT_CLIENT,
				useFactory: () => instance.client
			},
			{ provide: BOT_INSTANCE, useValue: instance },
			BotCommandService,
			BotEventService
		];

		return {
			module: BotModule,
			providers: providers,
			exports: providers
		};
	}

	constructor(
		private readonly ref: ModuleRef,
		private readonly commandService: BotCommandService,
		private readonly eventService: BotEventService
	) {}

	async onModuleInit() {
		const bot = this.ref.get<string, BotInstance>(BOT_INSTANCE);

		await this.eventService.initializeEvents();
		await this.commandService.loadCommands();

		await bot.initClient();
	}
}
