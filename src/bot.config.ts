import { ClientOptions } from 'discord.js';

export interface BotOptions extends ClientOptions {
	token: string;
	prefix?: string;
	timeout?: number;
}
