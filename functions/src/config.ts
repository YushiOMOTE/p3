export interface LineConfig {
  channelSecret: string;
  channelAccessToken: string;
}

export interface OpenAIConfig {
  apikey: string;
}

export interface Config {
  name: string;
  theme: string;
  line: LineConfig;
  openai: OpenAIConfig;
}
