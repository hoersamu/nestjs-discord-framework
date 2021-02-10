# NestJS Bot Platform

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a><img src="https://cdn.pixabay.com/photo/2016/12/21/17/11/signe-1923369_960_720.png" alt="plus" width="100"><a href="https://discord.js.org/" target="blank"><img src="https://discord.js.org/static/logo-square.png" width ="140" alt="DiscordJs Logo"/>
</p>

<h1 align="center">A <a href="http://nestjs.com" target="blank">NestJS</a> service wrapper for <a href="http://discord.js.org" target="blank">Discord.js</a>!
  </h1>
  <p align="center">
  <a href="https://www.npmjs.com/package/nestjs-discord-framework"><img src="https://img.shields.io/npm/v/nestjs-discord-framework"/></a>
  <a href="http://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/license-MIT-brightgreen.svg"/></a>
  <a href="https://snyk.io/test/github/hoersamu/nestjs-discord-framework?targetFile=package.json"><img src="https://snyk.io/test/github/hoersamu/nestjs-discord-framework/badge.svg?targetFile=package.json"/></a>
  <img src="https://github.com/hoersamu/nestjs-discord-framework/workflows/CodeQL/badge.svg"/>
</p>
<p align="center">
</p>

### Installation

```bash
$ npm i --save nestjs-discord-framework
```

### Usage

> Version 1.0.0 is not supported and should be upgraded to v2.x immediately.

To use the Framework just import the `BotModule` in the root `AppModule` and supply the options.
The `forRoot()` method supports all the Discord.JS [ClientOptions](https://discord.js.org/#/docs/main/stable/typedef/ClientOptions).
In addition there are some extra configuration properties described below:

| Key      | Description                   |
| -------- | ----------------------------- |
| `token`  | The Discord Bot accesstoken   |
| `prefix` | The command prefix (optional) |

```typescript
BotModule.forRoot(options:BotOptions),
```

Asynchronous loading of the options is also possible.
One approach is to use a factory function:

```typescript
BotModule.forRootAsync({
  useFactory: (): BotOptions => ({
    token: 'your-token',
    prefix: '!',
  }),
});
```

The factory behaves like any other [asynchronous provider](https://docs.nestjs.com/fundamentals/async-providers) (e.g., it can be `async` and it's able to inject dependencies through `inject`):

```typescript
BotModule.forRootAsync({
  imports: [ConfigModule],
  useFactory: (configService: ConfigService): BotOptions => ({
    token: configService.get('bot-token'),
    prefix: configService.get('bot-prefix'),
  }),
  inject: [ConfigService],
});
```

Alternatively, you can use the `useClass` or `useExisting` syntax:

```typescript
BotModule.forRootAsync({
  useClass: BotConfigService,
});
```

### Registering Events

> Make sure that all classes using the `@BotEvent()` decorator are registered as providers

You can subscribe to Discord events by annotating a public method of a provider with the `@BotEvent(event:string)` Decorator.
The Parameter is the name of the event you want to listen to. You can find a full list of Events [here](https://discord.js.org/#/docs/main/stable/class/Client)

```typescript
@Injectable()
export class EventHandler {
  @BotEvent('guildMemberAdd')
  onGuildMemberAdd(...args: any[]): void {}
}
```

### Registering Commands

> Make sure that all classes using the `@BotCommand()` decorator are registered as providers

To register a command annotate a public provider method with the `@BotCommand(name:string)` Decorator.
The Parameter is the first index of the message content split by `" "` without the prefix.

```typescript
export class HelpCommand {
  @BotCommand('help')
  help(...args: any[]): void {}
}
```

#### Client-/Instance-Injection

You can inject the [Client](https://discord.js.org/#/docs/main/stable/class/Client) and the instance (`BotInstance`) into your providers and controllers.
Simply use the `@InjectBotClient()` and `@InjectBotInstance()` Decorators in the constructor:

```typescript
export class InjectClient {
  constructor(@InjectBotClient() private client) {}
}

export class InjectInstance {
  constructor(@InjectBotInstance() private instance) {}
}
```
