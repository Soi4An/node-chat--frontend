import { drawerWidth } from '../config';

import { styled } from '@mui/material/styles';
import { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import { Button, CircularProgress, Paper, TextField } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import SendIcon from '@mui/icons-material/Send';
import { createMessage } from '../api/axios';
import { useAppContext } from './AppProvider';

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const InputPaper = styled('div', {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  position: 'fixed',
  bottom: 0,
  width: '100%',
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

type Props = {
  isOpen: boolean;
  currentHeight: number;
  setHeight: (h: number) => void;
  chatId: number;
};

function FooterInput({ isOpen, setHeight, currentHeight, chatId }: Props) {
  const [text, setText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAppContext();
  const inputRef = useRef<HTMLDivElement>(null);

  const handlerChange = (typedText: string) => {
    setError(null);

    if (typedText === ' ') {
      return;
    }

    setText(typedText);
  };

  const sendMessage = () => {
    if (!text.trim()) {
      return setError('Type some text');
    }

    if (user) {
      setIsLoading(true);
      setError(null);

      const newMessage = {
        userName: user.name,
        text: text.trim(),
      };

      createMessage(chatId, newMessage)
        .then(() => setText(''))
        .catch(() => setError('Something went wrong'))
        .finally(() => setIsLoading(false));
    }
  };

  const handlerSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    sendMessage();
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLDivElement>) => {
    event.preventDefault();

    if (event.key === 'Enter' && event.shiftKey === false) {
      sendMessage();
    }
  };

  useEffect(() => {
    if (inputRef.current && currentHeight !== inputRef.current.clientHeight) {
      setHeight(inputRef.current.clientHeight);
    }
  }, [text]);

  return (
    <InputPaper open={isOpen}>
      <Paper
        component="form"
        onSubmit={handlerSubmit}
        noValidate
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'end',
        }}
      >
        <TextField
          inputRef={inputRef}
          required
          id={error ? 'outlined-error' : 'multiline-message'}
          name="message"
          label={error ? error : ''}
          color="secondary"
          multiline
          maxRows={3}
          placeholder="Type anything…"
          autoFocus
          fullWidth
          value={text}
          onChange={(e) => handlerChange(e.target.value)}
          onKeyUp={(e) => handleKeyUp(e)}
        />

        <Button
          disabled={isLoading}
          variant="contained"
          size="medium"
          color="secondary"
          type="submit"
          sx={{
            mx: { xs: 1, lg: 2 },
            my: 1,
            p: 1,
            borderRadius: '50%',
            minWidth: 40,
          }}
        >
          {isLoading ? (
            <CircularProgress color="inherit" size={24} />
          ) : (
            <SendIcon />
          )}
        </Button>
      </Paper>
    </InputPaper>
  );
}

export default FooterInput;
