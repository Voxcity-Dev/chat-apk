import { NavigationContainer } from '@react-navigation/native';
import { UserProvider } from './context/UserProvider';
import AppRoutes from './routes/appRoutes';
import { StatusBar } from 'expo-status-bar';

export default function App() {
  return (
    <NavigationContainer>
      <UserProvider>
        <StatusBar style="inverted" />
        <AppRoutes />
      </UserProvider>
    </NavigationContainer>
  );
  
}

