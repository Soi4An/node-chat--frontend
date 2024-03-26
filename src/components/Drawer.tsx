import { drawerWidth } from '../config';

import { styled } from '@mui/material/styles';
import { Button, Divider, IconButton, List, Toolbar } from '@mui/material';
import MuiDrawer from '@mui/material/Drawer';
import ListChats from './ListChats';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { TypeChat } from '../types/NewChat';
import { Chat } from '../types/Chat';
import { useAppContext } from './AppProvider';

const DrawerElement = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  '& .MuiDrawer-paper': {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: 'border-box',
    ...(!open && {
      overflowX: 'hidden',
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(0),
    }),
  },
}));

type Props = {
  isOpen: boolean;
  toggleIsOpen: () => void;
  selectedChat: Chat | null | TypeChat.New;
  setSelectedChat: (f: Chat | TypeChat.New | null) => void;
  setIsSetting: (b: boolean) => void;
};

function Drawer({
  isOpen,
  toggleIsOpen,
  selectedChat,
  setSelectedChat,
  setIsSetting,
}: Props) {
  const { user } = useAppContext();

  const isChat = !!selectedChat && selectedChat !== TypeChat.New;

  const handlerNewChat = () => {
    setSelectedChat(TypeChat.New);
    toggleIsOpen();
  };

  return (
    <DrawerElement
      variant="permanent"
      open={isOpen}
      sx={{
        height: '100vh',
      }}
    >
      <Toolbar
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: [1],
        }}
      >
        <Button
          disabled={selectedChat === TypeChat.New}
          variant="outlined"
          title="Create a new chat"
          sx={{ border: 1, borderRadius: '16px', fontWeight: 'bold' }}
          onClick={handlerNewChat}
        >
          {'+ New Chat'}
        </Button>

        <IconButton onClick={toggleIsOpen}>
          <ChevronLeftIcon />
        </IconButton>
      </Toolbar>

      <Divider />

      {user && user.chats.length > 0 && (
        <List component="nav" sx={{ py: 0, overflowY: 'auto' }}>
          <ListChats
            initChats={user.chats}
            selectedChat={isChat ? selectedChat : null}
            setSelectedChat={setSelectedChat}
            setIsSetting={setIsSetting}
          />
        </List>
      )}
    </DrawerElement>
  );
}

export default Drawer;
