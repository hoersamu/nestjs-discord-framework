import { DiscoveryModule } from '@nestjs-plus/discovery';
import { DynamicModule, Global, Module, Provider } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { BotCommandService } from './bot-command.service';
import { BotEventService } from './bot-event.service';
import {
  BotAsyncOptions,
  BotOptions,
  BotOptionsFactory,
} from './bot-module-options.interface';
import { BotInstance, ITestService } from './bot.instance';
import { BOT_CLIENT, BOT_INSTANCE, BOT_OPTIONS } from './constants';

export const clientFactory = {
  provide: BOT_CLIENT,
  useFactory: async (instance: ITestService) => {
    return instance.connect();
  },
  inject: [BOT_INSTANCE],
};

@Global()
@Module({ imports: [DiscoveryModule] })
export class BotModule {
  public static forRoot(options: BotOptions): DynamicModule {
    return {
      module: BotModule,
      providers: [
        {
          provide: BOT_OPTIONS,
          useValue: options,
        },
        { provide: BOT_INSTANCE, useClass: BotInstance },
        clientFactory,
        BotEventService,
        BotCommandService,
      ],
      exports: [clientFactory, BOT_INSTANCE],
    };
  }

  public static forRootAsync(options: BotAsyncOptions): DynamicModule {
    return {
      module: BotModule,
      imports: options.imports || [],
      providers: [
        this.createAsyncProviders(options),
        clientFactory,
        { provide: BOT_INSTANCE, useClass: BotInstance },
        BotEventService,
        BotCommandService,
      ],
      exports: [clientFactory, BOT_INSTANCE],
    };
  }

  private static createAsyncProviders(options: BotAsyncOptions): Provider {
    if (options.useFactory) {
      return {
        provide: BOT_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject || [],
      };
    }

    return {
      provide: BOT_OPTIONS,
      useFactory: async (optionsFactory: BotOptionsFactory) =>
        await optionsFactory.createTestConfigOptions(),
      inject: [options.useClass || options.useExisting],
    };
  }

  constructor(
    private readonly ref: ModuleRef,
    private readonly commandService: BotCommandService,
    private readonly eventService: BotEventService,
  ) {}

  async onModuleInit() {
    const bot = this.ref.get<string, BotInstance>(BOT_INSTANCE);

    await this.eventService.initializeEvents();
    await this.commandService.loadCommands();

    await bot.initClient();
  }
}
