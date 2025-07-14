import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Easing,
  Alert,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useAuth } from "../../context/AuthContext";

const SignUpScreen = ({ navigation }) => {
  const { login, loading, error } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const particleAnim = useRef(new Animated.Value(0)).current;

  // Animated values for each letter in the logo
  const logoAnimations = useRef([
    new Animated.Value(-100), // A
    new Animated.Value(-100), // T
    new Animated.Value(-100), // T
    new Animated.Value(-100), // E
    new Animated.Value(-100), // N
    new Animated.Value(-100), // D
    new Animated.Value(-100), // E
    new Animated.Value(-100), // N
    new Animated.Value(-100), // C
    new Animated.Value(-100), // E
  ]).current;

  // Particle animation setup
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(particleAnim, {
          toValue: 1,
          duration: 15000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(particleAnim, {
          toValue: 0,
          duration: 15000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  // Animate each letter in the logo
  useEffect(() => {
    const animateLogo = () => {
      const animations = logoAnimations.map((anim, index) =>
        Animated.timing(anim, {
          toValue: 0, // Move to the final position
          duration: 500, // Animation duration
          delay: index * 200, // Delay each letter's animation
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        })
      );

      Animated.stagger(200, animations).start(); // Start animations with a stagger
    };

    animateLogo();
  }, []);

  // Generate random particles
  const particles = Array(80)
    .fill(null)
    .map((_, i) => ({
      id: i,
      startX: Math.random() * 100,
      startY: Math.random() * 100,
      size: Math.random() * 3 + 2,
      color: `rgba(25,255,255,${Math.random() * 0.3 + 0.1})`,
    }));

  // Handle image upload
  const pickImage = async () => {
    Alert.alert(
      "Image Upload",
      "Image upload functionality requires an external package like expo-image-picker."
    );
  };

  const handleSubmit = async () => {
    if (!email || !password || !fullName || !rollNumber) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    await login(email, password, fullName, rollNumber, profileImage);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "android" ? "margin" : "height"}
      keyboardVerticalOffset={Platform.OS === "android" ? -150 : 0}
      style={styles.container}
    >
      <LinearGradient
        colors={["#000000", "#000000", "#0F172A"]}
        style={styles.background}
      >
        {/* Floating Particles Background */}
        {particles.map((particle) => (
          <Animated.View
            key={particle.id}
            style={[
              styles.particle,
              {
                left: `${particle.startX}%`,
                top: `${particle.startY}%`,
                width: particle.size,
                height: particle.size,
                backgroundColor: particle.color,
                transform: [
                  {
                    translateX: particleAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [-100, 100],
                    }),
                  },
                  {
                    translateY: particleAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [-50, 50],
                    }),
                  },
                ],
              },
            ]}
          />
        ))}

        {/* Header with Logo and Text */}
        <View style={styles.header}>
          <Image
            source={{ uri: "https://via.placeholder.com/50" }}
            style={styles.logo}
          />
          <View style={styles.logoTextContainer}>
            {["A", "T", "T", "E", "N", "D", "E", "N", "C", "E"].map(
              (letter, index) => (
                <Animated.Text
                  key={index}
                  style={[
                    styles.logoText,
                    index < 2 ? styles.redText : styles.whiteText,
                    styles.customFont,
                    { transform: [{ translateY: logoAnimations[index] }] },
                  ]}
                >
                  {letter}
                </Animated.Text>
              )
            )}
          </View>
        </View>

        {/* Form Container */}
        <View style={styles.formContainer}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.content}>
              <Text style={styles.title}>SignUp</Text>
              <Text style={styles.subtitle}>Create your account</Text>

              {/* Profile Image Upload */}
              <TouchableOpacity
                style={styles.imageUploadContainer}
                onPress={pickImage}
              >
                {profileImage ? (
                  <Image
                    source={{ uri: profileImage }}
                    style={styles.profileImage}
                  />
                ) : (
                  <View style={styles.imagePlaceholder}>
                    <MaterialCommunityIcons
                      name="camera-outline"
                      size={18}
                      color="#F8FAFC"
                    />
                    <Text style={styles.imagePlaceholderText}>Upload</Text>
                  </View>
                )}
              </TouchableOpacity>

              {/* Full Name Input */}
              <View style={styles.inputContainer}>
                <MaterialCommunityIcons
                  name="account-outline"
                  size={24}
                  color="#F8FAFC"
                  style={styles.icon}
                />
                <TextInput
                  placeholder="Full Name"
                  placeholderTextColor="#FFF"
                  style={styles.input}
                  value={fullName}
                  onChangeText={setFullName}
                  autoCapitalize="words"
                />
              </View>

              {/* Roll Number Input */}
              <View style={styles.inputContainer}>
                <MaterialCommunityIcons
                  name="numeric"
                  size={24}
                  color="#F8FAFC"
                  style={styles.icon}
                />
                <TextInput
                  placeholder="Roll Number"
                  placeholderTextColor="#FFF"
                  style={styles.input}
                  value={rollNumber}
                  onChangeText={setRollNumber}
                  keyboardType="numeric"
                />
              </View>

              {/* Email Input */}
              <View style={styles.inputContainer}>
                <MaterialCommunityIcons
                  name="email-outline"
                  size={24}
                  color="#F8FAFC"
                  style={styles.icon}
                />
                <TextInput
                  placeholder="Email address"
                  placeholderTextColor="#FFF"
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              {/* Password Input */}
              <View style={styles.inputContainer}>
                <MaterialCommunityIcons
                  name="lock-outline"
                  size={24}
                  color="#F8FAFC"
                  style={styles.icon}
                />
                <TextInput
                  placeholder="Password"
                  placeholderTextColor="#FFF"
                  style={styles.input}
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                />
              </View>

              {error && <Text style={styles.errorText}>{error}</Text>}

              {/* Sign Up Button */}
              <TouchableOpacity
                style={styles.button}
                onPress={handleSubmit}
                disabled={loading}
              >
                <LinearGradient
                  colors={["#1E293B", "#0F172A", "#1E293B"]}
                  style={styles.buttonInner}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <View style={styles.buttonContent}>
                      <MaterialCommunityIcons
                        name="account-plus"
                        size={20}
                        color="#FFF"
                      />
                      <Text style={styles.buttonText}>Sign Up</Text>
                    </View>
                  )}
                </LinearGradient>
              </TouchableOpacity>

              {/* Footer with Login Link */}
              <TouchableOpacity
                style={styles.footer}
                onPress={() => navigation.navigate("SignIn")}
              >
                <Text style={styles.footerText}>
                  Already have an account?{" "}
                  <Text style={styles.footerLink}>
                    <MaterialCommunityIcons
                      name="login"
                      size={14}
                      color="#3B82F6"
                    />{" "}
                    SignIn
                  </Text>
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    
  },
  background: {
    flex: 1,
    justifyContent: "center",
    padding: 10,
  },
  header: {
    position: "absolute",
    top: 25,
    left: -40,
    flexDirection: "row",
    alignItems: "center",
    zIndex: 3,
  },
  logo: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  logoTextContainer: {
    flexDirection: "row",
  },
  logoText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  redText: {
    color: "red",
  },
  whiteText: {
    color: "white",
  },
  customFont: {
    fontFamily: "YourCustomFont",
    textTransform: "uppercase",
    letterSpacing: 1.5,
    textShadowColor: "rgba(255, 255, 255, 0.3)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  formContainer: {
    position: "absolute",
    top: "20%", // Adjust this value to position the form container
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "transparent",
    overflow: "scroll",
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  content: {
    width: "103%",
    height: "450,",
    borderRadius: 40,
    padding: 10,
    paddingTop: 40,
    backgroundColor: "transparent",
    borderTopRightRadius: 150,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.23)",
    zIndex: 2,
  },
  particle: {
    position: "absolute",
    borderRadius: 50,
    zIndex: 0,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#F8FAFC",
    marginLeft: 10,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 12,
    color: "#94A3B8",
    marginBottom: -75,
    marginLeft: 10,
  },
  imageUploadContainer: {
    alignItems: "center",
    marginBottom: 20,
    margin: 20,
    marginLeft: "85",
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 50,
  },
  imagePlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 50,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  imagePlaceholderText: {
    color: "#F8FAFC",
    marginTop: 5,
    fontSize: 10,
    textAlign: "center",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 15,
    marginBottom: 15,
    paddingHorizontal: 15,
    width: "100%",
    height: 50,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 1,
    color: "#FFF",
    fontSize: 13,
  },
  button: {
    borderRadius: 50,
    overflow: "hidden",
    marginTop: 5,
    width: "100%",
  },
  buttonInner: {
    paddingVertical: 13,
    alignItems: "center",
    textAlign: "center",
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  footer: {
    marginTop: 25,
    alignItems: "center",
  },
  footerText: {
    color: "#94A3B8",
    fontSize: 14,
  },
  footerLink: {
    color: "#3B82F6",
    fontWeight: "600",
  },
  errorText: {
    color: "#EF4444",
    textAlign: "center",
    marginTop: 15,
    fontSize: 14,
  },
});

export default SignUpScreen;
