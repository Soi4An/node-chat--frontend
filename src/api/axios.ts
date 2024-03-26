import axios from 'axios';
import { Message } from '../types/Message';
import { User } from '../types/User';
import { DEF_SERVER_HOST } from '../config';

const client = axios.create({
  baseURL: `http://${DEF_SERVER_HOST}`,
  withCredentials: true,
});

type CreatingChat = { name: string, userName: string, members: string[] };
type EditingChat = { name: string, members: string[] };
type LeaveChat = { name: string };
type CreatingMessage = { text: string, userName: string };

export const login = (name: string) => {
  return client.post<User>('/login', { name });
};

export const getUsersNames = () => {
  return client.get<string[]>('/users');
};

export const createChat = (data: CreatingChat) => {
  return client.post('/chats/new', data);
};

export const editChat = (id: number, data: EditingChat) => {
  return client.patch(`/chats/${id}`, data);
};

export const leaveChat = (id: number, data: LeaveChat) => {
  return client.patch(`/chats/leave/${id}`, data);
};

export const removeChat = (id: number) => {
  return client.patch(`/chats/remove/${id}`);
};

export const getMessagesByChat = (chatId: number) => {
  return client.get<Message[]>(`/messages/${chatId}`);
};

export const createMessage = (chatId: number, data: CreatingMessage) => {
  return client.post(`/messages/${chatId}`, data);
};
