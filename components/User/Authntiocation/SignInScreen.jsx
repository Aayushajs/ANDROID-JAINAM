import React, { useEffect, useRef } from 'react';
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
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAuth } from '../../context/AuthContext';

const SignInScreen = ({ navigation }) => {
  const { login, loading, error } = useAuth();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
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

  const handleSubmit = async () => {
    if (!email || !password) return;
    await login(email, password);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <LinearGradient
        colors={['#000000', '#000000', '#0F172A']}
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

        {/* Top Background Image */}
        {/* <Image
          source={{ uri: 'https://img.freepik.com/premium-photo/neon-swirl-curve-pink-line-light-effect-abstract-ring-background-with-glowing-swirling-background_636537-110660.jpg' }}
          style={styles.topBackgroundImage}
          resizeMode="cover"
        /> */}

        {/* Header with Logo and Text */}
        <View style={styles.header}>
          <Image
            source={{ uri: 'https://via.placeholder.com/50' }} // Replace with your logo URL
            style={styles.logo}
          />
          <View style={styles.logoTextContainer}>
            {['A', 'T', 'T', 'E', 'N', 'D', 'E', 'N', 'C', 'E'].map((letter, index) => (
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
            ))}
          </View>
        </View>

        {/* Content Container */}
        <View style={styles.formContainer}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <Text style={styles.title}>SignIn</Text>
          <Text style={styles.subtitle}>Continue your reading journey</Text>

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

          <TouchableOpacity
            style={styles.button}
            onPress={handleSubmit}
            disabled={loading}
          >
            <LinearGradient
              colors={['#1E293B', '#0F172A', '#1E293B']}
              style={styles.buttonInner}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <View style={styles.buttonContent}>
                  <MaterialCommunityIcons
                    name="login"
                    size={20}
                    color="#FFF"
                  />
                  <Text style={styles.buttonText}>Sign In</Text>
                </View>
              )}
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.footer}
            onPress={() => navigation.navigate('Register')}
          >
            <Text style={styles.footerText}>
              Don't have an account?{' '}
              <Text style={styles.footerLink}>
                <MaterialCommunityIcons
                  name="account-plus"
                  size={14}
                  color="#3B82F6"
                />
                {' '}Register one
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
  },
  background: {
    flex: 1,
    justifyContent: 'center',
    marginBottom: -100,
    padding: 10,
  },
  topBackgroundImage: {
    position: 'absolute',
    top: 85,
    left: 0,
    right: 0,
    width: 'auto',
    height: 280,
    zIndex: 1,
    transform: [{ rotateZ: '40deg' }],
    opacity: 0.8,
  },
  header: {
    position: 'absolute',
    top: 25,
    left: -40,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 3,
  },
  logo: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  logoTextContainer: {
    flexDirection: 'row',
  },
  logoText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  redText: {
    color: 'red',
  },
  whiteText: {
    color: 'white',
  },
  customFont: {
    fontFamily: 'YourCustomFont', // Replace with your custom font
    textTransform: 'uppercase', // Ensure text is in uppercase
    letterSpacing: 1.5, // Adjust letter spacing if needed
    textShadowColor: 'rgba(255, 255, 255, 0.3)', // Optional: Add a subtle text shadow
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  content: {
    marginTop: 200,
    width: '100%',
    height: '400',
    borderRadius: 40,
    padding:10,
    marginHorizontal: 5,
    backgroundColor: 'transparent',
    borderTopRightRadius: 150,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.23)',
    zIndex: 2,
    paddingTop: 20,
    paddingBottom: 20,
    marginBottom: 80,
  },
    formContainer: {
    position: 'absolute',
    top: '0%', // Adjust this value to position the form container
    left: 0,
    right: 0,
    bottom: 0,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.23)',
    backgroundColor: 'transparent',
    overflow: 'scroll',
   
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  particle: {
    position: 'absolute',
    borderRadius: 50,
    zIndex: 0,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#F8FAFC',
    marginLeft:10,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#94A3B8',
    marginBottom: 10,
    marginLeft:10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    marginTop: 20,
    paddingHorizontal: 15,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 15,
    color: '#FFF',
    fontSize: 16,
  },
  button: {
    borderRadius: 50,
    overflow: 'hidden',
    marginTop: 30,
  },
  buttonInner: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    marginTop: 25,
    alignItems: 'center',
  },
  footerText: {
    color: '#94A3B8',
    fontSize: 14,
  },
  footerLink: {
    color: '#3B82F6',
    fontWeight: '600',
  },
  errorText: {
    color: '#EF4444',
    textAlign: 'center',
    marginTop: 15,
    fontSize: 14,
  },
});

export default SignInScreen;

