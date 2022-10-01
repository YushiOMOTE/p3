import { v2 } from '@google-cloud/translate';
import { Config } from './config';
import * as morse from 'morse-decoder';

const ENGLISH = 'en';
const MORSE = 'morse';
const LANGS = [
  'pl', // Polish
  'zh-CN', // Chinese
  'ja', // Japanese
  'hi', // Hindi
  'ms', // Malay
  'bn', // Bengali
  ENGLISH, // English
  // MORSE, // Morse (disabled)
];

function isMorse(msg: string): boolean {
  return msg.match(/^[.\-/ ]+$/g) !== null;
}

function pickRandom(array: string[]): string {
  return array[Math.floor(Math.random() * array.length)];
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

  async translateOne(
    msg: string,
    source: string,
    target: string,
  ): Promise<string> {
    // Handle Morse
    if (target === MORSE) {
      const translate = await this.translateOne(msg, source, ENGLISH);
      return morse.encode(translate);
    } else if (source == MORSE) {
      return await this.translateOne(morse.decode(msg), ENGLISH, target);
    }

    // Handle normal natural languages
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

  async translate(msg: string): Promise<string> {
    const src = await this.detect(msg);

    if (src === ENGLISH) {
      // Don't translate from English
      return '';
    }

    const exclude = [ENGLISH, src];
    const nonEn = [...LANGS].filter((i) => !exclude.includes(i));

    // Translate to English + Non-English
    let output = '';
    for (const lang of [ENGLISH, pickRandom(nonEn)]) {
      const translation = await this.translateOne(msg, src, lang);
      output += translation + '\n';
    }
    return output;
  }
}
