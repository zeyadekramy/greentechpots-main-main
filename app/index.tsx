import { Redirect } from "expo-router";

// Redirect to the tabs home page
export default function Index() {
  return <Redirect href="/(tabs)" />;
}
