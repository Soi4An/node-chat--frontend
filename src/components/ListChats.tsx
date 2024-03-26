import { ListItemButton, ListItemText } from '@mui/material';
import { Chat } from '../types/Chat';
import { useEffect, useState } from 'react';
import { useAppContext } from './AppProvider';
import { SocketRespond, TypeSocket } from '../types/Socket';

type Props = {
  initChats: Chat[];
  selectedChat: Chat | null;
  setSelectedChat: (c: Chat | null) => void;
  setIsSetting: (b: boolean) => void;
};

function ListChats({
  initChats,
  selectedChat,
  setSelectedChat,
  setIsSetting,
}: Props) {
  const [chats, setChats] = useState<Chat[]>(initChats);
  const { user, setUser, socket } = useAppContext();

  const handlerClick = (chat: Chat) => {
    setIsSetting(false);
    setSelectedChat(chat);
  };

  const socketUpdateChat = (event: MessageEvent<string>) => {
    const data: SocketRespond = JSON.parse(event.data);

    console.log('--socketUpdateChat--', data);

    if (user && data.type === TypeSocket.ChatCreate) {
      if (data.chat.creatorName === user.name) {
        setSelectedChat(data.chat);
      }

      console.log('--socket-ChatCreate--', data.chat.creatorName === user.name);

      setUser({ ...user, chats: [data.chat, ...user.chats] });
      setChats((curr) => [data.chat, ...curr]);

      return;
    }

    if (user && data.type === TypeSocket.ChatEdit) {
      if (data.chat.creatorName === user.name) {
        setSelectedChat(data.chat);
      }

      const newChats = [
        data.chat,
        ...user.chats.filter((c) => c.id !== data.chat.id),
      ];

      setUser({ ...user, chats: newChats });
      setChats(newChats);

      return;
    }

    if (user && data.type === TypeSocket.ChatDelete) {
      const newChats = user.chats.filter((c) => c.id !== data.chatId);

      setUser({ ...user, chats: newChats });
      setChats(newChats);
      setSelectedChat(null);

      return;
    }
  };

  useEffect(() => {
    if (socket) {
      socket.addEventListener('message', socketUpdateChat);
    }

    return () => socket?.removeEventListener('message', socketUpdateChat);
  }, [socket]);

  return (
    <>
      {chats.map((chat) => {
        const { id, name } = chat;

        return (
          <ListItemButton
            key={`${id}-${name}`}
            selected={selectedChat?.id === id}
            onClick={() => handlerClick(chat)}
          >
            <ListItemText
              primary={name.length <= 29 ? name : name.slice(0, 26) + '...'}
            />
          </ListItemButton>
        );
      })}
    </>
  );
}

export default ListChats;
