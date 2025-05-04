import { useEffect } from "react";
import { Stack } from "expo-router";
import { PotProvider } from "./PotContext";
import { registerForPushNotificationsAsync } from "./NotificationService"; // <-- Import it!

export default function RootLayout() {
  useEffect(() => {
    async function setupNotifications() {
      const token = await registerForPushNotificationsAsync();
      // OPTIONAL: You can send the token to your backend here if needed
      console.log("Expo Push Token:", token);
    }

    setupNotifications();
  }, []);

  return (
    <PotProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="pot-details"
          options={{
            presentation: "modal",
          }}
        />
        <Stack.Screen name="(plant-flow)" />
        <Stack.Screen name="plant-detail-screen" />
      </Stack>
    </PotProvider>
  );
}
