import { Injectable } from '@nestjs/common';
import { Configuration, OpenAIApi, ChatCompletionRequestMessage } from 'openai';

@Injectable()
export class OpenAIService {
  private openai: OpenAIApi;

  constructor() {
    const configuration = new Configuration({ apiKey: process.env.OPENAI_API_KEY });
    this.openai = new OpenAIApi(configuration);
  }

  async generateReply(messages: { role: string; content: string }[]): Promise<string> {
    const messagesForOpenAI = messages.map(m => ({
      role: m.role as 'system' | 'user' | 'assistant',
      content: m.content,
    }));
    const response = await this.openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: messagesForOpenAI,
    });
    return response.data.choices[0]?.message?.content || "Извините, нет ответа.";
  }
}
