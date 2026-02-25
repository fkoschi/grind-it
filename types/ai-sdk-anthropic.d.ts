declare module "@ai-sdk/anthropic" {
  export function createAnthropic(options: { apiKey: string }): (model: string) => any;
}
