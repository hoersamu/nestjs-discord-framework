import { Inject, SetMetadata } from '@nestjs/common';
import { ClientEvents } from 'discord.js';
import { BOT_CLIENT, BOT_COMMAND, BOT_EVENT, BOT_INSTANCE } from './constants';

export const InjectBotClient = () => Inject(BOT_CLIENT);
export const InjectBotInstance = () => Inject(BOT_INSTANCE);

export const BotCommand = (name: string) => SetMetadata(BOT_COMMAND, name);
export const BotEvent = (name: keyof ClientEvents) =>
  SetMetadata(BOT_EVENT, name);
