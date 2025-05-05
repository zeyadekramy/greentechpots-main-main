import React, { useState , useEffect} from "react";
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, SafeAreaView, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { CameraView, useCameraPermissions } from "expo-camera";
import { usePot } from "../PotContext";
import { useRouter } from "expo-router";
import { registerForPushNotificationsAsync } from "../../hooks/useRegisterForPushNotifications";

const HomeScreen = () => {
  const [scanning, setScanning] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();

  const { pots = [], addPot = () => {}, clearPots = () => {} } = usePot() || {};
  const router = useRouter();

  const handleScan = async (data: string) => {
    if (pots.some((p: { uuid: string }) => p.uuid === data)) {
      Alert.alert("Already Added", "This pot is already in your list.");
      setScanning(false);
      return;
    }

    try {
      const res = await fetch(`http://13.53.201.187:8080/device/${data}`);
      const json = await res.json();

      if (res.ok) {
        addPot(json);
        setScanning(false);
        router.push({
          pathname: "/select-plant",
          params: { potId: json.uuid },
        });
      } else {
        Alert.alert("Error", json.message || "Something went wrong.");
      }
    } catch {
      Alert.alert("Error", "Failed to connect to server");
    }
  };

  if (scanning) {
    if (!permission) {
      return (
        <View style={styles.centered}>
          <Text>Requesting camera permission...</Text>
        </View>
      );
    }

    if (!permission.granted) {
      return (
        <View style={styles.centered}>
          <Text>No access to camera</Text>
          <TouchableOpacity onPress={requestPermission} style={styles.cancelBtn}>
            <Text style={styles.cancelText}>Allow Camera</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <SafeAreaView style={styles.scanContainer}>
        <Text style={styles.scanHeader}>Scan Pot QR</Text>
        <View style={styles.cameraBox}>
          <CameraView
            style={styles.cameraView}
            barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
            onBarcodeScanned={(e) => {
              if (!scanned) {
                setScanned(true);
                handleScan(e.data);
                setTimeout(() => setScanned(false), 3000);
              }
            }}
          />
        </View>

        <TouchableOpacity onPress={() => setScanning(false)} style={styles.cancelBtn}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }
   useEffect(() => {
    (async () => {
      const token = await registerForPushNotificationsAsync();
      if (token) {
        try {
          await fetch("http://13.53.201.187:8080/token", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ token }),
          });
          console.log("✅ Token sent to backend");
        } catch (error) {
          console.error("❌ Error sending token:", error);
        }
      }
    })();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Ionicons name="leaf" size={28} color="#4CAF50" />
          <Text style={styles.logoText}>GreenTech Pots</Text>
        </View>
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeText}>Welcome Back!</Text>
          <Text style={styles.subtitle}>Take care of your plants effortlessly 🌱</Text>
        </View>

        {/* Banner Section */}
        <View style={styles.bannerContainer}>
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1616046229478-9901c5536a45?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
            }}
            style={styles.bannerImage}
          />
        </View>

        {/* Your Pots Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Your Pots</Text>
          <TouchableOpacity onPress={() => setScanning(true)}>
            <Text style={styles.addButton}>Add +</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.plantsGrid}>
          {pots.length > 0 ? (
            pots.map((plant: { uuid: string; assignedPlant?: { photo?: string }; name: string }) => (
              <TouchableOpacity
                key={plant.uuid}
                style={styles.plantCard}
                onPress={() =>
                  router.push({
                    pathname: "/pot-details",
                    params: {
                      plant: JSON.stringify(plant),
                    },
                  })
                }>
                <Image
                  source={{ uri: plant.assignedPlant?.photo || "https://via.placeholder.com/150" }}
                  style={styles.plantImage}
                />
                <Text style={styles.potName}>{plant.name}</Text>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.noPotsText}>No pots added yet. Start by adding one!</Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5F5" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },
  logoContainer: { flexDirection: "row", alignItems: "center" },
  logoText: { marginLeft: 10, fontSize: 20, fontWeight: "600", color: "#4CAF50" },
  scrollView: { flex: 1 },
  welcomeSection: {
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 15,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
  },
  subtitle: {
    fontSize: 28,
    color: "#666",
    marginTop: 5,
  },
  bannerContainer: {
    marginHorizontal: 20,
    borderRadius: 15,
    overflow: "hidden",
    marginBottom: 20,
  },
  bannerImage: { width: "100%", height: 150, resizeMode: "cover" },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 30,
    marginBottom: 15,
  },
  sectionTitle: { fontSize: 18, fontWeight: "600", color: "#333" },
  addButton: { color: "#4CAF50", fontWeight: "500", fontSize: 16 },
  plantsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 40,
    marginBottom: 30,
  },
  plantCard: {
    width: "48%",
    marginBottom: 15,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  plantImage: { width: "100%", height: 120, resizeMode: "cover" },
  potName: { padding: 10, fontWeight: "500", color: "#333" },
  noPotsText: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
    marginTop: 20,
  },
  scanContainer: {
    flex: 1,
    backgroundColor: "#1B1B1B",
    alignItems: "center",
    paddingTop: 60,
  },
  scanHeader: {
    fontSize: 20,
    fontWeight: "600",
    color: "white",
    marginBottom: 20,
  },
  cameraBox: {
    width: 300,
    height: 300,
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "#4CAF50",
  },
  cameraView: { width: "100%", height: "100%" },
  cancelBtn: {
    marginTop: 30,
    backgroundColor: "#4CAF50",
    paddingHorizontal: 25,
    paddingVertical: 10,
    borderRadius: 25,
  },
  cancelText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
});

export default HomeScreen;