export async function registerForPushNotificationsAsync() {
  let token;
  console.log("🔔 Starting registration...");

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    console.log("🔐 Existing permission status:", existingStatus);

    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
      console.log("🆕 Requested permission status:", status);
    }

    if (finalStatus !== "granted") {
      Alert.alert("Failed to get push token for push notification!");
      console.log("⛔️ Final permission not granted");
      return;
    }

    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log("✅ Got Expo Push Token:", token);
  } else {
    Alert.alert("Must use physical device for Push Notifications");
    console.log("⛔️ Not a physical device");
  }

  return token;
}

