import { DataSource } from 'typeorm';
import { ChatMessage } from './chat-message.entity';

export const chatMessageProviders = [
    {
        provide: 'ChatMessageRepository',
        useFactory: (dataSource: DataSource) => dataSource.getRepository(ChatMessage),
        inject: ['DataSource'],
    },
];
