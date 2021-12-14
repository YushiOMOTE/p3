import * as functions from 'firebase-functions';
import * as express from 'express';
import { Request, Response } from 'express';
import { Bot } from './bot';
import { Config } from './config';

const cfg: Config = {
  name: functions.config().app.name,
  theme: functions.config().app.theme,
  line: {
    channelSecret: functions.config().line.secret,
    channelAccessToken: functions.config().line.token,
  },
  yahoo: {
    appid: functions.config().yahoo.appid,
  },
};

const p3 = new Bot(cfg);

const exp = express();

exp.post('/v1/webhook', p3.middleware(), (req: Request, res: Response) => {
  p3.handle(req, res);
});

export const app = functions.https.onRequest(exp);
