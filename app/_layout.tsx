import { useEffect, useState } from 'react';
import { Stack, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, ActivityIndicator } from 'react-native';

export default function RootLayout() {
  const [isLoggedIn, setIsLoggedIn] = useState<null | boolean>(null); // null: loading, true: logged in, false: not logged in
  const router = useRouter();

  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = await AsyncStorage.getItem('userToken'); // Assuming token is stored as 'userToken'
      if (token) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
        router.replace('/login'); // Redirect to login if not logged in
      }
    };
    checkLoginStatus();
  }, []);

  if (isLoggedIn === null) {
    // Show a loading indicator while checking login status
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}
