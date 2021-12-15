import {
  middleware,
  WebhookEvent,
  WebhookRequestBody,
  Client as LineClient,
} from '@line/bot-sdk';
import { Config } from './config';

export class Event {
  replyToken: string;
  message: string;

  constructor(replyToken: string, message: string) {
    this.replyToken = replyToken;
    this.message = message;
  }
}

export class Client {
  config: Config;
  client: LineClient;

  constructor(config: Config) {
    this.config = config;
    this.client = new LineClient(config.line);
  }

  middleware() {
    return middleware(this.config.line);
  }

  parse(body: WebhookRequestBody): Event[] {
    const isEvent = (event: Event | undefined): event is Event => {
      return event !== undefined;
    };
    return body.events
      .map((event: WebhookEvent) => this.parseEvent(event))
      .filter(isEvent);
  }

  parseEvent(event: WebhookEvent): Event | undefined {
    console.log(event);
    if (event.type !== 'message' || event.message.type !== 'text') {
      return;
    }
    return new Event(event.replyToken, event.message.text);
  }

  async reply(event: any, msg: string) {
    await this.client.replyMessage(event.replyToken, {
      type: 'text',
      text: msg,
    });
  }
}
