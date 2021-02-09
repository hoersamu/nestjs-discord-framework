import { Inject, Injectable, Logger } from '@nestjs/common';
import { Client } from 'discord.js';
import { BotOptions } from './bot-module-options.interface';
import { BotEvents } from './bot.events';
import { ClientNotInitializedExeption } from './bot.exeptions';
import { BOT_OPTIONS } from './constants';

export interface ITestService {
  connect(): Client;
}

@Injectable()
export class BotInstance implements ITestService {
  private _discordClient: Client;
  private logger = new Logger('Bot');

  constructor(@Inject(BOT_OPTIONS) private _options: BotOptions) {
    if (!_options.timeout) _options.timeout = 10000;
  }

  connect(): Client {
    return this._discordClient
      ? this._discordClient
      : (this._discordClient = new Client(this._options));
  }

  async initClient(): Promise<void> {
    return new Promise<void>((resolve) => {
      this._discordClient.on('ready', async () => {
        this.logger.log('Discord _discordClient connected successfully');
        resolve();
      });

      this._discordClient.login(this._options.token).catch((error) => {
        this.logger.error(error);
      });
    });
  }

  async registerEvent(name: keyof BotEvents, handler: Function) {
    if (!this._discordClient) throw new ClientNotInitializedExeption();
    this._discordClient.on(name, (...args: any[]) => handler(...args));
  }
}
