import { ModuleMetadata, Type } from '@nestjs/common';
import { ClientOptions } from 'discord.js';

export interface BotOptions extends ClientOptions {
  token: string;
  timeout?: number;
  prefix?: string;
}

export interface BotOptionsFactory {
  createTestConfigOptions: () => Promise<BotOptions> | BotOptions;
}

export interface BotAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  inject?: any[];
  useExisting?: Type<BotOptionsFactory>;
  useClass?: Type<BotOptionsFactory>;
  useFactory?: (...args: any[]) => Promise<BotOptions> | BotOptions;
}
