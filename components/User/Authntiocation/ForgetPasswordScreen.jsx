import React, { useEffect, useRef, useState } from 'react';
import LottieView from 'lottie-react-native';
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
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColorScheme } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

// Get screen dimensions for responsive design
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const ForgetPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [showOtpSection, setShowOtpSection] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  
  const scrollViewRef = useRef(null);
  const insets = useSafeAreaInsets();
  const otpInputRefs = useRef([]);
    const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  // Theme colors copied from WelcomePage for consistent look
  const bgColor = isDark ? '#181A20' : '#FFFFFF';
  const textColor = isDark ? '#FFFFFF' : '#181A20';
  const subtitleColor = isDark ? 'rgba(255,255,255,0.75)' : 'rgba(24,26,32,0.7)';
  const accentColor = isDark ? '#cf7393ff' : '#0e0e0eff';
    const outo = isDark ? '#cf7393ff' : '#000000ff';
  const inputBg = isDark ? 'rgba(255,255,255,0.06)' : '#ffffffff';

  // Animated values for each letter in the logo
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

  // Keyboard event listeners
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
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

  // Timer for OTP resend
  useEffect(() => {
    let interval;
    if (showOtpSection && timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer === 1) {
            setCanResend(true);
          }
          return prevTimer - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [showOtpSection, timer]);

  

  const handleEmailSubmit = async () => {
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    setError('');
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setShowOtpSection(true);
      setTimer(60);
      setCanResend(false);
    }, 2000);
  };

  const handleOtpChange = (text, index) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    // Auto focus next input
    if (text && index < 3) {
      otpInputRefs.current[index + 1]?.focus();
    }

    // Auto verify if all 4 digits entered
    if (newOtp.every(digit => digit !== '') && index === 3) {
      handleOtpVerify();
    }
  };

  const handleOtpKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && index > 0 && !otp[index]) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpVerify = async () => {
    const otpString = otp.join('');
    if (otpString.length !== 4) {
      setError('Please enter complete OTP');
      return;
    }

    setLoading(true);
    setError('');

    // Simulate OTP verification
    setTimeout(() => {
      setLoading(false);
      // Navigate to reset password screen or show success
      navigation.navigate('ResetPassword', { email });
    }, 2000);
  };

  const handleResendOtp = () => {
    if (!canResend) return;
    
    setTimer(60);
    setCanResend(false);
    setOtp(['', '', '', '']);
    setError('');
    
    // Simulate resend API call
    // In real app, make API call here
  };

  return (
    <>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={bgColor} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : -200}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <LinearGradient
            colors={isDark ? [bgColor, '#181A20'] : [bgColor, '#F8FAFC']}
            style={[styles.background, { paddingTop: insets.top }]}
          >
            {/* Lottie animation above Forgot Password */}
            <View style={{ alignItems: 'center', marginBottom: 210, marginTop: -210  }}>
                {/* Lottie animation above Forgot Password, only when keyboard is hidden */}
                {!keyboardVisible && (
                  <View style={{ alignItems: 'center', marginBottom: 10 , }}>
                    <LottieView
                      source={require('../../../assets/animations/404 Lost in Space.json')}
                      autoPlay
                      loop
                      style={{ width: 170, height: 170 }}
                    />
                  </View>
                )}
            </View>
            {!keyboardVisible && (
              <View style={styles.header}>
                <TouchableOpacity 
                  onPress={() => navigation.goBack()}
              style={styles.backButton}
              color={isDark ? '#F8FAFC' : '#262424ff'}
            >
               <MaterialCommunityIcons
                name="arrow-left" 
                size={24}
                color={isDark ? '#F8FAFC' : '#262424ff'}
              />
            </TouchableOpacity>
            <Image
              source={{ uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQumTE4MdxmvhSlr5noO5NpjvvUWD3Psu8j0A&s' }}
              style={styles.logo}
            />
            <View style={styles.logoTextContainer}>
              {['M', 'E', 'D', 'I', 'C', 'A', 'R', 'E', '+'].map((letter, index) => (
                <Animated.Text
                  key={index}
                  style={[
                    styles.logoText,
                    { color: isDark ? '#fff' : 'transparent' },
                    index < 4 ? styles.redText : styles.whiteText,
                    styles.customFont,
                    { transform: [{ translateY: logoAnimations[index] }] },
                  ]}
                >
                  {letter}
                </Animated.Text>
              ))}
            </View>
          </View>
        )}


        <View style={styles.formContainer}>
          <ScrollView 
            ref={scrollViewRef}
            contentContainerStyle={[
              styles.scrollContent,
              keyboardVisible && styles.scrollContentKeyboard
            ]}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            bounces={false}
          >
        <View style={[styles.content, keyboardVisible && styles.contentKeyboard, { backgroundColor: isDark ? 'transparent' : 'rgba(255,255,255,0.02)' }]}>
          {!showOtpSection ? (
            <>
              <Text style={[styles.title, { color: textColor }]}>Forgot Password?</Text>
              <Text style={[styles.subtitle, { color: subtitleColor }]}>Enter your email address to receive a verification code</Text>

              <View style={[styles.inputContainer, { backgroundColor: inputBg }]}>
                <MaterialCommunityIcons
                  name="email-outline"
                  size={24}
                  color={subtitleColor}
                  style={styles.icon}
                />
                <TextInput
                  placeholder="Enter your email address"
                  placeholderTextColor={isDark ? 'rgba(223, 219, 219, 1)' : '#262424ff'}
                  style={[styles.input, { color: isDark ? '#F8FAFC' : '#262424ff' }]}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  returnKeyType="done"
                  onSubmitEditing={handleEmailSubmit}
                />
              </View>

              {error && <Text style={[styles.errorText, { backgroundColor: 'rgba(239,68,68,0.08)', color: '#EF4444' }]}>{error}</Text>}

              <TouchableOpacity
                style={styles.button}
                onPress={handleEmailSubmit}
                disabled={loading}
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
                    <View style={styles.buttonContent}>
                      <MaterialCommunityIcons
                        name="send"
                        size={18}
                        color="#FFF"
                      />
                      <Text style={styles.buttonText}>Send Code</Text>
                    </View>
                  )}
                </LinearGradient>

              </TouchableOpacity>
            </>
          ) : (
            <>
              <Text style={[styles.title, { color: textColor }]}>Verify Your Email</Text>
              <Text style={styles.subtitle}>
                We've sent a 4-digit code to {email}{'\n'}
                Enter the code below to continue
              </Text>

              <View style={styles.otpContainer}>
                {otp.map((digit, index) => (
                  <TextInput
                    key={index}
                    ref={(ref) => (otpInputRefs.current[index] = ref)}
                    style={[styles.otpInput, { color: isDark ? 'rgba(223, 219, 219, 1)' : '#262424ff' }]}
                    value={digit}
                    onChangeText={(text) => handleOtpChange(text, index)}
                    onKeyPress={(e) => handleOtpKeyPress(e, index)}
                    keyboardType="numeric"
                    maxLength={1}
                    textAlign="center"
                    selectionColor="#3B82F6"
                  />
                ))}
              </View>

              {error && <Text style={[styles.errorText, { backgroundColor: 'rgba(239,68,68,0.08)', color: '#EF4444' }]}>{error}</Text>}

              <TouchableOpacity
                style={styles.button}
                onPress={handleOtpVerify}
                disabled={loading}
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
                    <View style={styles.buttonContent}>
                      <MaterialCommunityIcons
                        name="check"
                        size={18}
                        color="#FFF"
                      />
                      <Text style={styles.buttonText}>Verify Code</Text>
                    </View>
                  )}
                </LinearGradient>

              </TouchableOpacity>

              <View style={styles.resendContainer}>
                <Text style={styles.resendText}>
                  Didn't receive the code?{' '}
                </Text>
                {canResend ? (<TouchableOpacity onPress={handleResendOtp}><Text style={[styles.resendLink, { color: outo }]}>Resend Code</Text></TouchableOpacity>) : (<Text style={[styles.timerText, { color: subtitleColor }]}>Resend in {timer}s</Text>)}
              </View>
            </>
          )}

          <TouchableOpacity
            style={styles.footer}
            onPress={() => navigation.navigate('SignIn')}
          >
            <Text style={styles.footerText}>
              Remember your password?{' '}
              <Text style={styles.footerLink}>
                <MaterialCommunityIcons
                  name="login"
                  size={14}
                  color="#638eacff"
                />
                {' '}Sign In
              </Text>
            </Text>
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
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    justifyContent: 'center',
    marginBottom: 0,
    paddingHorizontal: screenWidth * 0.06,
    paddingBottom: screenHeight * 0.04,
  },
  header: {
    position: 'absolute',
    top: Math.max(16, screenHeight * 0.07),
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 3,
  },
  backButton: {
    marginRight: screenWidth * 0.03,
    padding: screenWidth * 0.02,
  },
  logo: {
     width: screenWidth * 0.1,
    height: screenWidth * 0.10,
    marginRight: screenWidth * 0.025,
    borderRadius:  50,
  },
  logoTextContainer: {
    flexDirection: 'row',
    marginTop: screenHeight * 0.01,
  },
  logoText: {
    fontSize: screenWidth * 0.045,
    fontWeight: "700",
  },
  redText: {
      color: "red",
  },
  whiteText: {
    color: 'white',
  },
  customFont: {
    fontFamily: 'serif',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    textShadowColor: 'rgba(255, 255, 255, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  content: {
    marginTop: screenHeight * 0.2,
    width: '100%',
    padding: screenWidth * 0.05,
    backgroundColor: "transparent",
    borderRadius: screenWidth * 0.05,
    marginHorizontal: 0,
    zIndex: 2,
    paddingTop: screenHeight * 0.03,
    paddingBottom: screenHeight * 0.03,
    marginBottom: screenHeight * 0.06,
  },
  contentKeyboard: {
    marginTop: screenHeight * 0.02,
    paddingTop: screenHeight * 0.02,
    paddingBottom: screenHeight * 0.02,
    marginBottom: screenHeight * 0.05,
  },
  formContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: screenWidth * 0.025, minHeight: screenHeight,
  },
  scrollContentKeyboard: {
    justifyContent: 'flex-start',
    paddingTop: screenHeight * 0.05,
    minHeight: screenHeight * 0.7,
  },
  particle: {
    position: 'absolute',
    borderRadius: 50,
    zIndex: 0,
  },
  title: {
    fontSize: screenWidth * 0.08,
     fontWeight: "700",
    color: '#F8FAFC',
    marginLeft: screenWidth * 0.025,
    marginBottom: screenHeight * 0.01,
    textAlign: 'left',
  },
  subtitle: { 
    fontSize: screenWidth * 0.04,
    color: '#94A3B8',
    marginBottom: screenHeight * 0.03,
    marginLeft: screenWidth * 0.025,
    lineHeight: screenWidth * 0.055,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: "rgba(162, 56, 56, 0.12)",
    borderRadius: screenWidth * 0.05,
    marginTop: screenHeight * 0.025,
    paddingHorizontal: screenWidth * 0.04,
    minHeight: screenHeight * 0.065,
    shadowColor: '#000',
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
    paddingVertical: screenHeight * 0.02,
    fontSize: screenWidth * 0.04,
  },
  otpContainer: {
       flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: screenHeight * 0.03,
       marginBottom: screenHeight * 0.02,
    paddingHorizontal: screenWidth * 0.05,
  },
  otpInput: {
    width: screenWidth * 0.15,
    height: screenWidth * 0.15,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: screenWidth * 0.03,
    fontSize: screenWidth * 0.06,
    color: '#FFF',
    fontWeight: 'bold',
   borderColor: '#3B82F6',
    borderWidth: 1,
    shadowColor: '#000',
    
  },
  button: {
    borderRadius: screenWidth * 0.125,
    overflow: 'hidden',
    marginTop: screenHeight * 0.04,
    shadowColor: '#1ABC9C',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  buttonInner: {
    paddingVertical: screenHeight * 0.02,
    alignItems: 'center',
    minHeight: screenHeight * 0.065,
    justifyContent: 'center',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: screenWidth * 0.025,
  }, 
  buttonText: {
    color: '#FFFFFF',
    fontSize: screenWidth * 0.04,
    fontWeight: '600',
  },
  footer: {
    marginTop: screenHeight * 0.04,
    alignItems: 'center',
  },
  footerText: {
    color: '#94A3B8',
        fontSize: screenWidth * 0.035,
    textAlign: 'center',
  },
  footerLink: {
    color: '#3B82F6',
    fontWeight: '600',
  },
  errorText: {
    color: '#EF4444',
    textAlign: 'center',
    marginTop: screenHeight * 0.02,
    fontSize: screenWidth * 0.035,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    padding: screenWidth * 0.025,
    borderRadius: screenWidth * 0.02,
    marginHorizontal: screenWidth * 0.05,
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: screenHeight * 0.03,
  },
  resendText: {
    color: '#94A3B8',
    fontSize: screenWidth * 0.035,
  },
  resendLink: {
    color: '#3B82F6',
    fontSize: screenWidth * 0.035,
    fontWeight: '600',
  },
  timerText: {
    color: '#94A3B8',
    fontSize: screenWidth * 0.035,
    fontStyle: 'italic',
  },
});
export default ForgetPasswordScreen;