import { useState } from 'react';
import { headerHeight } from '../config';
import SelectMembers from './SelectMembers';
import { Chat } from '../types/Chat';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  InputLabel,
  TextField,
  Typography,
} from '@mui/material';
import { createChat, removeChat, editChat } from '../api/axios';
import { useAppContext } from './AppProvider';

type Props = {
  userName: string;
  exitingChat?: Chat | null;
  toggleIsSetting?: () => void;
};

function SettingChat({
  userName,
  exitingChat = null,
  toggleIsSetting = () => {},
}: Props) {
  const initName = exitingChat ? exitingChat.name : '';
  const initWithoutUser = exitingChat
    ? exitingChat.members.filter((n) => n !== userName)
    : [];

  const [chatName, setChatName] = useState<string>(initName);
  const [members, setMembers] = useState<string[]>(initWithoutUser);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorValidate, setErrorValidate] = useState<string | null>(null);
  const { setGlobalError } = useAppContext();
  const buttonTitle = !exitingChat ? 'Create' : 'Update';

  const handlerChangeName = (typedText: string) => {
    if (errorValidate) {
      setErrorValidate(null);
    }

    if (typedText === ' ') {
      return;
    }

    setChatName(typedText);
  };

  const setErrorMessage = (status: number) => {
    if (status === 409) {
      return setErrorValidate('This name is currently occupied');
    }

    if (status === 401) {
      return setErrorValidate('Invalid name');
    }

    return setErrorValidate('Bad connection to the server');
  };

  const setDisabledUpdate = () => {
    if (exitingChat) {
      if (
        initName === chatName &&
        initWithoutUser.length === members.length &&
        initWithoutUser.every((n) => members.includes(n))
      ) {
        return true;
      } else {
        return isLoading;
      }
    } else {
      return isLoading;
    }
  };

  const handlerSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setIsLoading(true);
    setErrorValidate(null);

    const newChat = {
      name: chatName.trim(),
      members: [...members, userName],
    };

    if (!exitingChat) {
      createChat({ ...newChat, userName })
        .catch((err) => setErrorMessage(err.response?.status))
        .finally(() => setIsLoading(false));
    } else {
      editChat(exitingChat.id, newChat)
        .then(toggleIsSetting)
        .catch((err) => setErrorMessage(err.response?.status))
        .finally(() => setIsLoading(false));
    }
  };

  const handlerDeleteChat = () => {
    if (exitingChat) {
      setIsLoading(true);

      removeChat(exitingChat.id)
        .catch(() => setGlobalError('Could not delete chat'))
        .finally(() => setIsLoading(false));
    }
  };

  return (
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
    >
      <Box
        component="form"
        onSubmit={handlerSubmit}
        noValidate
        sx={{ mt: 1, width: { xs: '97%', md: '75%', lg: '50%' } }}
      >
        <Typography component={InputLabel}>{'Chat name'}</Typography>

        <TextField
          margin="normal"
          required
          fullWidth
          id="name"
          placeholder="Chat name"
          name="name"
          autoFocus
          value={chatName}
          onChange={(e) => handlerChangeName(e.target.value)}
          sx={{ mt: 0, mb: 3 }}
        />

        <SelectMembers
          userName={userName}
          members={members}
          setMembers={setMembers}
        />

        {errorValidate && (
          <Alert sx={{ mt: 1 }} severity="error">
            {errorValidate}
          </Alert>
        )}

        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: { xs: 'center', sm: 'end' },
            mt: errorValidate ? 1 : 8,
          }}
        >
          {exitingChat && (
            <Button
              sx={{ mr: { xs: 0, sm: 2 }}}
              disabled={isLoading}
              type="button"
              variant="contained"
              size="large"
              onClick={handlerDeleteChat}
            >
              {isLoading ? (
                <CircularProgress color="primary" size={26} />
              ) : (
                'Delete'
              )}
            </Button>
          )}

          <Button
            disabled={setDisabledUpdate()}
            type="submit"
            variant="contained"
            size="large"
          >
            {isLoading ? (
              <CircularProgress color="primary" size={26} />
            ) : (
              buttonTitle
            )}
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

export default SettingChat;
