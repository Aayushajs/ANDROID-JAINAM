import React, { useState, useCallback } from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  ScrollView,
  RefreshControl,
} from "react-native";


import HeaderPage from "./HeaderPage";
import HeroSection from "./Herosection";

const HomePage = ({ navigation }) => {
  const [refreshing, setRefreshing] = useState(false);
  const [pageKey, setPageKey] = useState(0); // Unique key to force re-render

  const onRefresh = useCallback(() => {
    setRefreshing(true);

    // Simulate refresh process
    setTimeout(() => {
      // Increment key to force component re-render
      setPageKey((prevKey) => prevKey + 1);
      setRefreshing(false);
    }, 1500);
  }, []);

  return (
    <View style={styles.container}>
      <HeaderPage />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Wrapper with key to force full re-render */}
        <View key={pageKey}>
          <HeroSection />
        </View>
      </ScrollView>
    </View>
  );
};

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  scrollContent: {
    paddingTop: 0.5,
  },
  bannerContainer: {
    top: -6,
    position: "relative",
    width: "100%",
    height: 250,
    padding: 20,
    borderTopStartRadius: 40,
    overflow: "hidden",
    marginBottom: 0,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 6,
    borderBottomRightRadius: 40,
  },
  bannerImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    borderRadius: 40,
    backgroundColor: "#ccc",
  },
  bannerOverlay: {
    position: "absolute",
    top: 21,
    borderTopStartRadius: 40,
    borderTopEndRadius: 40,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    left: 19,
    right: 19,
    bottom: 19,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  bannerText: {
    fontSize: 25,
    fontWeight: "bold",
    fontStyle: "italic",
    fontFamily: "serif",
    color: "#fff",
    textAlign: "center",
    letterSpacing: 1.4,
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 10,
  },
  bannerSubText: {
    fontSize: 18,
    color: "#d1d1d1",
    textAlign: "center",
    marginTop: 10,
    paddingHorizontal: 20,
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },
  featuresSection: {
    marginTop: 0,
    padding: 10,
    borderTopStartRadius: 40,
    borderBottomRightRadius: 40,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1e1e2e",
    textAlign: "center",
    marginBottom: 20,
  },
  featureCards: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
  },
  featureCard: {
    width: "48%",
    backgroundColor: "#fff",
    borderTopStartRadius: 50,
    borderBottomRightRadius: 50,
    padding: 15,
    marginBottom: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 9 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 15,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1e1e2e",
    marginTop: 10,
  },
  featureDescription: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginTop: 10,
  },
});

export default HomePage;
