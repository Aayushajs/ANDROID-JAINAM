import React, { useState, useCallback, useRef } from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  Animated,
  Easing,
  ScrollView,
  RefreshControl,
  Text,
  TouchableOpacity,
} from "react-native";
import Icon from 'react-native-vector-icons/Ionicons';

import HeaderPage from "./HeaderPage";
import { useColorScheme } from "react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Platform } from 'react-native';
import HeroSection from "./Herosection";
import BottomTabs from "./Tab";
import StoreScreen from "./StoreScreen";

const HomePage = ({ navigation }) => {
  // System theme color (auto-detect dark/light)
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const bottomTabsBgColor = isDark ? '#1F1F1F' : '#FFFFFF';
  const [refreshing, setRefreshing] = useState(false);
  const [pageKey, setPageKey] = useState(0); // Unique key to force re-render
  const scrollY = useRef(new Animated.Value(0)).current;
  const scrollRef = useRef(null);
  const lastScrollY = useRef(0);
  const [headerVisible, setHeaderVisible] = useState(true);
  const [bottomVisible, setBottomVisible] = useState(true);
  const headerAnim = useRef(new Animated.Value(0)).current; // 0: visible, 1: hidden
  const bottomAnim = useRef(new Animated.Value(0)).current;

  const insets = useSafeAreaInsets();
  const screenHeight = Dimensions.get('window').height;

  // Floating top button animation
  const topBtnAnim = useRef(new Animated.Value(0)).current; // 0: hidden, 1: visible
  const showThreshold = Math.round(screenHeight * 0.35);
  const [showTopBtnVisible, setShowTopBtnVisible] = useState(false);

  // dynamic header & bottom sizes (match BottomTabs logic)
  const bottomSafeHeight = Platform.OS === 'android' ? Math.max(insets.bottom, 10) : insets.bottom;
  const bottomHeight = Platform.OS === 'android'
    ? Math.max(screenHeight * 0.085, 70) + bottomSafeHeight
    : Math.max(screenHeight * 0.09, 75) + bottomSafeHeight;


  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      setPageKey(prev => prev + 1); // Force re-render
    }, 1000);
  }, []);

  // Listen to scroll events and animate bottom
  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    {
      useNativeDriver: true,
      listener: (event) => {
        const { contentOffset, layoutMeasurement, contentSize } = event.nativeEvent;
        const y = contentOffset ? contentOffset.y : 0;
        const viewHeight = layoutMeasurement ? layoutMeasurement.height : 0;
        const contentHeight = contentSize ? contentSize.height : 0;
        const atBottom = contentHeight > 0 && (y + viewHeight >= contentHeight - 20);
        // show/hide floating Top button only when not at the very bottom
        if (!atBottom && y > showThreshold) {
          Animated.timing(topBtnAnim, { toValue: 1, duration: 250, useNativeDriver: true }).start();
          setShowTopBtnVisible(true);
        } else {
          Animated.timing(topBtnAnim, { toValue: 0, duration: 200, useNativeDriver: true }).start();
          setShowTopBtnVisible(false);
        }
        if (y > lastScrollY.current && y > 30) {
          // Scrolling down
          Animated.timing(headerAnim, {
            toValue: 1,
            duration: 450,
            easing: Easing.out(Easing.exp),
            useNativeDriver: true,
          }).start();
          Animated.timing(bottomAnim, {
            toValue: 1,
            duration: 450,
            easing: Easing.out(Easing.exp),
            useNativeDriver: true,
          }).start();
          setHeaderVisible(false);
          setBottomVisible(false);
        } else if (y < lastScrollY.current) {
          // Scrolling up
          Animated.timing(headerAnim, {
            toValue: 0,
            duration: 450,
            easing: Easing.out(Easing.exp),
            useNativeDriver: true,
          }).start();
          Animated.timing(bottomAnim, {
            toValue: 0,
            duration: 450,
            easing: Easing.out(Easing.exp),
            useNativeDriver: true,
          }).start();
          setHeaderVisible(true);
          setBottomVisible(true);
        }
        lastScrollY.current = y;
      },
    }
  );

  const scrollToTop = () => {
    try {
      if (scrollRef && scrollRef.current) {
        // Animated.ScrollView ref usually exposes scrollTo
        if (typeof scrollRef.current.scrollTo === 'function') {
          scrollRef.current.scrollTo({ y: 0, animated: true });
        } else if (scrollRef.current.getNode) {
          scrollRef.current.getNode().scrollTo({ y: 0, animated: true });
        }
      }
    } catch (e) {
      // ignore
    }
    // also reveal header/bottom when jumping to top
  Animated.timing(headerAnim, { toValue: 0, duration: 450, easing: Easing.out(Easing.exp), useNativeDriver: true }).start();
  Animated.timing(bottomAnim, { toValue: 0, duration: 450, easing: Easing.out(Easing.exp), useNativeDriver: true }).start();
  };

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#0B0B0B' : '#F5F5F5' }]}>
      <View key={pageKey}>
        <HeaderPage />
      </View>
      <Animated.ScrollView
        contentContainerStyle={[styles.scrollContent, { backgroundColor: isDark ? '#0B0B0B' : '#F5F5F5' }]}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={handleScroll}
        ref={scrollRef}
      >
        <View key={pageKey}>3
          <HeroSection navigation={navigation} />
          <StoreScreen navigation={navigation} />
        </View>
      </Animated.ScrollView>
      <Animated.View
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: 80,
          backgroundColor: "#fff",
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.08,
          shadowRadius: 8,
          elevation: 10,
          transform: [
            {
              translateY: bottomAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 80], // Move down when hidden
              }),
            },
          ],
          opacity: bottomAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 0] }),
          justifyContent: "center",
        }}
      >
        <BottomTabs currentActiveTab="Home" />
      </Animated.View>
      {/* System color pill for nav bar area when BottomTabs is hidden */}
      <Animated.View
        pointerEvents="none"
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: 40, // Increased height for better visibility
          backgroundColor: bottomTabsBgColor,
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
          opacity: bottomAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 1] }),
        }}
      />

      {/* Floating Top button: appears when user scrolls down past threshold */}
      <Animated.View
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 120,
          alignItems: 'center',
          transform: [
            {
              translateY: topBtnAnim.interpolate({ inputRange: [0, 1], outputRange: [40, 0] }),
            },
            { scale: topBtnAnim },
          ],
          opacity: topBtnAnim,
        }}
        pointerEvents={showTopBtnVisible ? 'auto' : 'none'}
      >
        <TouchableOpacity onPress={scrollToTop} activeOpacity={0.85} style={styles.topButton} accessibilityLabel="Scroll to top">
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Icon name="arrow-up" size={18} color="#fff" />
            <Text style={{ color: '#fff', fontWeight: '700', marginLeft: 8 }}>TOP</Text>
          </View>
        </TouchableOpacity>
      </Animated.View>
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
  topButton: {
    backgroundColor: '#7950F2',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
});

export default HomePage;
