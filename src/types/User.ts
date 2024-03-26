import { Chat } from './Chat';

export interface User {
  id: number,
  name: string,
  chats: Chat[];
}
