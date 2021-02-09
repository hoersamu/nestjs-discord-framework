import { Inject, SetMetadata } from '@nestjs/common';
import { ClientEvents } from 'discord.js';
import { BOT_CLIENT, BOT_COMMAND, BOT_EVENT, BOT_INSTANCE } from './constants';

export const InjectBotClient = () => Inject(BOT_CLIENT);
export const InjectBotInstance = () => Inject(BOT_INSTANCE);

export const BotCommand = (command: string) =>
  SetMetadata(BOT_COMMAND, command);
export const BotEvent = (event: keyof ClientEvents) =>
  SetMetadata(BOT_EVENT, event);
