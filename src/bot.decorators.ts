import { Inject, SetMetadata } from "@nestjs/common";
import { ClientEvents } from "discord.js";
import {
	BOT_CLIENT,
	BOT_COMMAND_NAME,
	BOT_EVENT,
	BOT_HANDLER_CLASS,
} from "./bot.constants";

export class Bot {
	/**
	 *
	 */
	Service = () => SetMetadata(BOT_HANDLER_CLASS, BOT_HANDLER_CLASS);

	/**
	 * Injects the DiscordClient into your class
	 */
	InjectClient = () => Inject(BOT_CLIENT);

	//export const InjectInstance = () => Inject(BOT_INSTANCE);

	/**
	 * Function-Decorator that binds the function to the coresponding Event
	 * @param event
	 */
	Event = <K extends keyof ClientEvents>(event: K) =>
		SetMetadata(BOT_EVENT, event);

	/**
	 * Function-Decorator that binds allows you to bind to messages beginning with the commandname
	 * @param commandName
	 */
	Command = (commandName: string) =>
		SetMetadata(BOT_COMMAND_NAME, commandName);
}
