import { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";

const PlantDetailScreen = () => {
  const { plant } = useLocalSearchParams();
  interface PlantData {
    photo: string;
    name: string;
    description: string;
    soilMoisture?: number;
    temperature?: number;
    light?: number;
    defaultSoil: { min: number; max: number };
    defaultTemp: { min: number; max: number };
    defaultLight: { min: number; max: number };
  }

  const [plantData, setPlantData] = useState<PlantData | null>(null);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (plant) {
      try {
        const parsedPlant = typeof plant === "string" ? JSON.parse(plant) : null;
        setPlantData(parsedPlant);
      } catch (e) {
        console.error("Failed to parse plant data:", e);
      }
    }
  }, [plant]);

  if (!plantData) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Plant details not found.</Text>
      </View>
    );
  }

  
  const renderCondition = (value: number | undefined, min: number, max: number, labels: { low: any; high: any; good: any; }) => {
    if (value === undefined) return "No data";
    if (value < min) return labels.low;
    if (value > max) return labels.high;
    return labels.good;
  };



  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: plantData.photo }} style={styles.plantImage} />

      <View style={styles.contentContainer}>
        <Text style={styles.plantName}>{plantData.name}</Text>

        <TouchableOpacity style={styles.infoLink}>
          <Text style={styles.infoLinkText}>Plant Information</Text>
        </TouchableOpacity>

        <Text style={styles.description}>{plantData.description}</Text>

        <TouchableOpacity style={styles.moreInfoContainer} onPress={() => setExpanded(!expanded)}>
          <Text style={styles.sectionTitle}>More Info</Text>
          <Ionicons name={expanded ? "chevron-up" : "chevron-down"} size={20} color="#333" />
        </TouchableOpacity>

        {expanded && (
          <View style={styles.expandedInfo}>
            {/* Soil Moisture */}
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Water</Text>
              <Text
                style={[
                  styles.infoValue,
                  {
                    color:
                      plantData.soilMoisture === undefined
                        ? "#999"
                        : plantData.soilMoisture < plantData.defaultSoil.min ||
                          plantData.soilMoisture > plantData.defaultSoil.max
                        ? "#FF6B6B"
                        : "#4CAF50",
                  },
                ]}>
                {plantData.defaultSoil.min}% - {plantData.defaultSoil.max}%
              </Text>
            </View>

            {/* Temperature */}
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Temperature</Text>
              <Text
                style={[
                  styles.infoValue,
                  {
                    color:
                      plantData.temperature === undefined
                        ? "#999"
                        : plantData.temperature < plantData.defaultTemp.min ||
                          plantData.temperature > plantData.defaultTemp.max
                        ? "#FF6B6B"
                        : "#4CAF50",
                  },
                ]}>
                {plantData.defaultTemp.min} C° - {plantData.defaultTemp.max} C°
              </Text>
            </View>

            {/* Light */}
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Light</Text>
              <Text
                style={[
                  styles.infoValue,
                  {
                    color:
                      plantData.light === undefined
                        ? "#999"
                        : plantData.light < plantData.defaultLight.min || plantData.light > plantData.defaultLight.max
                        ? "#FFA500"
                        : "#4CAF50",
                  },
                ]}>
                {plantData.defaultLight.min} Lux - {plantData.defaultLight.max} Lux
              </Text>
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5F5" },
  plantImage: { width: "100%", height: 300, resizeMode: "cover" },
  contentContainer: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20,
    padding: 20,
  },
  plantName: { fontSize: 24, fontWeight: "bold", marginBottom: 15 },
  infoLink: { marginBottom: 15 },
  infoLinkText: { color: "#4169E1", fontSize: 16 },
  description: { color: "#666", lineHeight: 22, marginBottom: 20 },
  sectionTitle: { fontSize: 16, fontWeight: "600" },
  moreInfoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 0,
    paddingBottom: 0,
  },
  expandedInfo: { marginTop: 10 },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  infoLabel: { fontSize: 16, color: "#333" },
  infoValue: { fontSize: 16, fontWeight: "500" },
  errorText: { fontSize: 18, color: "red", textAlign: "center", marginTop: 20 },
});

export default PlantDetailScreen;
