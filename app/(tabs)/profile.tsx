import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, SafeAreaView, Modal, Animated } from "react-native"
import { Feather, Ionicons } from "@expo/vector-icons"
import { useAuth } from "../AuthContext"
import { useState, useRef, useEffect } from "react"

type PotCardProps = {
  name: string;
  moisture: number;
  sunlight: number;
  temperature: number;
  image: string;
};

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const [showMenu, setShowMenu] = useState(false);
  const slideAnim = useRef(new Animated.Value(300)).current;

  useEffect(() => {
    if (showMenu) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 50,
        friction: 7,
      }).start();
    } else {
      Animated.spring(slideAnim, {
        toValue: 300,
        useNativeDriver: true,
        tension: 50,
        friction: 7,
      }).start();
    }
  }, [showMenu]);

  const handleCloseMenu = () => {
    setShowMenu(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Ionicons name="leaf" size={24} color="#4CAF50" />
          <Text style={styles.logoText}>GreenTech Pots</Text>
        </View>
        <TouchableOpacity onPress={() => setShowMenu(true)}>
          <Feather name="settings" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      {/* Settings Menu Modal */}
      <Modal
        visible={showMenu}
        transparent
        animationType="none"
        onRequestClose={handleCloseMenu}>
        <View style={styles.modalOverlay}>
          <TouchableOpacity style={styles.modalOverlay} onPress={handleCloseMenu} />
          <Animated.View 
            style={[
              styles.menuContainer,
              { transform: [{ translateX: slideAnim }] }
            ]}>
            <View style={styles.menuHeader}>
              <Text style={styles.menuTitle}>Settings</Text>
              <TouchableOpacity onPress={handleCloseMenu}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.menuContent}>
              <TouchableOpacity style={styles.menuItem} onPress={() => {
                handleCloseMenu();
                // Add profile edit functionality here
              }}>
                <Ionicons name="person-outline" size={24} color="#333" />
                <Text style={styles.menuItemText}>Edit Profile</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.menuItem} onPress={() => {
                handleCloseMenu();
                // Add notifications settings here
              }}>
                <Ionicons name="notifications-outline" size={24} color="#333" />
                <Text style={styles.menuItemText}>Notifications</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.menuItem} onPress={() => {
                handleCloseMenu();
                // Add help & support here
              }}>
                <Ionicons name="help-circle-outline" size={24} color="#333" />
                <Text style={styles.menuItemText}>Help & Support</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.menuItem, styles.logoutItem]} 
                onPress={() => {
                  handleCloseMenu();
                  signOut();
                }}>
                <Ionicons name="log-out-outline" size={24} color="#FF5252" />
                <Text style={[styles.menuItemText, styles.logoutText]}>Sign Out</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </Modal>

      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          {/* Profile Section */}
          <View style={styles.profileSection}>
            <View style={styles.avatarContainer}>
              <Image source={{ uri: "https://via.placeholder.com/100" }} style={styles.avatar} />
            </View>
            <Text style={styles.userName}>{user?.username || 'User'}</Text>
            <Text style={styles.userBio}>Plant enthusiast 🌱</Text>
          </View>

          {/* My Smart Pots Section */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>My Smart Pots</Text>
            </View>
            <View style={styles.cardContent}>
            <View style={styles.potsGrid}>
  <PotCard 
    name="Snake Plant" 
    moisture={40} 
    sunlight={80} 
    temperature={24} 
    image="https://rukminim2.flixcart.com/image/440/584/kura1e80/plant-sapling/7/p/s/yes-perennial-yes-snack-plant-hybrid-1-alogardening-original-imag7t2zhzmscvaj.jpeg?q=60&crop=false" 
  />
  <PotCard 
    name="Peace Lily" 
    moisture={50} 
    sunlight={40} 
    temperature={21} 
    image="https://assets.eflorist.com/site/00004321/assets/products/PZM_/sku6980438.jpg?1578779286601&impolicy=hero&impolicy=hero" 
  />
</View>
            </View>
          </View>

          {/* Plant Health Overview */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Plant Health Overview</Text>
            </View>
            <View style={styles.cardContent}>
              <View style={styles.statsGrid}>
                <View style={styles.statBox}>
                  <Text style={styles.statNumber}>2</Text>
                  <Text style={styles.statLabel}>Active Pots</Text>
                </View>
                <View style={styles.statBox}>
                  <Text style={styles.statNumber}>1</Text>
                  <Text style={styles.statLabel}>Need Water</Text>
                </View>
                <View style={styles.statBox}>
                  <Text style={styles.statNumber}>1</Text>
                  <Text style={styles.statLabel}>Need Sunlight</Text>
                </View>
                <View style={styles.statBox}>
                  <Text style={styles.statNumber}>7</Text>
                  <Text style={styles.statLabel}>Days Streak</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionsContainer}>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

function PotCard({ name, moisture, sunlight, temperature, image }: PotCardProps) {
  return (
    <View style={styles.potCard}>
      <View style={styles.potCardHeader}>
        <View style={styles.potImageContainer}>
          <Image source={{ uri: image }} style={styles.potImage} />
        </View>
        <View>
          <Text style={styles.potName}>{name}</Text>
          <Text style={styles.potLastUpdated}>Last updated: 2h ago</Text>
        </View>
      </View>

      <View style={styles.potMetrics}>
        <View style={styles.metricContainer}>
          <View style={styles.metricHeader}>
            <View style={styles.metricLabelContainer}>
              <Ionicons name="water" size={12} color="#2196F3" />
              <Text style={styles.metricLabel}>Moisture</Text>
            </View>
            <Text style={styles.metricValue}>{moisture}%</Text>
          </View>
          <View style={styles.progressBarBackground}>
            <View style={[styles.progressBarFill, { width: `${moisture}%`, backgroundColor: "#2196F3" }]} />
          </View>
        </View>

        <View style={styles.metricContainer}>
          <View style={styles.metricHeader}>
            <View style={styles.metricLabelContainer}>
              <Ionicons name="sunny" size={12} color="#FFC107" />
              <Text style={styles.metricLabel}>Sunlight</Text>
            </View>
            <Text style={styles.metricValue}>{sunlight}%</Text>
          </View>
          <View style={styles.progressBarBackground}>
            <View style={[styles.progressBarFill, { width: `${sunlight}%`, backgroundColor: "#FFC107" }]} />
          </View>
        </View>

        <View style={styles.metricContainer}>
          <View style={styles.metricLabelContainer}>
            <Ionicons name="thermometer" size={12} color="#F44336" />
            <Text style={styles.metricLabel}>Temperature: </Text>
            <Text style={styles.metricValue}>{temperature}°C</Text>
          </View>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  logoText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: "600",
    color: "#4CAF50",
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  profileSection: {
    alignItems: "center",
    marginBottom: 24,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#EFEFEF",
    borderWidth: 4,
    borderColor: "white",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  avatar: {
    width: "100%",
    height: "100%",
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginTop: 12,
  },
  userBio: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  cardHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F5F5F5",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  cardContent: {
    padding: 16,
  },
  potsGrid: {
    flexDirection: "column",
    gap: 12,
  },
  potCard: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: "#EEEEEE",
  },
  potCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  potImageContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(76, 175, 80, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    overflow: "hidden",
  },
  potImage: {
    width: 40,
    height: 40,
  },
  potName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  potLastUpdated: {
    fontSize: 12,
    color: "#999",
  },
  potMetrics: {
    gap: 12,
  },
  metricContainer: {
    gap: 4,
  },
  metricHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  metricLabelContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metricLabel: {
    fontSize: 14,
    color: "#666",
  },
  metricValue: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: "#EEEEEE",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 4,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  statBox: {
    width: "48%",
    backgroundColor: "rgba(76, 175, 80, 0.1)",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    marginBottom: 12,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#4CAF50",
  },
  statLabel: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 16,
  },
  actionButton: {
    backgroundColor: "#4CAF50",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  signOutButton: {
    backgroundColor: "#FF5252",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  buttonIcon: {
    marginRight: 8,
  },
  actionButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
  signOutButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  menuContainer: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 300,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: -2,
      height: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 5,
  },
  menuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  menuTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  menuContent: {
    padding: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  menuItemText: {
    marginLeft: 15,
    fontSize: 16,
    color: '#333',
  },
  logoutItem: {
    marginTop: 20,
    borderBottomWidth: 0,
  },
  logoutText: {
    color: '#FF5252',
  },
})
