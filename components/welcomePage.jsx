import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Animated, Easing, StatusBar, useColorScheme, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LottieView from 'lottie-react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const { width, height } = Dimensions.get('window');

const WelcomePage = ({ navigation }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const bgColor = isDark ? '#181A20' : '#FFFFFF';
  const textColor = isDark ? '#FFFFFF' : '#181A20';
  const subtitleColor = isDark ? 'rgba(255,255,255,0.7)' : 'rgba(24,26,32,0.7)';
  const accentColor = isDark ? '#cf7393ff' : '#0e0e0eff';

  useEffect(() => {
    // Animation sequence
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1200,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 1200,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 1000,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      })
    ]).start();

    // Pulse animation for the start button
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.05, duration: 900, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 900, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ])
    );

    pulseLoop.start();

    return () => {
      pulseLoop.stop();
    };

  }, [fadeAnim, slideAnim, scaleAnim]);

  const animatedContent = {
    opacity: fadeAnim,
    transform: [
      { translateY: slideAnim },
      { scale: scaleAnim }
    ]
  };

  return (
    <View style={[styles.container, { backgroundColor: bgColor, paddingTop: insets.top }] }>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={bgColor} translucent={Platform.OS === 'android'} />

      {/* Content */}
      <Animated.View style={[styles.content, animatedContent]}>

        {/* Lottie Animation */}
        <View style={[styles.animationContainer, { backgroundColor: 'transparent' }]}>
          <LottieView
              source={require('../assets/animations/Delivery.json')}
              style={[styles.animation, { backgroundColor: 'transparent' }]}
              autoPlay
              loop
              key={isDark ? 'delivery-dark' : 'delivery-light'}
              // In dark mode recolor the feather/gradient rectangle to match bg so it appears transparent
              colorFilters={isDark ? [
                { keypath: 'feather gradient', color: bgColor },
                { keypath: 'Rectangle 1', color: bgColor }
              ] : undefined}
            />
        </View>

        {/* Welcome Text */}
        <View style={styles.textContainer}>
          <Text style={[styles.title, { color: textColor }]}>Welcome to MediCare+</Text>
          <Text style={[styles.subtitle, { color: subtitleColor }]}>Your health is our priority. Discover a seamless experience for all your healthcare needs.
            Your health is our priority. Discover a seamless experience for all your healthcare needs.
          </Text>
        </View>
  </Animated.View>

      {/* Start Button */}
      <Animated.View 
        style={[
          styles.buttonContainer,
          {
            transform: [{ scale: pulseAnim }]
          }
        ]}
      >
        <TouchableOpacity 
          style={[styles.button, { backgroundColor: accentColor } ]}
          onPress={() => navigation.navigate("Start")}
          activeOpacity={0.9}
        >
          <View style={styles.buttonGradient}>
            <Text style={styles.buttonText}>Start Shopping Now</Text>
            <View style={[styles.iconContainer, { backgroundColor: isDark ? 'rgba(0,0,0,0.12)' : 'rgba(255,255,255,0.12)' }]}> 
              <Icon name="arrow-forward" size={20} color="#FFF" />
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={[styles.footerText, { color: subtitleColor }]}>© 2023 MediCare+. All rights reserved</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 40,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 60,
    width: '100%',
    paddingHorizontal: 20,
  },
 
  brandName: {
    fontSize: 28,
    fontWeight: '800',
    color: '#181A20',
    letterSpacing: 1,
    fontFamily: Platform.OS === 'android' ? 'serif' : 'System',
  },
  brandTagline: {
    fontSize: 14,
    color: 'rgba(24,26,32,0.7)',
    marginTop: 4,
    letterSpacing: 0.5,
  },
  animationContainer: {
    width: width * 0.7,
    height: width * 0.7,
    marginBottom: 30,
  },
  animation: {
    width: '100%',
    height: '100%',
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#181A20',
    textAlign: 'center',
    marginBottom: 16,
    letterSpacing: 0.5,
    fontFamily: Platform.OS === 'android' ? 'serif' : 'System',
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(24,26,32,0.7)',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 10,
  },
  buttonContainer: {
    width: '100%',
    paddingHorizontal: 40,
    marginBottom: 30,
  },
  button: {
    borderRadius: 50,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  buttonGradient: {
    paddingVertical: 18,
    paddingHorizontal: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  iconContainer: {
    marginLeft: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    paddingBottom: 20,
  },
  footerText: {
    fontSize: 12,
    color: 'rgba(24,26,32,0.5)',
  },
});

export default WelcomePage;