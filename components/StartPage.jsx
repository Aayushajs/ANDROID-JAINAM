import React, { useEffect, useRef } from "react";
import { View, StyleSheet, TouchableOpacity, Animated, Text, StatusBar, useColorScheme, Dimensions, Platform } from "react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';

const StartPage = ({ navigation }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateYAnim = useRef(new Animated.Value(50)).current;
  const titleFadeAnim = useRef(new Animated.Value(0)).current;
  const titleTranslateYAnim = useRef(new Animated.Value(20)).current;
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const insets = useSafeAreaInsets();
  const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      }),
      Animated.timing(translateYAnim, {
        toValue: 0,
        duration: 1500,
        useNativeDriver: true,
      }),
      Animated.timing(titleFadeAnim, {
        toValue: 1,
        duration: 1000,
        delay: 500,
        useNativeDriver: true,
      }),
      Animated.timing(titleTranslateYAnim, {
        toValue: 0,
        duration: 1000,
        delay: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, translateYAnim, titleFadeAnim, titleTranslateYAnim]);

  // StatusBar color logic
  const barStyle = isDark ? 'light-content' : 'dark-content';
  const bgColor = isDark ? '#181A20' : '#FFFFFF';
  const textColor = isDark ? '#FFFFFF' : '#181A20';
  const accentColor = isDark ? '#cf7393ff' : '#0e0e0eff';
  const iconColor = isDark ? '#FFFFFF' : '#181A20';

  // Responsive image size
  const imageWidth = screenWidth * 0.85;
  const imageHeight = screenHeight * 0.32;

  return (
    <View style={[styles.container, { backgroundColor: bgColor, paddingTop: insets.top }]}>
      <StatusBar barStyle={barStyle} backgroundColor={bgColor} translucent={Platform.OS === 'android'} />
      {/* Back Arrow */}
      <View style={[styles.headerRow, { marginTop: insets.top + 8, marginBottom: 8 }]}> 
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Icon name="arrow-back" size={28} color={iconColor} />
        </TouchableOpacity>
      </View>
      <View style={styles.topSection}>
        <Animated.Image
          source={require("../assets/registration.png")}
          style={{
            width: imageWidth,
            height: imageHeight,
            borderRadius: 30,
            opacity: fadeAnim,
            transform: [{ translateY: translateYAnim }],
          }}
          resizeMode="cover"
        />
      </View>
      <View style={styles.middleSection}>
        <Animated.Text style={[styles.title, {
          opacity: titleFadeAnim,
          transform: [{ translateY: titleTranslateYAnim }],
           color: isDark ? 'rgba(255, 255, 255, 0.9)' : 'rgba(30, 32, 39, 0.7)',
        }]}>MediCare+ Digital Pharmacy</Animated.Text>
        <Animated.Text style={[styles.description, {
          opacity: fadeAnim,
          color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(24,26,32,0.7)',
        }]}>Get authentic medicines delivered to your doorstep. Upload prescriptions, consult licensed pharmacists, track orders in real-time, and manage your family's health with complete privacy and security.</Animated.Text>
      </View>
      <View style={styles.bottomSection}>
        <TouchableOpacity style={[styles.signInButton, { backgroundColor: accentColor }]} onPress={() => navigation.navigate("SignIn")}> 
          <Animated.Text style={[styles.signInText, {
            opacity: fadeAnim,
            color: '#fff',
          }]}>Order Medicines Now</Animated.Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    width: '100%',
    minHeight: '100%',
  },
  headerRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 0,
  },
  backBtn: {
    padding: 6,
    borderRadius: 20,
    backgroundColor: 'transparent',
  },
  topSection: {
    width: '100%',
    alignItems: "center",
    justifyContent: 'center',
    marginBottom: 8,
  },
  middleSection: {
    width: '100%',
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    fontFamily: Platform.OS === 'android' ? 'serif' : 'System',
    textAlign: "center",
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
    fontFamily: Platform.OS === 'android' ? 'serif' : 'System',
    marginBottom: 8,
  },
  bottomSection: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 20,
    width: '100%',
  },
  signInButton: {
    width: '100%',
    paddingVertical: 15,
    borderRadius: 25,
    marginBottom: 15,
    alignItems: "center",
    shadowOpacity: 0.8,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  signInText: {
    fontSize: 16,
    fontWeight: "700",
    fontFamily: Platform.OS === 'android' ? 'Roboto' : 'System',
  },
});

export default StartPage;