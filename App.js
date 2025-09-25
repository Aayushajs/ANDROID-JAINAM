import CheckoutPage from './components/User/pages/CheckoutPage.jsx';
import React, { useEffect } from 'react';
import { Alert, StatusBar, useColorScheme, Platform } from 'react-native';
import * as Updates from 'expo-updates';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthProvider, useAuth } from './components/context/AuthContext.jsx';
import { CartProvider } from './components/User/pages/CartContext.js';

import SignInScreen from './components/User/Authntiocation/SignInScreen.jsx';
import SignUpScreen from './components/User/Authntiocation/SignUpScreen.jsx';
import StartPage from './components/StartPage.jsx';
import WelcomePage from './components/welcomePage.jsx';
import HomePage from './components/User/Home/Home.jsx';
import ForgetPasswordScreen from './components/User/Authntiocation/ForgetPasswordScreen.jsx';
import ProfilePage from './components/User/pages/ProfilePage.jsx';
import SearchScreen from './components/User/pages/SearchScreen.jsx';
import ProductDetail from './components/User/pages/ProductDetail.jsx';

const Stack = createStackNavigator();

const AppNavigator = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Stack.Navigator initialRouteName={isAuthenticated ? "HomeTabs" : "Welcome"}>
      {isAuthenticated ? (
        <>
          <Stack.Screen name="HomeTabs" component={HomePage} options={{ headerShown: false }} />
          <Stack.Screen name="ProfilePage" component={ProfilePage} options={{ headerShown: false }} />
          <Stack.Screen name="Search" component={SearchScreen} options={{ headerShown: false }} />
          <Stack.Screen name="ProductDetail" component={ProductDetail} options={{ headerShown: false }} />
          <Stack.Screen name="CheckoutPage" component={CheckoutPage} options={{ headerShown: false }} />
        </>
      ) : (
        <>
          <Stack.Screen name="Welcome" component={WelcomePage} options={{ headerShown: false }} />
          <Stack.Screen name="Start" component={StartPage} options={{ headerShown: false }} />
          <Stack.Screen name="SignIn" component={SignInScreen} options={{ headerShown: false }} />
          <Stack.Screen name="SignUp" component={SignUpScreen} options={{ headerShown: false }} />
          <Stack.Screen name="ForgotPassword" component={ForgetPasswordScreen} options={{ headerShown: false }} />
        </>
      )}
    </Stack.Navigator>
  );
};

export default function App() {
  // 🔥 OTA Updates check
  useEffect(() => {
    async function checkUpdates() {
      try {
        const update = await Updates.checkForUpdateAsync();
        if (update.isAvailable) {
          await Updates.fetchUpdateAsync();
          Alert.alert("Update Available", "App will restart to update", [
            { text: "OK", onPress: () => Updates.reloadAsync() }
          ]);
        }
      } catch (e) {
        console.log("Update check failed", e);
      }
    }
    checkUpdates();
  }, []);

  // Set status bar text color opposite to app background
  const colorScheme = useColorScheme();
  // If app bg is light, status bar text is dark; if app bg is dark, status bar text is light
  const barStyle = colorScheme === 'dark' ? 'light-content' : 'dark-content';

    return (
      <CartProvider>
        <AuthProvider>
          {/* Global status bar style for all screens */}
          <StatusBar
            barStyle={barStyle}
            backgroundColor={colorScheme === 'dark' ? '#1A1A1A' : '#FFFFFF'}
            translucent={Platform.OS === 'android'}
          />
          <NavigationContainer>
            <AppNavigator />
          </NavigationContainer>
        </AuthProvider>
      </CartProvider>
    );
}
