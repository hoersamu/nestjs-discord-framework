import { DiscoveryModule } from "@nestjs-plus/discovery";
import { DynamicModule, Global, Module } from "@nestjs/common";
import { ModuleRef } from "@nestjs/core";
import { BotCommandService } from "./bot-command.service";
import { BotEventService } from "./bot-event.service";
import { BotOptions } from "./bot.config";
import { BOT_CLIENT, BOT_INSTANCE, BOT_OPTIONS } from "./bot.constants";
import { BotInstance, DiscordInstance } from "./bot.instance";

export const connectionFactory = {
	provide: BOT_CLIENT,
	useFactory: async (discordInstance: DiscordInstance) => {
		return discordInstance.createClient();
	},
	inject: [DiscordInstance],
};

@Global()
@Module({ imports: [DiscoveryModule] })
export class BotModule {
	static forRoot(options: BotOptions): DynamicModule {
		return {
			module: BotModule,
			providers: [
				{ provide: BOT_OPTIONS, useValue: options },
				//connectionFactory,
				DiscordInstance,
				BotCommandService,
				BotEventService,
			],
			exports: [
				//{ provide: BOT_CLIENT, useExisting: connectionFactory },
				//{ provide: BOT_INSTANCE, useClass: DiscordInstance },
			],
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
