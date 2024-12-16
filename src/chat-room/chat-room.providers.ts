import { DataSource } from 'typeorm';
import { ChatRoom } from './chat-room.entity';

export const chatRoomProviders = [
  {
    provide: 'ChatRoomRepository',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(ChatRoom),
    inject: ['DataSource'],
  },
];
