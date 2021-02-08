import { Logger } from '@nestjs/common';
import { Client, ClientEvents, ClientOptions } from 'discord.js';
import { BotOptions } from './bot.config';
import { ClientNotInitializedExeption } from './bot.exeptions';

export abstract class BotInstance {
	abstract readonly config: any;

	abstract client: any;

	abstract createClient(config: typeof BotInstance.prototype.config): void;
	abstract initClient(): void | Promise<void>;

	abstract registerEvent(name: string, handler: Function): void | Promise<void>;
}

export class DiscordInstance extends BotInstance {
	private logger = new Logger('Bot');
	private connectionTimeout: NodeJS.Timeout;
	public config: BotOptions;

	client: Client;

	createClient(config: BotOptions): void {
		this.client = new Client(config as ClientOptions);
		this.config = config;
	}

	async initClient(): Promise<void> {
		return new Promise<void>((resolve, reject) => {
			this.client.on('ready', async () => {
				clearTimeout(this.connectionTimeout);
				this.logger.log('Discord client connected successfully');
				resolve();
			});

			this.client.on('error', (error) => {
				this.logger.error(error);
			});

			this.connectionTimeout = setTimeout(() => {
				this.client.off('ready', () => {});
				this.logger.error('Client seems to be unable to connect to the discord server');
				reject();
			}, this.config.timeout);

			this.client.login(this.config.token);
		});
	}

	async registerEvent(name: keyof ClientEvents, handler: Function) {
		if (!this.client) throw new ClientNotInitializedExeption();
		this.client.on(name, (...args: any[]) => handler(...args));
	}
}
