export interface LineConfig {
  channelSecret: string;
  channelAccessToken: string;
}

export interface YahooConfig {
  appid: string;
}

export interface Config {
  name: string;
  theme: string;
  line: LineConfig;
  yahoo: YahooConfig;
}
