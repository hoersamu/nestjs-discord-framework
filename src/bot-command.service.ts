import { DiscoveryService } from "@nestjs-plus/discovery";
import { Inject, Injectable, Logger } from "@nestjs/common";
import { Message } from "discord.js";
import { BotOptions } from "./bot.config";
import { BOT_COMMAND, BOT_OPTIONS } from "./bot.constants";
import { DiscordInstance } from "./bot.instance";

type Route = { [key: string]: Function[] };

@Injectable()
export class BotCommandService {
	private logger = new Logger("BotCommands");
	private commands: Route = {};
	prefix: string;

	constructor(
		private readonly bot: DiscordInstance,
		@Inject(BOT_OPTIONS) options: BotOptions,
		private discover: DiscoveryService
	) {
		this.prefix = options.prefix || "";
	}

	handle(message: Message) {
		if (message.content.startsWith(this.prefix)) {
			const command = message.content.split(" ")[0];
			this.commands[command]?.forEach((handler) => handler(message));
		}
	}

	async loadCommands() {
		(await this.discover.providerMethodsWithMetaAtKey(BOT_COMMAND)).forEach(
			(command) => {
				const alias = command.meta as string;

				const instance = command.discoveredMethod.parentClass.instance;
				const handler = command.discoveredMethod.handler.bind(instance);

				if (this.commands[alias]) {
					this.commands[alias].push(handler);
				} else {
					this.commands[alias] = [handler];
					this.logger.log(`Registered handler for command ${alias}`);
				}
			}
		);

		this.bot.registerEvent("message", this.handle.bind(this));
	}
}
