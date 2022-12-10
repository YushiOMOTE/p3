import { Configuration, OpenAIApi } from 'openai';
import { Config } from './config';

const MODEL = 'text-davinci-003';

export class AI {
  config: Config;
  client: OpenAIApi;

  constructor(config: Config) {
    this.config = config;
    this.client = new OpenAIApi(
      new Configuration({
        apiKey: this.config.openai.apikey,
      }),
    );
  }

  async ask(message: string): Promise<string | undefined> {
    try {
      const completion = await this.client.createCompletion({
        model: MODEL,
        prompt: message,
        temperature: 0.0,
        max_tokens: 1024,
      });
      return completion.data.choices[0].text;
    } catch (error) {
      if (error.response) {
        console.log(error.response.status);
        console.log(error.response.data);
      } else {
        console.log(error.message);
      }
      return undefined;
    }
  }
}
