import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { localStorageUser } from '../utils/localStorageUser';
import { useAppContext } from '../components/AppProvider';
import { login } from '../api/axios';

function getValidateNameError(name: string): string | null {
  if (!name) {
    return 'Name is required';
  }

  const namePattern = /^[a-zA-Z ]{2,20}$/;

  if (!namePattern.test(name)) {
    return 'Invalid name (letters, length 2-20)';
  }

  return null;
}

function AuthPage() {
  const { setUser } = useAppContext();
  const [name, setName] = useState<string>('');
  const [errorValidate, setErrorValidate] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handlerChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (errorValidate) {
      setErrorValidate(null);
    }

    if (e.target.value === ' ') {
      return setName('');
    }

    setName(e.target.value);
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

  const handlerSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validateError = getValidateNameError(name);

    if (validateError) {
      return setErrorValidate(validateError);
    }

    const trimedName = name.trim();

    setIsLoading(true);

    login(trimedName)
      .then((res) => {
        const foundUser = res.data;

        localStorageUser.set(foundUser.name);
        setUser(foundUser);
      })
      .catch((err) => setErrorMessage(err.response?.status))
      .finally(() => setIsLoading(false));
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        minHeight: '100vh',
        maxWidth: 300,
        width: '100%',
        mx: 'auto',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          p: 2,
          border: 3,
          borderRadius: '16px',
          borderColor: 'primary.main',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
          <AccountCircleIcon />
        </Avatar>

        <Typography component="h1" variant="h5">
          {'Write your name'}
        </Typography>

        <Box
          component="form"
          noValidate
          onSubmit={handlerSubmit}
          sx={{ mt: 1, width: '100%' }}
        >
          <TextField
            disabled={isLoading}
            error={!!errorValidate}
            required
            id={errorValidate ? 'outlined-error' : 'name'}
            name="name"
            label={errorValidate ? errorValidate : 'Name'}
            autoComplete="family-name"
            variant="standard"
            fullWidth
            autoFocus
            value={name}
            onChange={(e) => handlerChange(e)}
          />

          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              disabled={isLoading}
              variant="contained"
              type="submit"
              sx={{ mt: 3, ml: 1 }}
            >
              {isLoading ? (
                <CircularProgress color="primary" size={24} />
              ) : (
                'Submit'
              )}
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default AuthPage;
