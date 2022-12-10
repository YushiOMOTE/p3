import { Client, Event } from './client';
import { Config } from './config';
import { Translator } from './translator';
import { AI } from './openai';
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
  ai: AI;

  constructor(config: Config) {
    console.log(`create bot ${config.name}`);
    this.config = config;
    this.client = new Client(config);
    this.translator = new Translator(config);
    this.ai = new AI(config);
  }

  async cmdIf(event: Event, msg: string): Promise<boolean> {
    if (msg.startsWith(`@${this.config.name} `)) {
      const question = msg.split(' ').slice(1).join(' ');

      console.log(`asking: ${question}`);

      const answer = await this.ai.ask(question);

      console.log(`answer: ${answer}`);

      if (answer !== undefined) {
        await this.reply(event, answer.trim());
      } else {
        await this.reply(event, ':)');
      }

      return true;
    }

    return false;
  }

  async handleEvent(event: Event) {
    const msg = trim(event.message);

    console.log(`msg: ${msg}`);

    if (await this.cmdIf(event, msg)) {
      return;
    }

    const translated = await this.translator.translate(msg);

    if (translated) {
      await this.reply(event, translated);
    }
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
