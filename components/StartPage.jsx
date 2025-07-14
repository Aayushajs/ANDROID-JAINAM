import React, { useEffect, useRef } from "react";
import { View, StyleSheet, TouchableOpacity, Animated, Text } from "react-native";

const StartPage = ({ navigation }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateYAnim = useRef(new Animated.Value(50)).current;
  const titleFadeAnim = useRef(new Animated.Value(0)).current;
  const titleTranslateYAnim = useRef(new Animated.Value(20)).current;

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
        delay: 500, // Delay the title animation to start after the image animation
        useNativeDriver: true,
      }),
      Animated.timing(titleTranslateYAnim, {
        toValue: 0,
        duration: 1000,
        delay: 500, // Delay the title animation to start after the image animation
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, translateYAnim, titleFadeAnim, titleTranslateYAnim]);

  return (
    <View style={styles.container}>
      <View style={styles.topSection}>
        <Animated.Image
          source={require("../assets/registration.png")}
          style={[styles.image, { opacity: fadeAnim, transform: [{ translateY: translateYAnim }] }]}
          resizeMode="cover"
        />
      </View>
      <View style={styles.middleSection}>
        <Animated.Text style={[styles.title, { opacity: titleFadeAnim, transform: [{ translateY: titleTranslateYAnim }] }]}>
          Discover Your Own Dream House
        </Animated.Text>
        <Animated.Text style={[styles.description, { opacity: fadeAnim }]}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Diam maecenas mi non sed ut odio. Non, justo, sed facilisi et. Eget viverra urna, vestibulum egestas faucibus egestas. Sagittis nam vel volutpat eu nunc.
        </Animated.Text>
      </View>
      <View style={styles.bottomSection}>
        <TouchableOpacity style={styles.signInButton} onPress={() => navigation.navigate("SignIn")}>
          <Animated.Text style={[styles.signInText, { opacity: fadeAnim }]}>Sign In</Animated.Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    alignItems: "center",
    justifyContent: "center",
  },
  topSection: {
    flex: 1,
    alignItems: "center",
  },
  image: {
    width: '150%',
    height: '89%',
    position: "absolute",
    top: 40,
    borderRadius: 30,
  },
  middleSection: {
    flex: 1,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  title: {
    top: 4,
    fontSize: 26,
    fontWeight: "800",
    fontFamily: 'serif',
    color: "white",
    textAlign: "center",
    marginBottom: 10,
  },
  description: {
    top: 5,
    fontSize: 16,
    color: "rgba(255, 255, 255,0.5)",
    textAlign: "center",
    lineHeight: 24,
    fontFamily: "serif",
  },
  bottomSection: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 20,
    top: -12,
    width: '100%',
  },
  signInButton: {
    width: '100%', // Slightly less than full width for better aesthetics
    backgroundColor: "white",
    paddingVertical: 15,
    borderRadius: 25,
    marginBottom: 15,
    alignItems: "center",
    shadowOpacity: 0.8,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  registerButton: {
    width: '100%', // Slightly less than full width for better aesthetics
    backgroundColor: "rgba(255,255,255,0.1)",
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.5)",
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: "center",
  },
  signInText: {
    fontSize: 16,
    color: "black", // Changed to black for better contrast
    fontWeight: "700",
    fontFamily: "serif",
  },
  registerText: {
    fontSize: 16,
    color: "white", // Changed to white for better contrast
    fontWeight: "700",
    fontFamily: "serif",
  },
});

export default StartPage;