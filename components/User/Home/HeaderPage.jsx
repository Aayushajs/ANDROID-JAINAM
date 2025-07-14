/* This code snippet is a React component called `HeaderPage` that represents a header section of a
mobile application. Here's a breakdown of what the code is doing: */
import React, { useEffect, useRef } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  View,
  TouchableOpacity,
  Platform,
  StatusBar,
  StyleSheet,
  Animated,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

const HeaderPage = () => {
  const navigation = useNavigation();
  const logoAnim = useRef(new Animated.Value(-200)).current; // Start off-screen left
  const iconsAnim = useRef(new Animated.Value(200)).current; // Start off-screen right
  useEffect(() => {
    Animated.parallel([
      Animated.timing(logoAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(iconsAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View style={styles.headerContainer}>
      {/* Logo */}
      <Animated.Image
        source={{
          uri: "https://dev.screenapp.io/articles/content/images/size/w1000/2023/08/ScreenApp-7.png",
        }}
        style={[styles.logo, { transform: [{ translateX: logoAnim }] }]}
      />

      {/* Icons Container */}
      <Animated.View
        style={[
          styles.iconsContainer,
          { transform: [{ translateX: iconsAnim }] },
        ]}
      >
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() =>  navigation.navigate("Profile")}
        >
          <Icon name="person-circle-outline" size={25} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() =>  navigation.navigate("NotificationPage")}
        >
          <Icon name="notifications-outline" size={25} color="#000" />
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    borderRadius: 0,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    height: 60,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "rgb(22, 21, 21)",
  },
  logo: {
    top: -5,
    position: "relative",
    width: 210,
    marginLeft: -40,
    height: 40,
  },

  iconsContainer: {
    flexDirection: "row",
    top: -5,
    height: 40,
    alignItems: "center",
    gap: 10,
  },
  iconButton: {
    padding: 3,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
    shadowColor: "#fff",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 70,
    elevation: 5,
     
  },
});

export default HeaderPage;
