import { v2 } from '@google-cloud/translate';
import { Config } from './config';
import * as morse from 'morse-decoder';

const POLISH = 'pl';
const CHINESE = 'zh-CN';
const JAPANESE = 'ja';
const HINDI = 'hi';
const ENGLISH = 'en';
const MALAY = 'ms';
const BENGALI = 'bn';
const MORSE = 'morse';

function isMorse(msg: string): boolean {
  return msg.match(/^[.\-/ ]+$/g) !== null;
}

function shuffleArray(array: string[]): string[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
}

function remove(array: string[], item: string) {
  const index = array.indexOf(item);
  if (index > -1) {
    array.splice(index, 1);
  }
}

export class Translator {
  config: Config;
  translation: v2.Translate;

  constructor(config: Config) {
    this.config = config;
    this.translation = new v2.Translate({
      projectId: process.env.GCLOUD_PROJECT,
    });
  }

  async translate(
    msg: string,
    source: string,
    target: string,
  ): Promise<string> {
    if (target === MORSE) {
      const translate = await this.translate(msg, source, ENGLISH);
      return morse.encode(translate);
    } else if (source == MORSE) {
      return await this.translate(morse.decode(msg), ENGLISH, target);
    }
    const [translation] = await this.translation.translate(msg, target);
    return translation;
  }

  async detect(msg: string): Promise<string> {
    const isDetectResult = (x: any): x is v2.DetectResult => {
      return (x as v2.DetectResult).language !== undefined;
    };

    if (isMorse(msg)) {
      return MORSE;
    }
    const [detection] = await this.translation.detect(msg);
    if (isDetectResult(detection)) {
      return detection.language;
    } else {
      return 'unknown';
    }
  }

  async translateAll(msg: string): Promise<string> {
    const langs = shuffleArray([
      POLISH,
      CHINESE,
      HINDI,
      JAPANESE,
      MALAY,
      BENGALI,
      MORSE,
    ]);

    const src = await this.detect(msg);

    remove(langs, src);

    let output = '';
    for (const lang of [ENGLISH, langs[0]]) {
      const translation = await this.translate(msg, src, lang);
      output += translation + '\n';
    }
    return output;
  }
}
