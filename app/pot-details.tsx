import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons, AntDesign } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { usePot, PotContextType } from "./PotContext";
import * as Notifications from "expo-notifications";

interface PlantData {
  uuid: string;
  name: string;
  assignedPlant: {
    name: string;
    description: string;
    photo: string;
    defaultSoil: number;
    defaultTemp: number;
    defaultLight: number;
  };
  sensorData: {
    moisture: number;
    temperature: number;
    light: number;
  };
  status: {
    moisture: string;
    light: string;
    temperature: string;
  };
}

export default function PotDetailsScreen() {
  const { plant } = useLocalSearchParams();
  const router = useRouter();
  const potContext: PotContextType | null = usePot();
  const pots = potContext?.pots || [];
  const setPots = potContext?.setPots || (() => {});
  const [expanded, setExpanded] = useState(false);
  const [plantData, setPlantData] = useState<PlantData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Request notification permissions
  useEffect(() => {
    const requestPermissions = async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Notification Permission",
          "Please enable notifications to receive alerts about your plant status.",
          [{ text: "OK" }]
        );
      }
    };
    requestPermissions();

    // Handle notification responses
    const subscription = Notifications.addNotificationResponseReceivedListener((response) => {
      console.log("Notification tapped:", response.notification);
      // You could add navigation logic here if needed
    });

    return () => subscription.remove();
  }, []);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const fetchPlantData = async () => {
      if (!plant) return;
      try {
        const parsedPlant = typeof plant === "string" ? JSON.parse(plant) : plant;
        if (!parsedPlant?.uuid) {
          setError("No plant assigned to this pot.");
          setLoading(false);
          return;
        }

        const response = await fetch(`http://13.53.201.187:8080/device/${parsedPlant.uuid}`);
        const data = await response.json();
        const updatedData = { ...data, uuid: parsedPlant.uuid };

        // Update local state
        setPlantData(updatedData);

        // Check and send notifications if needed

        // Sync real-time data with global context
        setPots((prev: any[]) =>
          prev.map((p) =>
            p.uuid === parsedPlant.uuid
              ? {
                  ...p,
                  sensorData: updatedData.sensorData,
                  status: updatedData.status,
                }
              : p
          )
        );

        setError(null);
      } catch (err) {
        setError("Failed to load plant data.");
        console.error("Error fetching plant data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlantData(); // Initial fetch
    intervalId = setInterval(fetchPlantData, 1000); // Refresh every 1 second

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, [plant]);

  const handleDelete = () => {
    Alert.alert(
      "Delete Pot",
      "Are you sure you want to delete this pot?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            const updated = pots.filter((p: { uuid: string | undefined }) => p.uuid !== plantData?.uuid);
            setPots(updated);
            router.back();
          },
        },
      ],
      { cancelable: true }
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text style={styles.loadingText}>Loading plant info...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centered}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!plantData) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centered}>
          <Text style={styles.errorText}>No plant data available 🥺</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={24} color="#333" />
          </TouchableOpacity>
          <View style={styles.headerRight}>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() =>
                router.push({
                  pathname: "/RenamePotScreen",
                  params: {
                    uuid: plantData.uuid,
                    currentName: plantData.name,
                  },
                })
              }>
              <Ionicons name="settings-outline" size={24} color="#333" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton} onPress={handleDelete}>
              <AntDesign name="delete" size={24} color="#FF5252" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.imageContainer}>
          <Image
            source={{
              uri: plantData.assignedPlant.photo || "https://via.placeholder.com/300x300.png?text=No+Image",
            }}
            style={styles.plantImage}
            resizeMode="cover"
          />
        </View>

        <View style={styles.nameContainer}>
          <Text style={styles.plantName}>{plantData.name}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Plant Information</Text>
          <View style={styles.divider} />
          <Text style={styles.description}>{plantData.assignedPlant.description}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Plant Status</Text>
          <View style={styles.statusContainer}>
            <Text style={[styles.statusText, { color: "#FF5252" }]}>
              {[
                plantData.status.moisture !== "Moisture OK" ? plantData.status.moisture : null,
                plantData.status.light !== "Light OK" ? plantData.status.light : null,
                plantData.status.temperature !== "Temperature OK" ? plantData.status.temperature : null,
              ]
                .filter(Boolean)
                .join(" • ") || "All Conditions Good"}
            </Text>
          </View>
        </View>

        <TouchableOpacity style={styles.section} onPress={() => setExpanded(!expanded)}>
          <View style={styles.moreInfoHeader}>
            <Text style={styles.sectionTitle}>More info</Text>
            <Ionicons name={expanded ? "chevron-up" : "chevron-down"} size={24} color="#333" />
          </View>

          {expanded && (
            <View style={styles.detailsContainer}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Water</Text>
                <Text style={[styles.detailValue, { color: "#FF5252" }]}>{plantData.sensorData.moisture}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Temperature</Text>
                <Text style={[styles.detailValue, { color: "#4CAF50" }]}>{plantData.sensorData.temperature}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Light</Text>
                <Text style={[styles.detailValue, { color: "#333" }]}>{plantData.sensorData.light}</Text>
              </View>
            </View>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  centered: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  loadingText: { marginTop: 10, color: "#555" },
  errorText: { textAlign: "center", color: "#888", fontSize: 16 },
  header: { flexDirection: "row", justifyContent: "space-between", padding: 15 },
  backButton: { padding: 5 },
  headerRight: { flexDirection: "row" },
  iconButton: { marginLeft: 10 },
  imageContainer: { margin: 15, borderRadius: 15, overflow: "hidden" },
  plantImage: { width: "100%", height: 250 },
  nameContainer: { paddingHorizontal: 20, paddingTop: 10 },
  plantName: { fontSize: 24, fontWeight: "bold" },
  section: { paddingHorizontal: 20, marginTop: 25 },
  sectionTitle: { fontSize: 18, fontWeight: "600", marginBottom: 5 },
  divider: { height: 2, backgroundColor: "#eee", marginBottom: 10 },
  description: { fontSize: 14, color: "#555" },
  statusContainer: { marginTop: 10 },
  statusText: { fontSize: 16, fontWeight: "600" },
  moreInfoHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  detailsContainer: { marginTop: 10 },
  detailRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 5 },
  detailLabel: { color: "#555" },
  detailValue: { fontWeight: "bold" },
});
