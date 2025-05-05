import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useLocalSearchParams, Stack } from "expo-router";

export default function SelectPlantScreen() {
  const navigation = useNavigation();
  const { potId } = useLocalSearchParams();

  interface Plant {
    _id: string;
    name: string;
    description: string;
    photo: string;
  }

  const [plants, setPlants] = useState<Plant[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchPlants = async () => {
      try {
        const response = await fetch("http://13.53.201.187:8080/plants");
        const data = await response.json();
        setPlants(data);
      } catch (error) {
        console.error("Failed to fetch plants:", error);
      }
    };

    fetchPlants();
  }, []);

  const handleChoosePlant = async (plantId: string) => {
    try {
      await fetch("http://13.53.201.187:8080/assign-plant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uuid: potId, plantId }),
      });

      Alert.alert("Success", "Plant assigned to your pot 🌱", [
        {
          text: "OK",
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      console.error("Failed to assign plant:", error);
      Alert.alert("Error", "Failed to assign plant. Please try again.");
    }
  };

  const filteredPlants = plants.filter((plant) => plant.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <>
      <Stack.Screen
        options={{
          title: "Available Plants",
          headerShown: false,
        }}
      />
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Available Plants</Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
          <TextInput
            placeholder="Search for a plant..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.searchInput}
            placeholderTextColor="#aaa"
          />
        </View>

        {/* Plant Grid */}
        <ScrollView style={styles.scrollView}>
          <View style={styles.plantGrid}>
            {filteredPlants.length > 0 ? (
              filteredPlants.map((plant) => (
                <View key={plant._id} style={styles.plantCard}>
                  <Image source={{ uri: plant.photo }} style={styles.plantImage} />
                  <TouchableOpacity style={styles.bookmarkButton}>
                    <Ionicons name="bookmark-outline" size={20} color="black" />
                  </TouchableOpacity>
                  <Text style={styles.plantName}>{plant.name}</Text>
                  <Text style={styles.plantDescription}>{plant.description}</Text>
                  <TouchableOpacity style={styles.chooseButton} onPress={() => handleChoosePlant(plant._id)}>
                    <Text style={styles.chooseButtonText}>Choose Plant</Text>
                  </TouchableOpacity>
                </View>
              ))
            ) : (
              <Text style={styles.noPlantsText}>No plants match your search</Text>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  backButton: { padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: "600", marginLeft: 10 },
  scrollView: { flex: 1 },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  plantGrid: { flexDirection: "row", flexWrap: "wrap", padding: 8 },
  plantCard: { width: "50%", padding: 8, position: "relative" },
  plantImage: {
    width: "100%",
    height: 150,
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
  },
  bookmarkButton: {
    position: "absolute",
    top: 16,
    right: 16,
    backgroundColor: "white",
    borderRadius: 15,
    padding: 4,
  },
  plantName: { fontSize: 16, fontWeight: "600", marginTop: 8 },
  plantDescription: { fontSize: 12, color: "#666", marginTop: 4 },
  chooseButton: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#4CAF50",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: "center",
    marginTop: 8,
  },
  chooseButtonText: { color: "#4CAF50", fontSize: 14, fontWeight: "500" },
  noPlantsText: {
    textAlign: "center",
    fontSize: 16,
    color: "#888",
    marginTop: 20,
    width: "100%",
  },
});
