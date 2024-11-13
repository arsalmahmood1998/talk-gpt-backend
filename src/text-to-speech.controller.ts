import { Controller, Post, Body, Res } from '@nestjs/common';
import { TextToSpeechService } from './text-to-speech.service';
import { ChatService } from './gpt.service';
import { Response } from 'express';

@Controller('text-to-speech')
export class TextToSpeechController {
  constructor(
    private readonly textToSpeechService: TextToSpeechService,
    private readonly chatService: ChatService,
  ) {}

  @Post('synthesize')
  // async synthesize(@Body('text') text: string, @Res() res: Response) {
  //   try {
  //     const gptResponse = await this.chatService.chatWithGPT(text);
  //     const request = {
  //       input: { text: gptResponse },
  //       voice: {
  //         languageCode: 'en-US',
  //         name: 'en-US-Wavenet-F',
  //         ssmlGender: 'FEMALE',
  //       },
  //       audioConfig: { audioEncoding: 'mp3' },
  //     };
  //     const audioContent =
  //       await this.textToSpeechService.synthesizeSpeech(request);
  //     res.setHeader('Content-Type', 'audio/mpeg');
  //     res.end(audioContent);
  //   } catch (error) {
  //     console.log(error);
  //     res.send(500).send('An error occurred while synthesizing speech.');
  //   }
  // }

  async synthesize(@Body('text') text: string, @Res() res: Response) {
    try {
      const gptResponse = await this.chatService.chatWithGPT(text);
      const request = {
        input: { text: gptResponse },
        voice: {
          languageCode: 'en-US',
          name: 'en-US-Wavenet-F',
          ssmlGender: 'FEMALE',
        },
        audioConfig: { audioEncoding: 'MP3' }, // Ensure this is in uppercase
      };
      
      // Call to text-to-speech service
      const audioContent = await this.textToSpeechService.synthesizeSpeech(request);
      
      // Set headers and send audio content as a response
      res.setHeader('Content-Type', 'audio/mpeg');
      res.end(audioContent); // Use `res.end` to directly send the audio content
    } catch (error) {
      console.log(error);
  
      // Ensure only one response is sent
      if (!res.headersSent) {
        res.status(500).send('An error occurred while synthesizing speech.');
      }
    }
  }
  
}
