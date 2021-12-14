import { Client, Event } from './client';
import { Config } from './config';
import { Translator } from './translator';
import { Request, Response } from 'express';
import * as admin from 'firebase-admin';

admin.initializeApp();

function trim(text: string): string {
  return text.replace(/^\s+|\s+$/g, '');
}

export class Bot {
  config: Config;
  client: Client;
  translator: Translator;

  constructor(config: Config) {
    console.log(`create bot ${config.name}`);
    this.config = config;
    this.client = new Client(config);
    this.translator = new Translator(config);
  }

  async cmdIf(event: Event, msg: string): Promise<boolean> {
    if (msg.startsWith(`@${this.config.name} `)) {
      const tokens = msg.split(' ');

      console.log(`command: ${tokens}`);
      await this.cmd(event, tokens[1], tokens.slice(2));
      return true;
    }

    return false;
  }

  async cmd(event: Event, cmd: string, args: string[]) {
    const help = `Usage:

@${this.config.name} command

Commands:

* about: About this bot.
* help: List available commands.`;

    switch (cmd) {
      case 'about':
        await this.reply(event, 'This bot helps learning Japanese');
        break;

      case 'help':
        await this.reply(event, help);
        break;

      default:
        await this.reply(event, ':)');
        break;
    }
  }

  async handleEvent(event: Event) {
    const msg = trim(event.message);

    console.log(`msg: ${msg}`);

    if (await this.cmdIf(event, msg)) {
      return;
    }

    const translated = await this.translator.translateAll(msg);
    await this.reply(event, translated);
  }

  async reply(event: Event, msg: string) {
    await this.client.reply(event, `${msg} ${this.config.theme}`);
  }

  middleware() {
    return this.client.middleware();
  }

  handle(req: Request, res: Response) {
    Promise.all(
      this.client.parse(req.body).map(async (event: Event) => {
        await this.handleEvent(event);
      }),
    ).then((result: any) => res.json(result));
  }
}
