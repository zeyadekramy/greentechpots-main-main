import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

export default function RenamePotScreen() {
  const { uuid, currentName } = useLocalSearchParams<{ uuid: string; currentName: string }>();
  const [name, setName] = useState(currentName || "");
  const router = useRouter();

  const handleRename = async () => {
    if (!name.trim()) {
      Alert.alert("Invalid Name", "Please enter a valid pot name.");
      return;
    }

    try {
      const response = await fetch("http://192.168.110.167:3000/update-name", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uuid, newName: name }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      Alert.alert("Success", "Pot name updated!", [{ text: "OK", onPress: () => router.back() }]);
    } catch (err: any) {
      console.error(err);
      Alert.alert("Error", err.message || "Failed to rename pot.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Rename Your Pot</Text>
      <TextInput value={name} onChangeText={setName} style={styles.input} placeholder="Enter new name" />
      <Button title="Save" onPress={handleRename} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center" },
  label: { fontSize: 20, marginBottom: 10, fontWeight: "bold" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 6,
    fontSize: 16,
    marginBottom: 20,
  },
});
