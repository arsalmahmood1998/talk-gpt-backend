import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';

@Injectable()
export class ChatService {
  private openai: OpenAI;

  // Correctly typed conversation history for OpenAI
  private conversationHistory: Array<
    | { role: 'system' | 'user' | 'assistant'; content: string }
    | { role: 'function'; content: string; name: string }
  > = [];

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async chatWithGPT(content: string) {
    // Add user message to conversation history
    this.conversationHistory.push({
      role: 'user',
      content: content,
    });

    // Create chat completion request
    const chatCompletion = await this.openai.chat.completions.create({
      messages: [
        { role: 'system', content: 'you are a helpful assistant' },
        ...this.conversationHistory,
      ],
      model: 'gpt-3.5-turbo',
    });

    // Add assistant response to conversation history
    this.conversationHistory.push({
      role: 'assistant',
      content: chatCompletion.choices[0].message.content,
    });

    // Return the assistant's response
    return chatCompletion.choices[0].message.content;
  }
}
