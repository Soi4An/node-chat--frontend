import { Alert, Box, CircularProgress, List } from '@mui/material';
import FooterInput from './Footer';
import { Fragment, useEffect, useRef, useState } from 'react';
import { getValidateTime } from '../utils/getValidateTime';
import MassageFromUser from './MassageFromUser';
import MessageFromOther from './MessageFromOther';
import { headerHeight } from '../config';
import { Chat } from '../types/Chat';
import NotificationChip from './NotificationChip';
import { getChipDateContent } from '../utils/getChipDateContent';
import { useAppContext } from './AppProvider';
import { SocketRespond, TypeSocket } from '../types/Socket';
import { Message } from '../types/Message';
import { getMessagesByChat } from '../api/axios';

const lineHeightFooter = 25;
const heightPaddingsFooter = 32;
type Params = {
  isOpen: boolean;
  currUserName: string;
  currentChat: Chat;
};

function Messages({ isOpen, currUserName, currentChat }: Params) {
  const [footerHeight, setFooterHeight] = useState<number>(lineHeightFooter);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const { socket } = useAppContext();
  const listRef = useRef<HTMLUListElement>(null);

  const scrollToBottom = () => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  };

  const socketUpdateMessages = (event: MessageEvent<string>) => {
    const data: SocketRespond = JSON.parse(event.data);

    if (data.type === TypeSocket.MessageCreate) {
      if (data.chatId === currentChat.id) {
        setMessages((curr) => [...curr, data.message]);
      }
    }
  };

  useEffect(() => {
    setIsLoading(true);

    getMessagesByChat(currentChat.id)
      .then((res) => {
        setMessages(res.data);
      })
      .catch(() => setIsError(true))
      .finally(() => setIsLoading(false));

    if (socket) {
      socket.addEventListener('message', socketUpdateMessages);

      return () => socket.removeEventListener('message', socketUpdateMessages);
    }
  }, [socket, currentChat]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        height: '100vh',
        backgroundColor: '#f5f5f5',
        pt: { xs: headerHeight.xs, sm: headerHeight.sm },
        pb: { xs: `${footerHeight + heightPaddingsFooter}px` },
      }}
    >
      {isLoading && !isError && (
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
          <CircularProgress color="inherit" size={24} />
        </Box>
      )}

      {isError && !isLoading && (
        <Alert sx={{ mt: 2 }} severity="error">
          {'Unable to connect to the server'}
        </Alert>
      )}

      {!isLoading && !isError && (
        <>
          <List
            ref={listRef}
            sx={{
              scrollTop: {},
              height: '100%',
              overflowY: 'auto',
              px: 1,
            }}
          >
            {messages.map((message, ind, arr) => {
              const { id, creatorName, text, createdAt } = message;
              const time = getValidateTime(createdAt);
              const chipDate = getChipDateContent(arr, ind);

              return (
                <Fragment key={id}>
                  {chipDate && <NotificationChip text={chipDate} />}

                  {currUserName === creatorName ? (
                    <MassageFromUser
                      creatorName={creatorName}
                      text={text}
                      time={time}
                    />
                  ) : (
                    <MessageFromOther
                      creatorName={creatorName}
                      text={text}
                      time={time}
                    />
                  )}
                </Fragment>
              );
            })}
          </List>

          <FooterInput
            isOpen={isOpen}
            currentHeight={footerHeight}
            setHeight={setFooterHeight}
            chatId={currentChat.id}
          />
        </>
      )}
    </Box>
  );
}

export default Messages;
