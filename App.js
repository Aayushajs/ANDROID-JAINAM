import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthProvider, useAuth } from './components/context/AuthContext.jsx';
import SignInScreen from './components/User/Authntiocation/SignInScreen.jsx';
import StartPage from './components/StartPage.jsx';
import WelcomePage from './components/welcomePage.jsx';
import CustomTabBar from './components/User/Home/Tab.jsx';




const Stack = createStackNavigator();

const AppNavigator = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Stack.Navigator initialRouteName={isAuthenticated ? "HomeTabs" : "Welcome"}>
      {
        !isAuthenticated ? (
          <>
            <Stack.Screen name="Welcome" component={WelcomePage} options={{ headerShown: false }} />
            <Stack.Screen name="Start" component={StartPage} options={{ headerShown: false }} />
            <Stack.Screen name="SignIn" component={SignInScreen} options={{ headerShown: false }} />
          </>
        ) : (
          <>
            <Stack.Screen name="HomeTabs" component={CustomTabBar} options={{ headerShown: false }} />
          </>
        )
      }
    </Stack.Navigator>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}