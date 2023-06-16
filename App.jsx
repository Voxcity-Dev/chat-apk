import { NavigationContainer } from '@react-navigation/native';
import { UserProvider } from './context/UserProvider';
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

