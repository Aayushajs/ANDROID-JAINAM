/* Professional Header Component with Center Logo Animation and Side Icons */
import React, { useEffect, useRef } from "react";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../../context/AuthContext";
import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  StatusBar,
  StyleSheet,
  Animated,
  Dimensions,
  Image,
  useColorScheme,
} from "react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { LinearGradient } from "expo-linear-gradient";

// Get screen dimensions for responsive design
const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

const HeaderPage = () => {
  const navigation = useNavigation();
  const { logout } = useAuth();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const insets = useSafeAreaInsets();

  // Animated values for each letter in the center logo (MEDICARE+)
  const logoAnimations = useRef([
    new Animated.Value(-100), // M
    new Animated.Value(-100), // E
    new Animated.Value(-100), // D
    new Animated.Value(-100), // I
    new Animated.Value(-100), // C
    new Animated.Value(-100), // A
    new Animated.Value(-100), // R
    new Animated.Value(-100), // E
    new Animated.Value(-100), // +
  ]).current;

  // Side elements animation
  const leftLogoAnim = useRef(new Animated.Value(-50)).current;
  const rightIconsAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    // Animate center logo letters sequentially
    const logoLetterAnimations = logoAnimations.map((anim, index) =>
      Animated.timing(anim, {
        toValue: 0,
        duration: 400,
        delay: index * 100, // Stagger each letter
        useNativeDriver: true,
      })
    );

    // Animate side elements
    const sideAnimations = [
      Animated.timing(leftLogoAnim, {
        toValue: 0,
        duration: 800,
        delay: 200,
        useNativeDriver: true,
      }),
      Animated.timing(rightIconsAnim, {
        toValue: 0,
        duration: 800,
        delay: 400,
        useNativeDriver: true,
      }),
    ];

    // Start all animations
    Animated.parallel([...logoLetterAnimations, ...sideAnimations]).start();
  }, []);

  // Fixed header height for production reliability
  const statusBarHeight = Platform.OS === 'android' ? (StatusBar.currentHeight || 24) : insets.top;
  const headerHeight = statusBarHeight + 64; // 64px header + status bar

  return (
    <LinearGradient
      colors={isDark ? ['#1A1A1A', '#2A2A2A'] : ['#FFFFFF', '#F8F9FA']}
  style={[styles.headerContainer, { paddingTop: statusBarHeight, height: headerHeight, minHeight: headerHeight, maxHeight: headerHeight }]}
    >
      {/* Left Side Logo */}
      <Animated.View 
        style={[
          styles.leftLogoContainer,
          { transform: [{ translateX: leftLogoAnim }] }
        ]}
      >
        <Image
          source={{
            uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQumTE4MdxmvhSlr5noO5NpjvvUWD3Psu8j0A&s"
          }}
          style={styles.leftLogo}
        />
      </Animated.View>

      {/* Center Animated Logo */}
      <View style={styles.centerLogoContainer}>
        <View style={styles.logoTextContainer}>
          {["M", "E", "D", "I", "C", "A", "R", "E", "+"].map((letter, index) => (
            <Animated.Text
              key={index}
              style={[
                styles.logoText,
                index < 4 ? styles.primaryText : styles.secondaryText,
                {
                  transform: [{ translateY: logoAnimations[index] }],
                  color: isDark ? (index < 4 ? '#FF6B6B' : '#FFFFFF') : (index < 4 ? '#E53935' : '#1F2937')
                },
              ]}
            >
              {letter}
            </Animated.Text>
          ))}
        </View>
      </View>

      {/* Right Side Icons */}
      <Animated.View
        style={[
          styles.rightIconsContainer,
          { transform: [{ translateX: rightIconsAnim }] }
        ]}
      >
        {/* Notification Icon */}
        <TouchableOpacity
          style={[styles.iconButton, { backgroundColor: isDark ? '#3A3A3A' : '#F0F0F0' }]}
          onPress={() => navigation.navigate('Notifications')}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons 
            name="bell-outline" 
            size={screenWidth * 0.055} 
            color={isDark ? '#FFFFFF' : '#333333'} 
          />
        </TouchableOpacity>

        {/* Profile Avatar */}
        <TouchableOpacity
          style={[styles.avatarButton, { backgroundColor: isDark ? '#FF6B6B' : '#E53935' }]}
          onPress={() => navigation.navigate("ProfilePage")}
          activeOpacity={0.8}
        >
          <Text style={styles.avatarText}>A</Text>
        </TouchableOpacity>
      </Animated.View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: screenWidth * 0.04,
    paddingBottom: 10,
    // Shadow for depth
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    backgroundColor: 'transparent',
  },

  // Left Side Logo
  leftLogoContainer: {
    width: screenWidth * 0.2,
    alignItems: 'flex-start',
  },
  leftLogo: {
    width: screenWidth * 0.08,
    height: screenWidth * 0.08,
    borderRadius: screenWidth * 0.04,
  },

  // Center Logo Animation (like SignInScreen)
  centerLogoContainer: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginLeft: screenWidth * -0.09, // gap-2 equivalent
  },
  logoTextContainer: {
    flexDirection: "row",
    alignItems: 'center',
  },
  logoText: {
    fontSize: screenWidth * 0.045, // Increased text size
    fontWeight: "bold",
    fontFamily: Platform.OS === 'android' ? 'Roboto' : 'System',
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  primaryText: {
    // Color set dynamically in component
  },
  secondaryText: {
    // Color set dynamically in component
  },

  // Right Side Icons
  rightIconsContainer: {
    width: screenWidth * 0.2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: 'flex-end',
    gap: screenWidth * 0.025,
  },
  iconButton: {
    padding: screenWidth * 0.025,
    borderRadius: screenWidth * 0.06,
    // Shadow for depth
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  avatarButton: {
    width: screenWidth * 0.09,
    height: screenWidth * 0.09,
    borderRadius: screenWidth * 0.045,
    alignItems: 'center',
    justifyContent: 'center',
    // Shadow for depth
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 4,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: screenWidth * 0.04,
    fontWeight: 'bold',
    fontFamily: Platform.OS === 'android' ? 'Roboto' : 'System',
  },
});

export default HeaderPage;
