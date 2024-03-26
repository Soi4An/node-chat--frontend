import { Chat } from './Chat';
import { Message } from './Message';

export enum TypeSocket {
  Login = 'login',
  Logout = 'logout',
  ChatCreate = 'createNewChat',
  ChatEdit = 'editChat',
  ChatDelete = 'deleteChat',
  MessageCreate = 'createNewMessage',
}

export interface WSChatNew {
  type: TypeSocket.ChatCreate | TypeSocket.ChatEdit,
  chat: Chat,
}

export interface WSChatDel {
  type: TypeSocket.ChatDelete,
  chatId: number,
}

export interface WSMessageNew {
  type: TypeSocket.MessageCreate,
  message: Message,
  chatId: number,
}

export type SocketRespond = WSChatNew | WSChatDel | WSMessageNew;
