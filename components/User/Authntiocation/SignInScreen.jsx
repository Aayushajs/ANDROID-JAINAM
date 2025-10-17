import React, { useEffect, useRef } from "react";
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
  ScrollView,
  Dimensions,
  StatusBar,
  Keyboard,
  TouchableWithoutFeedback,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColorScheme } from 'react-native';
import { useAuth } from "../../context/AuthContext";
import LottieView from 'lottie-react-native';
import { loginUser } from "../../../Apis/ApiSlashing";

// Get screen dimensions for responsive design
const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

const SignInScreen = ({ navigation }) => {
  const { login: authLogin } = useAuth();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [keyboardVisible, setKeyboardVisible] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const particleAnim = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef(null);
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  // Theme colors copied from WelcomePage for consistent look
  const bgColor = isDark ? '#181A20' : '#FFFFFF';
  const textColor = isDark ? '#FFFFFF' : '#181A20';
  const subtitleColor = isDark ? 'rgba(255,255,255,0.75)' : 'rgba(24,26,32,0.7)';
  const accentColor = isDark ? '#cf7393ff' : '#0e0e0eff';
    const outo = isDark ? '#cf7393ff' : '#000000ff';
  const inputBg = isDark ? 'rgba(255,255,255,0.06)' : '#fff';

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

  // Keyboard event listeners
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setKeyboardVisible(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardVisible(false);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

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

  const handleSubmit = async () => {

    setError("");

    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    // Password validation
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);
      
      // Call loginUser API from ApiSlashing.js
      const result = await loginUser({
        email: email,
        password: password
      });

      // console.log("Login result:", result);

      if (result.success) {
        if (authLogin && result.data) {
          // server may nest actual payload inside result.data.data — prefer that if present
          const payload = result.data?.data || result.data;
          await authLogin(payload);
        }

      } else {
        setError(result.message || "Login failed. Please check your credentials.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={bgColor} />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={[styles.container, { backgroundColor: bgColor }]}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : -200}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <LinearGradient
            // subtle two-stop gradient using the base bg for depth
            colors={isDark ? [bgColor, '#0F172A'] : [bgColor, '#F8FAFC']}
            style={[styles.background, { paddingTop: insets.top }]}
          >
            {/* Header with back arrow and Logo Text - Hide when keyboard is visible */}
            {!keyboardVisible && (
              <View style={[styles.header, { left: 12, top: Math.max(16, screenHeight * 0.07) }]}> 
                <TouchableOpacity
                  onPress={() => navigation.goBack()}
                  accessibilityLabel="Go back"
                  style={{ marginRight: 8, padding: 6 }}
                >
                  <MaterialCommunityIcons name="arrow-left" size={24} color={textColor} />
                </TouchableOpacity>

                <Image
                  source={{ uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQumTE4MdxmvhSlr5noO5NpjvvUWD3Psu8j0A&s" }}
                  style={styles.logo}
                />
                <View style={styles.logoTextContainer}>
                  {["M", "E", "D", "I", "C", "A", "R", "E", "+"].map((letter, index) => (
                    <Animated.Text
                      key={index}
                      style={[
                        styles.logoText,
                        index < 4 ? styles.redText : styles.whiteText,
                        styles.customFont,
                        {
                          color: textColor,
                          transform: [{ translateY: logoAnimations[index] }],
                        },
                      ]}
                    >
                      {letter}
                    </Animated.Text>
                  ))}
                </View>
              </View>
            )}

            {/* Content Container */}
            <View style={styles.formContainer}>
              <ScrollView
                ref={scrollViewRef}
                contentContainerStyle={[
                  styles.scrollContent,
                  keyboardVisible && styles.scrollContentKeyboard,
                ]}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                bounces={false}
              >
                <View style={[styles.content, keyboardVisible && styles.contentKeyboard, { backgroundColor: isDark ? 'transparent' : 'rgba(255,255,255,0.02)' }]}>
                  {/* Lottie Animation above Welcome Back - hide when keyboard is visible */}
                  {!keyboardVisible && (
                    <View style={styles.lottieContainer}>
                      <LottieView
                        source={require("../../../assets/animations/Social Media Influencer.json")}
                        autoPlay
                        loop
                        style={styles.lottie}
                      />
                    </View>
                  )}
                  <Text style={[styles.title, { color: textColor }]}>Welcome Back</Text>
                  <Text style={[styles.subtitle, { color: subtitleColor, marginBottom: 20 }]}>Access your pharmacy account for health solutions</Text>

                  <View style={[styles.inputContainer, { backgroundColor: inputBg, marginTop: 8 }]}> 
                    <MaterialCommunityIcons
                      name="email-outline"
                      size={22}
                      color={subtitleColor}
                      style={styles.icon}
                    />
                    <TextInput
                      placeholder="Email or Phone Number"
                      placeholderTextColor={subtitleColor}
                      style={[styles.input, { color: textColor, paddingVertical: 12 }]}
                      value={email}
                      onChangeText={setEmail}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      returnKeyType="next"
                      textContentType="username"
                      importantForAutofill="yes"
                      onSubmitEditing={() => {
                        // Focus next input if needed
                      }}
                    />
                  </View>

                  <View style={[styles.inputContainer, { backgroundColor: inputBg, marginTop: 12 }]}> 
                    <MaterialCommunityIcons
                      name="lock-outline"
                      size={22}
                      color={subtitleColor}
                      style={styles.icon}
                    />
                    <TextInput
                      placeholder="Enter Your Password"
                      placeholderTextColor={subtitleColor}
                      style={[styles.input, { color: textColor, paddingVertical: 12 }]}
                      secureTextEntry={!showPassword}
                      value={password}
                      onChangeText={setPassword}
                      returnKeyType="done"
                      textContentType="password"
                      importantForAutofill="yes"
                      onSubmitEditing={handleSubmit}
                    />
                    <TouchableOpacity
                      onPress={() => setShowPassword(!showPassword)}
                      style={styles.eyeIcon}
                      accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
                    >
                      <MaterialCommunityIcons
                        name={showPassword ? "eye-off" : "eye"}
                        size={20}
                        color={subtitleColor}
                      />
                    </TouchableOpacity>
                  </View>

                  <TouchableOpacity
                    style={[styles.button, loading && { opacity: 0.7, transform: [{ scale: 0.995 }] }]}
                    onPress={handleSubmit}
                    disabled={loading}
                    accessibilityLabel="Access Pharmacy"
                  >
                    <LinearGradient
                      colors={[accentColor, accentColor]}
                      style={[styles.buttonInner, { paddingVertical: 14, borderRadius: 12, width: '100%' }]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                    >
                      {loading ? (
                        <ActivityIndicator color="#fff" />
                      ) : (
                        <View style={[styles.buttonContent, { justifyContent: 'center' }]}>
                          <MaterialCommunityIcons name="login" size={18} color="#FFF" />
                          <Text style={styles.buttonText}>Access Pharmacy</Text>
                        </View>
                      )}
                    </LinearGradient>
                  </TouchableOpacity>

                  {/* Forget Password Link */}
                  <TouchableOpacity style={styles.forgotPasswordContainer} onPress={() => navigation.navigate("ForgotPassword")}> 
                    <Text style={[styles.forgotPasswordText, { color: outo }]}>Forgot Password? <MaterialCommunityIcons name="help-circle-outline" size={14} color={outo} /></Text>
                  </TouchableOpacity>

                  {error && <Text style={[styles.errorText, { backgroundColor: 'rgba(239,68,68,0.08)', color: '#EF4444' }]}>{error}</Text>}

                  {/* OAuth Buttons */}
                  <View style={styles.oauthContainer}>
                    <Text style={[styles.oauthTitle, { color: subtitleColor }]}>Or continue with</Text>
                    <View style={styles.oauthButtonsRow}>
                      {/* Google OAuth */}
                      <TouchableOpacity style={[styles.oauthButton, { backgroundColor: inputBg }]}> 
                        <Image
                          source={{ uri: "https://crystalpng.com/wp-content/uploads/2025/05/google-logo-png.png" }}
                          style={styles.oauthLogo}
                          resizeMode="contain"
                        />
                      </TouchableOpacity>

                      {/* Guest Account */}
                      <TouchableOpacity style={[styles.oauthButton, { backgroundColor: inputBg }]}> 
                        <Image
                          source={{ uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSLDvv2ijoL0v9aPkHz99nGIE76EvFig_JqkA&s" }}
                          style={styles.oauthLogo}
                          resizeMode="contain"
                        />
                      </TouchableOpacity>

                      {/* Facebook OAuth */}
                      <TouchableOpacity style={[styles.oauthButton, { backgroundColor: inputBg }]}> 
                        <Image
                          source={{ uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTAc2qnQvWBFUJo16J7KCxCTQ8TZcMpMwRMg_XdZ2VwI19HGH7MSg7RwoMDPZ05WQG8STg&usqp=CAU" }}
                          style={styles.oauthLogo}
                          resizeMode="contain"
                        />
                      </TouchableOpacity>
                    </View>
                  </View>

                  <TouchableOpacity style={styles.footer} onPress={() => navigation.navigate("SignUp")}> 
                    <Text style={[styles.footerText, { color: subtitleColor }]}>New to MediCare+? <Text style={[styles.footerLink, { color: accentColor }]}><MaterialCommunityIcons name="account-plus" size={16} color={accentColor} /> Create Account</Text></Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </LinearGradient>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </>
  );
};

const styles = StyleSheet.create({
  lottieContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    marginTop: -55,
  },
  lottie: {
    width: 150,
    height: 150,
    marginBottom: 0,
  },
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    justifyContent: "center",
    marginBottom: 0,
    paddingHorizontal: screenWidth * 0.06,
    paddingBottom: screenHeight * 0.04,
  },
  topBackgroundImage: {
    position: "absolute",
    top: 85,
    left: 0,
    right: 0,
    width: "auto",
    height: 280,
    zIndex: 1,
    transform: [{ rotateZ: "40deg" }],
    opacity: 0.8,
  },
  header: {
    position: "absolute",
    flexDirection: "row",
    alignItems: "center",
    zIndex: 3,
  },
  logo: {
    width: screenWidth * 0.1,
    height: screenWidth * 0.1,
    marginRight: screenWidth * 0.02,
    borderRadius: (screenWidth * 0.1) / 2,
  },
  logoTextContainer: {
    flexDirection: "row",
    marginTop: screenHeight * 0.005,
  },
  logoText: {
    fontSize: screenWidth * 0.04, // Responsive font size
    fontWeight: "700",
  },
  redText: {
    color: "red",
  },
  whiteText: {
    color: "white",
  },
  customFont: {
    fontFamily: "serif",
    textTransform: "uppercase",
    letterSpacing: 1.5,
    textShadowColor: "rgba(255, 255, 255, 0.3)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  content: {
    marginTop: screenHeight * 0.2,
    width: "100%",
    padding: screenWidth * 0.06,
    backgroundColor: "transparent",
    borderRadius: screenWidth * 0.04,
    marginHorizontal: 0,
    zIndex: 2,
    paddingTop: screenHeight * 0.03,
    paddingBottom: screenHeight * 0.03,
    marginBottom: screenHeight * 0.06,
    // Glassmorphism effect - border removed
  },
  contentKeyboard: {
    marginTop: screenHeight * 0.02,
    paddingTop: screenHeight * 0.02,
    paddingBottom: screenHeight * 0.02,
    marginBottom: screenHeight * 0.05,
  },
  formContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "transparent",
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: screenWidth * 0.025,
    minHeight: screenHeight,
    
  },
  scrollContentKeyboard: {
    justifyContent: "flex-start",
    paddingTop: screenHeight * 0.05,
    minHeight: screenHeight * 0.7,
  },
  particle: {
    position: "absolute",
    borderRadius: 50,
    zIndex: 0,
  },
  title: {
    fontSize: screenWidth * 0.08, // Responsive title
    fontWeight: "700",
    color: "#F8FAFC",
    marginLeft: screenWidth * 0.025,
    marginBottom: screenHeight * 0.01,
    textAlign: "left",
  },
  subtitle: {
    fontSize: screenWidth * 0.038, // Responsive subtitle
    color: "#94A3B8",
    marginBottom: screenHeight * 0.01,
    marginLeft: 0,
    lineHeight: screenWidth * 0.052,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(162, 56, 56, 0.12)",
    borderRadius: screenWidth * 0.04,
    marginTop: screenHeight * 0.02,
    paddingHorizontal: screenWidth * 0.04,
    minHeight: screenHeight * 0.06,
    // Enhanced shadow
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  icon: {
    marginRight: screenWidth * 0.025,
  },
  input: {
    flex: 1,
    paddingVertical: screenHeight * 0.012,
    color: "#FFF",
    fontSize: screenWidth * 0.038,
  },
  eyeIcon: {
    padding: screenWidth * 0.02,
  },
  button: {
    borderRadius: 20,
    overflow: "hidden",
    marginTop: screenHeight * 0.035,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  buttonInner: {
    paddingVertical: screenHeight * 0.015,
    alignItems: "center",
    minHeight: screenHeight * 0.06,
    justifyContent: "center",
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: screenWidth * 0.02,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: screenWidth * 0.04,
    fontWeight: "600",
  },
  footer: {
    marginTop: screenHeight * 0.02,
    alignItems: "center",
  },
  footerText: {
    color: "#94A3B8",
    fontSize: screenWidth * 0.034,
    textAlign: "center",
  },
  footerLink: {
    color: "#3B82F6",
    fontWeight: "600",
  },
  forgotPasswordContainer: {
    alignItems: "flex-end",
    marginTop: screenHeight * 0.01,
    marginRight: screenWidth * 0.02,
  },
  forgotPasswordText: {
    color: "#3B82F6",
    fontSize: screenWidth * 0.035,
    fontWeight: "500",
  },
  errorText: {
    color: "#EF4444",
    textAlign: "center",
    marginTop: screenHeight * 0.02,
    fontSize: screenWidth * 0.035,
    backgroundColor: "rgba(239, 68, 68, 0.1)",
    padding: screenWidth * 0.025,
    borderRadius: screenWidth * 0.02,
    marginHorizontal: screenWidth * 0.05,
  },
  oauthContainer: {
    marginTop: screenHeight * 0.03,
    alignItems: "center",
    
  },
  oauthTitle: {
    color: "#94A3B8",
    fontSize: screenWidth * 0.033,
    marginBottom: screenHeight * 0.02,
    textAlign: "center",
  },
  oauthButtonsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "66%",
    alignSelf: 'center',
  },
  oauthButton: {
    width: screenWidth * 0.14, // Responsive button size
    height: screenWidth * 0.14,
    borderRadius: screenWidth * 0.07,
    backgroundColor: "rgba(255, 255, 255, 0.12)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  oauthLogo: {
    width: screenWidth * 0.12,
    height: screenWidth * 0.12,
    borderRadius: screenWidth * 0.06,
    
  },
});

export default SignInScreen;
