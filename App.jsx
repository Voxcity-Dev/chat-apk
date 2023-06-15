import { NavigationContainer } from '@react-navigation/native';
import { UserProvider } from './context/userContext';
import AppRoutes from './routes/appRoutes';

export default function App() {
  return (
    <NavigationContainer>
      <UserProvider>
        <AppRoutes />
      </UserProvider>
    </NavigationContainer>
  );
}

