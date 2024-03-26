import { drawerWidth, errorColor } from '../config';

import { styled } from '@mui/material/styles';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import SettingsIcon from '@mui/icons-material/Settings';
import { CircularProgress } from '@mui/material';
import { useEffect, useState } from 'react';
import { leaveChat } from '../api/axios';
import { Chat } from '../types/Chat';
import { TypeChat } from '../types/NewChat';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CloseIcon from '@mui/icons-material/Close';
import { useAppContext } from './AppProvider';

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

type Props = {
  userName: string;
  selectedChat: Chat | TypeChat.New | null;
  isOpen: boolean;
  toggleIsOpen: () => void;
  toggleIsSetting: (() => void) | null;
};

function Header({
  selectedChat,
  userName,
  isOpen,
  toggleIsOpen,
  toggleIsSetting,
}: Props) {
  const [title, setTitle] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { globalError, setGlobalError } = useAppContext();
  const isChat = selectedChat && selectedChat !== TypeChat.New;

  const getTitle = () => {
    if (globalError) {
      return setTitle(globalError);
    }

    if (selectedChat === TypeChat.New) {
      return setTitle('Create a chat');
    }

    if (selectedChat?.name) {
      return setTitle(selectedChat?.name);
    }

    return setTitle(userName);
  };

  const handlerLeaveChat = () => {
    if (isChat) {
      setIsLoading(true);

      leaveChat(selectedChat.id, { name: userName })
        .catch(() => setGlobalError('Could not leave chat'))
        .finally(() => setIsLoading(false));
    }
  };

  useEffect(() => {
    getTitle();
  }, [globalError, selectedChat]);

  return (
    <AppBar position="absolute" open={isOpen}>
      <Toolbar
        sx={{
          pr: '24px', // keep right padding when drawer closed
          backgroundColor: globalError ? errorColor : 'inherit',
        }}
      >
        <IconButton
          edge="start"
          color="inherit"
          title="Open/close menu"
          aria-label="open drawer"
          onClick={toggleIsOpen}
          sx={{
            marginRight: '36px',
            ...(isOpen && { display: 'none' }),
          }}
        >
          <MenuIcon />
        </IconButton>

        {globalError && <ErrorOutlineIcon sx={{ mr: 1 }} />}

        <Typography
          component="h1"
          variant="h6"
          color="inherit"
          noWrap
          sx={{ flexGrow: 1 }}
        >
          {title}
        </Typography>

        {!!toggleIsSetting && !globalError && (
          <IconButton
            color="inherit"
            title="Settings"
            sx={{ mr: { xs: 1, md: 2 } }}
            onClick={toggleIsSetting}
          >
            <SettingsIcon />
          </IconButton>
        )}

        {isChat && !globalError && (
          <IconButton
            disabled={isLoading}
            color="inherit"
            title="Leave this chat"
            onClick={handlerLeaveChat}
          >
            {isLoading ? (
              <CircularProgress color="inherit" />
            ) : (
              <ExitToAppIcon />
            )}
          </IconButton>
        )}

        {globalError && (
          <IconButton
            color="inherit"
            title="Close error"
            onClick={() => setGlobalError(null)}
          >
            <CloseIcon />
          </IconButton>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default Header;
