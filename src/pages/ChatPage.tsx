import { Box } from '@mui/material';
import { useEffect, useState } from 'react';
import Drawer from '../components/Drawer';
import Header from '../components/Header';
import { User } from '../types/User';
import { Chat } from '../types/Chat';
import { TypeChat } from '../types/NewChat';
import SettingChat from '../components/SettingChat';
import { useAppContext } from '../components/AppProvider';
import { TypeSocket } from '../types/Socket';
import { DEF_SERVER_HOST, headerHeight } from '../config';
import Messages from '../components/Messages';

type SelectedChat = Chat | null | TypeChat.New;
type Params = {
  user: User;
};

function ChatPage({ user }: Params) {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [isSetting, setIsSetting] = useState<boolean>(false);
  const [selectedChat, setSelectedChat] = useState<SelectedChat>(null);
  const { setSocket } = useAppContext();

  const isChat = selectedChat && selectedChat !== TypeChat.New;
  const isCreator = isChat && user.name === selectedChat.creatorName;

  const toggleIsOpen = () => setIsOpen((curr) => !curr);
  const toggleIsSetting = () => setIsSetting((curr) => !curr);

  useEffect(() => {
    const socket = new WebSocket(`ws://${DEF_SERVER_HOST}`);

    socket.addEventListener('open', () => {
      socket.send(
        JSON.stringify({
          type: TypeSocket.Login,
          userName: user.name,
        })
      );
    });

    console.log('---socket=', socket.readyState);

    setSocket(socket);

    return () => {
      console.log('---effect close', socket.readyState);

      if (socket.readyState === WebSocket.OPEN) {
        socket.close();
        setSocket(null);
      }
    };
  }, [user.name, setSocket]);

  return (
    <Box sx={{ display: 'flex' }}>
      <Header
        userName={user.name}
        selectedChat={selectedChat}
        isOpen={isOpen}
        toggleIsOpen={toggleIsOpen}
        toggleIsSetting={isCreator ? toggleIsSetting : null}
      />

      <Drawer
        isOpen={isOpen}
        toggleIsOpen={toggleIsOpen}
        selectedChat={selectedChat}
        setSelectedChat={setSelectedChat}
        setIsSetting={setIsSetting}
      />

      {isChat && !isSetting && (
        <Messages
          isOpen={isOpen}
          currUserName={user.name}
          currentChat={selectedChat}
        />
      )}

      {isChat && isSetting && (
        <SettingChat
          userName={user.name}
          toggleIsSetting={toggleIsSetting}
          exitingChat={selectedChat}
        />
      )}

      {selectedChat === TypeChat.New && <SettingChat userName={user.name} />}

      {!selectedChat && user.chats.length > 0 && (
        <Box
          component="main"
          sx={{
            pt: { xs: headerHeight.xs, sm: headerHeight.sm },
            minHeight: '100vh',
            flexGrow: 1,
            backgroundColor: '#f5f5f5',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        ></Box>
      )}
    </Box>
  );
}

export default ChatPage;
