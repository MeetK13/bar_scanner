import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './src/Context/AuthContext';
import { StackNavigator } from './src/Navigator/StackNavigator';

function App(): JSX.Element {
  return (
    <NavigationContainer>
      <StackNavigator />
    </NavigationContainer>
  );
}

export default function AppWrapper() {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
}