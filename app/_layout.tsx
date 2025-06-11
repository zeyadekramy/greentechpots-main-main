import { useEffect } from "react";
import { Stack } from "expo-router";
import { PotProvider } from "./PotContext";
import { AuthProvider } from "./AuthContext";
 // <-- Import it!

export default function RootLayout() {
  


  return (
    <AuthProvider>
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
    </AuthProvider>
  );
}
