import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { View, StyleSheet, Platform } from "react-native";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: React.ComponentProps<typeof Ionicons>["name"] = "help";

          if (route.name === "index") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "search") {
            iconName = focused ? "search" : "search-outline";
          } else if (route.name === "NotificationsScreen") {
            iconName = focused ? "notifications" : "notifications-outline";
          } else if (route.name === "profile") {
            iconName = focused ? "person" : "person-outline";
          }

          return (
            <View style={[styles.tabIconContainer, focused && styles.focusedTab]}>
              <Ionicons name={iconName} size={size} color={color} />
            </View>
          );
        },
        tabBarActiveTintColor: "#4CAF50",
        tabBarInactiveTintColor: "gray",
        headerShown: false,
        tabBarStyle: styles.tabBarStyle,
      })}>
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "Search",
        }}
      />
      <Tabs.Screen
        name="NotificationsScreen"
        options={{
          title: "Notifications",
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBarStyle: {
    position: "absolute",
    bottom: 2, // Slightly closer to the bottom
    left: 20,
    right: 20,
    height: 60, // Reduced height for a smaller navbar
    backgroundColor: "white",
    borderRadius: 100, // Semi-circular design
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10, // For Android shadow
    borderTopWidth: 0, // Remove default border
    paddingHorizontal: 20,
  },
  tabIconContainer: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  focusedTab: {
    borderWidth: 10, // Slightly thinner border
    borderColor: "#4CAF50", // Green border color
    borderRadius: 40, // Smaller rounded border
    paddingVertical: 1, // Adjusted padding for smaller height
    paddingHorizontal: 10, // Reduced width for the highlight
    backgroundColor: "white", // Keep the background white
    shadowColor: "#4CAF50", // Subtle green shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 3, // For Android shadow
  }, 
});