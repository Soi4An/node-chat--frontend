import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { User } from '../types/User';
import { localStorageUser } from '../utils/localStorageUser';
import { login } from '../api/axios';

type AppContextType = {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  socket: WebSocket | null;
  setSocket: React.Dispatch<React.SetStateAction<WebSocket | null>>;
  globalError: string | null;
  setGlobalError: React.Dispatch<React.SetStateAction<string | null>>;
};

const AppContext = createContext<AppContextType>({
  user: null,
  setUser: () => {},
  socket: null,
  setSocket: () => {},
  globalError: null,
  setGlobalError: () => {},
});

type Props = {
  children: React.ReactNode;
};

export const AppProvider = ({ children }: Props) => {
  const [user, setUser] = useState<User | null>(null);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [globalError, setGlobalError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      const foundUserName = localStorageUser.get();

      if (foundUserName) {
        login(foundUserName)
          .then((res) => setUser(res.data))
          .catch(() =>
            console.error(
              'Something went wrong for getting user in provaider component'
            )
          );
      }
    }
  }, []);

  const values = useMemo(
    () => ({
      user,
      setUser,
      socket,
      setSocket,
      globalError,
      setGlobalError,
    }),
    [user, socket, globalError]
  );

  return <AppContext.Provider value={values}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);
