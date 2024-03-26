import { useAppContext } from './components/AppProvider';
import AuthPage from './pages/AuthPage';
import ChatPage from './pages/ChatPage';
import CssBaseline from '@mui/material/CssBaseline';

function App() {
  const { user } = useAppContext();

  return (
    <div>
      <CssBaseline />

      {user ? <ChatPage user={user} /> : <AuthPage />}
    </div>
  );
}

export default App;
