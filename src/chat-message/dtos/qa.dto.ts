import { Role } from 'src/shared/enums';
import { ChatMessage } from '../chat-message.entity';

export class QADto {
  chapter_summary: string;
  chat_history: any[];

  constructor(chapterSummary: string, chatMessage: ChatMessage[]) {
    this.chapter_summary = chapterSummary;
    this.chat_history = chatMessage.map((chat) => {
      if (chat.user.role === Role.ADMIN) {
        return {
          agent: chat.content,
        };
      }
      return {
        user: chat.content,
      };
    });
  }
}
