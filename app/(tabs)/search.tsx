import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TextInput, ScrollView, Image, TouchableOpacity, SafeAreaView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const SearchScreen = () => {
  const router = useRouter();
  const [plants, setPlants] = useState<{ id: string; name: string; photo: string }[]>([]);
  const [filteredPlants, setFilteredPlants] = useState<{ id: string; name: string; photo: string }[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchPlants = async () => {
      try {
        const response = await fetch("http://13.53.201.187:8080/plants");
        const data = await response.json();
        setPlants(data);
        setFilteredPlants(data);
      } catch (error) {
        console.error("Error fetching plants:", error);
      }
    };

    fetchPlants();
  }, []);

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    const filtered = plants.filter((item) => item.name.toLowerCase().includes(text.toLowerCase()));
    setFilteredPlants(filtered);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Ionicons name="leaf" size={24} color="#4CAF50" />
          <Text style={styles.logoText}>GreenTech Pots</Text>
        </View>
      </View>

      <ScrollView style={styles.scrollView}>
        <Text style={styles.title}>Search</Text>

        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Enter your pot name?"
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={handleSearch}
          />
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Available Plants</Text>
        </View>

        <View style={styles.categoriesContainer}>
          {filteredPlants.map((plant) => (
            <TouchableOpacity
              key={plant.id || plant.name}
              style={styles.categoryCard}
              onPress={() =>
                router.push({
                  pathname: "/plant-detail-screen",
                  params: {
                    plant: JSON.stringify(plant),
                  },
                })
              }>
              <Image source={{ uri: plant.photo }} style={styles.categoryImage} />
              <Text style={styles.categoryName}>{plant.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5F5" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "white",
  },
  logoContainer: { flexDirection: "row", alignItems: "center" },
  logoText: { marginLeft: 8, fontSize: 16, fontWeight: "600", color: "#4CAF50" },
  scrollView: { flex: 1 },
  title: { fontSize: 28, fontWeight: "bold", marginHorizontal: 20, marginTop: 20, marginBottom: 15 },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: "#EFEFEF",
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, fontSize: 16, color: "#333" },
  filterButton: { padding: 5 },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 20,
    marginBottom: 15,
  },
  sectionTitle: { fontSize: 18, fontWeight: "600" },
  categoriesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start", // <- Important!
    paddingHorizontal: 10,
    gap: 15, // <- Space between cards
  },
  categoryCard: {
    width: "30%", // <- 3 per row
    alignItems: "center",
    marginBottom: 20,
  },
  categoryImage: { width: 80, height: 80, borderRadius: 10, marginBottom: 8 },
  categoryName: { fontSize: 12, textAlign: "center", color: "#333" },
});

export default SearchScreen;
