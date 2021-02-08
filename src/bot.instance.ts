import { Inject, Injectable, Logger } from "@nestjs/common";
import { Client, ClientOptions } from "discord.js";
import { BOT_OPTIONS } from ".";
import { BotOptions } from "./bot.config";
import { BotEvents } from "./bot.events";
import { ClientNotInitializedExeption } from "./bot.exeptions";

export interface BotInstance {
	readonly config: any;

	client: any;

	createClient(): Client;
	initClient(): void | Promise<void>;

	registerEvent(
		name: keyof BotEvents,
		handler: Function
	): void | Promise<void>;
}

@Injectable()
export class DiscordInstance implements BotInstance {
	private logger = new Logger("Bot");
	private connectionTimeout: any;
	public config: BotOptions;

	client: Client;

	constructor(@Inject(BOT_OPTIONS) config) {
		this.config = config;
	}

	createClient(): Client {
		this.client = new Client(this.config as ClientOptions);
		return this.client;
	}

	async initClient(): Promise<void> {
		return new Promise<void>((resolve, reject) => {
			this.client.on("ready", async () => {
				clearTimeout(this.connectionTimeout);
				this.logger.log("Discord client connected successfully");
				resolve();
			});

			this.client.on("error", (error) => {
				this.logger.error(error);
			});

			this.connectionTimeout = setTimeout(() => {
				this.client.off("ready", () => {});
				this.logger.error(
					"Client seems to be unable to connect to the discord server"
				);
				reject();
			}, this.config.timeout);

			this.client.login(this.config.token);
		});
	}

	async registerEvent(name: keyof BotEvents, handler: Function) {
		if (!this.client) throw new ClientNotInitializedExeption();
		this.client.on(name, (...args: any[]) => handler(...args));
	}
}
