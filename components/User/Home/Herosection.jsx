import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
  Platform,
  StatusBar,
  useColorScheme,
  FlatList,
  Alert,
  Modal,
  ActivityIndicator,
  Animated,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Location from 'expo-location';
import { updateUserProfile, getFeaturedMedicines, getRunningAdvertisements, trackAdvertisementClick } from '../../../Apis/ApiSlashing';
import { Camera, CameraView } from 'expo-camera';

// Static categories and offers removed - using API data instead

// Advanced Skeleton Shimmer Component
const SkeletonShimmer = ({ width, height, borderRadius = 8, isDark, style }) => {
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 1200,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [shimmerAnim]);

  const opacity = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.8],
  });

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          borderRadius,
          backgroundColor: isDark ? '#3A3A3A' : '#E5E7EB',
          opacity,
        },
        style
      ]}
    />
  );
};

// Complete Page Skeleton Component
const HeroSectionSkeleton = ({ isDark, colors, getResponsiveSize }) => {
  return (
    <LinearGradient
      colors={isDark ? ['#1A1A1A', '#2A2A2A'] : ['#FFFFFF', '#F8F9FA']}
      style={styles.container}
    >
      <ScrollView 
        style={styles.scrollContainer} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: getResponsiveSize(20) }}
      >
        {/* Featured Title + Action Buttons Skeleton */}
        <View style={styles.featuredRow}>
          <SkeletonShimmer 
            width={getResponsiveSize(180)} 
            height={getResponsiveSize(24)} 
            borderRadius={6} 
            isDark={isDark}
          />
          <View style={styles.actionButtons}>
            <SkeletonShimmer 
              width={getResponsiveSize(48)} 
              height={getResponsiveSize(40)} 
              borderRadius={getResponsiveSize(20)} 
              isDark={isDark}
            />
            <SkeletonShimmer 
              width={getResponsiveSize(48)} 
              height={getResponsiveSize(40)} 
              borderRadius={getResponsiveSize(20)} 
              isDark={isDark}
            />
          </View>
        </View>

        {/* Categories Skeleton */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={styles.categoriesScroll}
          contentContainerStyle={{ paddingHorizontal: getResponsiveSize(5) }}
        >
          {Array.from({ length: 5 }).map((_, index) => (
            <View key={index} style={[styles.categoryItem, {
              marginRight: getResponsiveSize(15),
            }]}>
              <SkeletonShimmer 
                width={getResponsiveSize(65)} 
                height={getResponsiveSize(65)} 
                borderRadius={getResponsiveSize(32)} 
                isDark={isDark}
              />
              <SkeletonShimmer 
                width={getResponsiveSize(55)} 
                height={getResponsiveSize(14)} 
                borderRadius={6} 
                isDark={isDark}
                style={{ marginTop: getResponsiveSize(8) }}
              />
            </View>
          ))}
        </ScrollView>

        {/* Offers Skeleton */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.offersContainer}
          contentContainerStyle={{ paddingHorizontal: getResponsiveSize(5) }}
        >
          {Array.from({ length: 3 }).map((_, index) => (
            <View
              key={index}
              style={[styles.bannerContainer, {
                borderRadius: getResponsiveSize(16),
                padding: getResponsiveSize(20),
                marginVertical: getResponsiveSize(20),
                marginHorizontal: getResponsiveSize(7.5),
                width: screenWidth * 0.90,
                backgroundColor: colors.surface,
                borderWidth: 1,
                borderColor: colors.border,
              }]}
            >
              <View style={styles.bannerTextContainer}>
                <SkeletonShimmer 
                  width={getResponsiveSize(160)} 
                  height={getResponsiveSize(22)} 
                  borderRadius={8} 
                  isDark={isDark}
                />
                <SkeletonShimmer 
                  width={getResponsiveSize(130)} 
                  height={getResponsiveSize(16)} 
                  borderRadius={6} 
                  isDark={isDark}
                  style={{ marginTop: getResponsiveSize(8) }}
                />
                <SkeletonShimmer 
                  width={getResponsiveSize(110)} 
                  height={getResponsiveSize(14)} 
                  borderRadius={6} 
                  isDark={isDark}
                  style={{ marginTop: getResponsiveSize(6) }}
                />
                <SkeletonShimmer 
                  width={getResponsiveSize(90)} 
                  height={getResponsiveSize(36)} 
                  borderRadius={8} 
                  isDark={isDark}
                  style={{ marginTop: getResponsiveSize(15) }}
                />
              </View>
              <SkeletonShimmer 
                width={getResponsiveSize(120)} 
                height={getResponsiveSize(110)} 
                borderRadius={getResponsiveSize(35)} 
                isDark={isDark}
              />
            </View>
          ))}
        </ScrollView>

        {/* Indicator Dots Skeleton */}
        <View style={styles.indicatorContainer}>
          {Array.from({ length: 5 }).map((_, index) => (
            <SkeletonShimmer
              key={index}
              width={getResponsiveSize(8)}
              height={getResponsiveSize(8)}
              borderRadius={getResponsiveSize(4)}
              isDark={isDark}
              style={{ marginHorizontal: getResponsiveSize(3) }}
            />
          ))}
        </View>

        {/* Featured Medicines Skeleton */}
        <View style={{ paddingHorizontal: getResponsiveSize(5), marginTop: getResponsiveSize(10) }}>
          {/* Featured Medicines Title Skeleton */}
          <SkeletonShimmer 
            width={getResponsiveSize(180)} 
            height={getResponsiveSize(22)} 
            borderRadius={6} 
            isDark={isDark}
            style={{ marginBottom: getResponsiveSize(15) }}
          />
          
          {/* Featured Medicines Grid Skeleton */}
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
            {Array.from({ length: 4 }).map((_, index) => (
              <View key={index} style={{
                width: screenWidth * 0.44,
                backgroundColor: colors.surface,
                borderRadius: getResponsiveSize(12),
                padding: getResponsiveSize(12),
                marginBottom: getResponsiveSize(15),
                borderWidth: 1,
                borderColor: colors.border,
              }}>
                <SkeletonShimmer 
                  width={'100%'} 
                  height={getResponsiveSize(120)} 
                  borderRadius={8} 
                  isDark={isDark}
                />
                <SkeletonShimmer 
                  width={'85%'} 
                  height={getResponsiveSize(16)} 
                  borderRadius={6} 
                  isDark={isDark}
                  style={{ marginTop: getResponsiveSize(10) }}
                />
                <SkeletonShimmer 
                  width={'65%'} 
                  height={getResponsiveSize(14)} 
                  borderRadius={6} 
                  isDark={isDark}
                  style={{ marginTop: getResponsiveSize(6) }}
                />
                <SkeletonShimmer 
                  width={'45%'} 
                  height={getResponsiveSize(18)} 
                  borderRadius={6} 
                  isDark={isDark}
                  style={{ marginTop: getResponsiveSize(8) }}
                />
              </View>
            ))}
          </View>

          {/* Quick Actions Skeleton */}
          <SkeletonShimmer 
            width={getResponsiveSize(120)} 
            height={getResponsiveSize(18)} 
            borderRadius={6} 
            isDark={isDark}
            style={{ marginTop: getResponsiveSize(20), marginBottom: getResponsiveSize(15) }}
          />
          
          <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
            {Array.from({ length: 4 }).map((_, index) => (
              <View key={index} style={{ alignItems: 'center' }}>
                <SkeletonShimmer 
                  width={getResponsiveSize(50)} 
                  height={getResponsiveSize(50)} 
                  borderRadius={getResponsiveSize(25)} 
                  isDark={isDark}
                />
                <SkeletonShimmer 
                  width={getResponsiveSize(40)} 
                  height={getResponsiveSize(12)} 
                  borderRadius={6} 
                  isDark={isDark}
                  style={{ marginTop: getResponsiveSize(8) }}
                />
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

// Static data removed - using APIs for dynamic content

// Get screen dimensions for responsive design
const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

const HeroSection = ({ navigation }) => {
  const [currentOffer, setCurrentOffer] = useState(0);
  const [currentScrollIndex, setCurrentScrollIndex] = useState(0);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [offersLoading, setOffersLoading] = useState(true);
  const [featuredMedicines, setFeaturedMedicines] = useState([]);
  const [medicinesLoading, setMedicinesLoading] = useState(true);
  const [locationLoading, setLocationLoading] = useState(false);
  const [qrScannerVisible, setQrScannerVisible] = useState(false);
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [advertisements, setAdvertisements] = useState([]);
  const [adsLoading, setAdsLoading] = useState(true);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const insets = useSafeAreaInsets();
  const flatListRef = useRef(null);

  // Create infinite scroll data by repeating advertisements
  const infiniteOffers = advertisements.length > 0 ? [...advertisements, ...advertisements, ...advertisements] : []; // 3 sets for smooth infinite scroll
  const startIndex = advertisements.length; // Start from middle set

  // Responsive dimensions based on screen size
  const getResponsiveSize = (size) => {
    const baseWidth = 375; // iPhone 6/7/8 width as base
    return (screenWidth / baseWidth) * size;
  };

  // Dynamic colors matching HeaderPage system
  const colors = {
    background: isDark ? '#1A1A1A' : '#FFFFFF',
    surface: isDark ? '#2A2A2A' : '#F8F9FA',
    primary: isDark ? '#FF6B6B' : '#E53935',
    secondary: isDark ? '#FFFFFF' : '#1F2937',
    onBackground: isDark ? '#FFFFFF' : '#333333',
    onSurface: isDark ? '#FFFFFF' : '#000000',
    searchBg: isDark ? '#3A3A3A' : '#F0F0F0',
    cardBg: isDark ? '#2A2A2A' : '#FFFFFF',
    textSecondary: isDark ? '#CCCCCC' : '#666666',
    border: isDark ? '#333333' : '#E5E5E5',
    iconButton: isDark ? '#3A3A3A' : '#F0F0F0',
    accent: isDark ? '#FF6B6B' : '#E53935',
  };

  // Fetch featured medicines from API
  const fetchFeaturedMedicines = async () => {
    try {
      console.log('Fetching featured medicines...');
      const response = await getFeaturedMedicines();
      console.log('Featured medicines response:', response);
      
      if (response.success && response.data && response.data.data && response.data.data.data) {
        setFeaturedMedicines(response.data.data.data);
        console.log('Featured medicines loaded:', response.data.data.data.length, 'items');
      } else {
        console.warn('No featured medicines found in response');
      }
    } catch (error) {
      console.error('Error fetching featured medicines:', error);
    } finally {
      setMedicinesLoading(false);
      setCategoriesLoading(false); // Categories are now based on featured medicines
    }
  };

  // Fetch running advertisements from API
  const fetchRunningAdvertisements = async () => {
    try {
      console.log('Fetching running advertisements...');
      setAdsLoading(true);
      const response = await getRunningAdvertisements();
      console.log('Running advertisements response:', response);
      
      if (response.success && response.data && response.data.data && response.data.data.data) {
        setAdvertisements(response.data.data.data);
        console.log('Running advertisements loaded:', response.data.data.data.length, 'items');
      } else {
        console.warn('No running advertisements found in response');
        setAdvertisements([]);
      }
    } catch (error) {
      console.error('Error fetching running advertisements:', error);
      setAdvertisements([]);
    } finally {
      setAdsLoading(false);
      setOffersLoading(false);
    }
  };

  // Handle advertisement click tracking
  const handleAdvertisementClick = async (adId, adTitle) => {
    try {
      console.log('Tracking advertisement click for ID:', adId);
      const response = await trackAdvertisementClick(adId);
      console.log('Advertisement click tracked:', response);
      
      if (response.success) {
        Alert.alert(
          'Advertisement Clicked',
          `You clicked on: ${adTitle}`,
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Error tracking advertisement click:', error);
    }
  };

  // Simulate loading for skeleton with staggered loading
  useEffect(() => {
    // Initial page loading
    setTimeout(() => {
      setIsPageLoading(false);
    }, 2500);
    
    // Fetch data from APIs
    fetchFeaturedMedicines(); // This will control categories loading too
    fetchRunningAdvertisements(); // This will control offers loading too
  }, []);

  useEffect(() => {
    // Initialize scroll position to middle set when advertisements are loaded
    if (advertisements.length > 0) {
      setTimeout(() => {
        if (flatListRef.current) {
          setCurrentScrollIndex(startIndex);
          flatListRef.current.scrollToIndex({
            index: startIndex,
            animated: false,
          });
        }
      }, 100);
    }
  }, [advertisements.length, startIndex]);

  useEffect(() => {
    // Auto-scroll with infinite loop only when advertisements are available
    if (advertisements.length === 0) return;

    const offerInterval = setInterval(() => {
      setCurrentScrollIndex((prevScrollIndex) => {
        const nextScrollIndex = prevScrollIndex + 1;
        
        if (flatListRef.current) {
          flatListRef.current.scrollToIndex({
            index: nextScrollIndex,
            animated: true,
          });
        }
        
        // Update visible offer index for dots
        const visibleOfferIndex = (nextScrollIndex - startIndex) % advertisements.length;
        setCurrentOffer(visibleOfferIndex);
        
        return nextScrollIndex;
      });
    }, 3000);

    return () => {
      clearInterval(offerInterval);
    };
  }, [advertisements.length, startIndex]);

  // Get current location and update profile
  const handleLocationPress = async () => {
    console.log('Location button pressed!'); // Debug log
    try {
      setLocationLoading(true);
      Alert.alert('Location', 'Getting your location...', [{ text: 'OK' }]);
      
      // Request location permission
      const { status } = await Location.requestForegroundPermissionsAsync();
      console.log('Location permission status:', status);
      
      if (status !== 'granted') {
        Alert.alert(
          'Location Permission Required',
          'Please grant location permission to get your current location.',
          [{ text: 'OK' }]
        );
        setLocationLoading(false);
        return;
      }

      // Get current location
      console.log('Getting current location...');
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
        timeout: 15000,
        maximumAge: 10000,
      });
      console.log('Location received:', location.coords);

      // Reverse geocode to get address
      const reverseGeocode = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
      console.log('Reverse geocode result:', reverseGeocode);

      if (reverseGeocode.length > 0) {
        const address = reverseGeocode[0];
        
        // Prepare address data
        const addressData = {
          address: {
            street: `${address.name || ''} ${address.street || ''}`.trim(),
            city: address.city || address.subregion || '',
            state: address.region || '',
            zip: address.postalCode || '',
            country: address.country || '',
            location: {
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            },
          },
        };

        console.log('Updating profile with location data:', addressData);
        
        // Update profile with location
        const response = await updateUserProfile(addressData, false);
        console.log('Update response:', response);
        
        if (response.success) {
          Alert.alert(
            'Location Updated Successfully!',
            `Address: ${addressData.address.street}, ${addressData.address.city}, ${addressData.address.state}\n\nCoordinates: ${location.coords.latitude.toFixed(6)}, ${location.coords.longitude.toFixed(6)}`,
            [{ text: 'OK' }]
          );
        } else {
          Alert.alert('Update Failed', response.message || 'Failed to update location in profile');
        }
      } else {
        Alert.alert('Address Not Found', 'Could not get address for this location');
      }
    } catch (error) {
      console.error('Location error:', error);
      Alert.alert('Location Error', `Failed to get location: ${error.message}`);
    } finally {
      setLocationLoading(false);
    }
  };

  // Handle QR Scanner toggle
  const handleQRScannerToggle = async () => {
    console.log('QR Scanner button pressed!'); // Debug log
    try {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
      
      if (status === 'granted') {
        setQrScannerVisible(true);
        setScanned(false);
        console.log('QR Scanner opened successfully');
      } else {
        Alert.alert(
          'Camera Permission Required',
          'Please allow camera access to scan QR codes',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Error opening QR scanner:', error);
      Alert.alert('Error', 'Failed to open QR scanner');
    }
  };

  // Handle QR Code scan
  const handleQRScan = ({ type, data }) => {
    console.log('QR Code Scanned:', { type, data });
    setScanned(true);
    
    Alert.alert(
      'QR Code Scanned Successfully!',
      `Type: ${type}\nData: ${data}`,
      [
        { text: 'Scan Another', onPress: () => {
          setScanned(false);
        }},
        { text: 'OK', onPress: () => {
          setQrScannerVisible(false);
          setScanned(false);
        }}
      ]
    );
  };

  // Handle scroll end for infinite loop
  const onScrollEnd = (event) => {
    if (advertisements.length === 0) return;
    
    const contentOffset = event.nativeEvent.contentOffset.x;
    const cardWidth = screenWidth * 0.85 + 16;
    const currentIndex = Math.round(contentOffset / cardWidth);
    
    setCurrentScrollIndex(currentIndex);
    
    // Calculate which offer is visible for dots
    const visibleOfferIndex = (currentIndex - startIndex + advertisements.length) % advertisements.length;
    setCurrentOffer(visibleOfferIndex);
    
    // Reset position if we're near the edges for seamless infinite scroll
    if (currentIndex >= infiniteOffers.length - advertisements.length) {
      // Near the end, jump back to middle section
      setTimeout(() => {
        const resetIndex = startIndex + (currentIndex - startIndex) % advertisements.length;
        setCurrentScrollIndex(resetIndex);
        if (flatListRef.current) {
          flatListRef.current.scrollToIndex({
            index: resetIndex,
            animated: false,
          });
        }
      }, 50);
    } else if (currentIndex < advertisements.length) {
      // Near the beginning, jump to middle section
      setTimeout(() => {
        const resetIndex = startIndex + currentIndex;
        setCurrentScrollIndex(resetIndex);
        if (flatListRef.current) {
          flatListRef.current.scrollToIndex({
            index: resetIndex,
            animated: false,
          });
        }
      }, 50);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  // Show full page skeleton during initial loading
  if (isPageLoading) {
    return (
      <HeroSectionSkeleton 
        isDark={isDark} 
        colors={colors} 
        getResponsiveSize={getResponsiveSize} 
      />
    );
  }

  return (
    <LinearGradient
      colors={isDark ? ['#1A1A1A', '#2A2A2A'] : ['#FFFFFF', '#F8F9FA']}
      style={styles.container}
    >
      <ScrollView 
        style={styles.scrollContainer} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: getResponsiveSize(20) }}
      >
        

      {/* Featured Title + Sort/Filter */}
      <View style={styles.featuredRow}>
        <Text style={[styles.featuredText, { 
          color: colors.onBackground,
          fontSize: getResponsiveSize(20),
        }]}>Featured Medicines</Text>
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={[styles.actionBtn, {
              backgroundColor: colors.surface,
              borderColor: colors.border,
              opacity: qrScannerVisible ? 0.5 : 1,
            }]}
            onPress={() => {
              console.log('QR button touch detected');
              handleQRScannerToggle();
            }}
            disabled={qrScannerVisible}
            activeOpacity={0.7}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Icon 
              name="qr-code-outline" 
              size={getResponsiveSize(25)} 
              color={colors.onSurface} 
            />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.actionBtn, {
              backgroundColor: colors.surface,
              borderColor: colors.border,
              opacity: locationLoading ? 0.5 : 1,
            }]}
            onPress={() => {
              console.log('Location button touch detected');
              handleLocationPress();
            }}
            disabled={locationLoading}
            activeOpacity={0.7}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            {locationLoading ? (
              <ActivityIndicator size="small" color={colors.onSurface} />
            ) : (
              <Icon 
                name="location-outline" 
                size={getResponsiveSize(25)} 
                color={colors.onSurface} 
              />
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Categories Scroll */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        style={styles.categoriesScroll}
        contentContainerStyle={{ paddingHorizontal: getResponsiveSize(5) }}
      >
        {categoriesLoading ? (
          // Skeleton Loading
          Array.from({ length: 5 }).map((_, index) => (
            <View key={index} style={[styles.categoryItem, {
              marginRight: getResponsiveSize(15),
            }]}>
              <SkeletonShimmer 
                width={getResponsiveSize(65)} 
                height={getResponsiveSize(65)} 
                borderRadius={getResponsiveSize(32)} 
                isDark={isDark}
              />
              <SkeletonShimmer 
                width={getResponsiveSize(50)} 
                height={getResponsiveSize(12)} 
                borderRadius={6} 
                isDark={isDark}
                style={{ marginTop: getResponsiveSize(8) }}
              />
            </View>
          ))
        ) : featuredMedicines.length > 0 ? (
          // API Categories (first 5 medicines as categories)
          featuredMedicines.slice(0, 5).map((medicine, index) => (
            <TouchableOpacity 
              key={medicine._id || index} 
              style={[styles.categoryItem, {
                marginRight: getResponsiveSize(15),
              }]}
              activeOpacity={0.8}
              onPress={() => {
                console.log('Category selected:', medicine.title);
              }}
            >
              <View style={[styles.categoryImageContainer, {
                backgroundColor: colors.surface,
                borderColor: colors.border,
                width: getResponsiveSize(65),
                height: getResponsiveSize(65),
              }]}>
                <Image 
                  source={{ uri: medicine.imageUrl }} 
                  style={[styles.categoryImage, {
                    width: getResponsiveSize(60),
                    height: getResponsiveSize(60),
                    borderRadius: getResponsiveSize(30),
                  }]} 
                />
              </View>
              <Text style={[styles.categoryText, { 
                color: colors.onBackground,
                fontSize: getResponsiveSize(12),
              }]} numberOfLines={1}>
                {medicine.title.length > 10 ? medicine.title.substring(0, 10) + '...' : medicine.title}
              </Text>
            </TouchableOpacity>
          ))
        ) : (
          // No data placeholder
          <View style={styles.categoryItem}>
            <View style={[styles.categoryImageContainer, {
              backgroundColor: colors.surface,
              borderColor: colors.border,
              width: getResponsiveSize(65),
              height: getResponsiveSize(65),
            }]}>
              <Icon name="medical-outline" size={30} color={colors.textSecondary} />
            </View>
            <Text style={[styles.categoryText, { 
              color: colors.textSecondary,
              fontSize: getResponsiveSize(12),
            }]}>No Categories</Text>
          </View>
        )}
      </ScrollView>

      {/* Auto-Scrolling Advertisements */}
      {adsLoading || offersLoading ? (
        // Skeleton Loading for Advertisements
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.offersContainer}
          contentContainerStyle={{ paddingHorizontal: getResponsiveSize(5) }}
        >
          {Array.from({ length: 3 }).map((_, index) => (
            <View
              key={index}
              style={[styles.bannerContainer, {
                borderRadius: getResponsiveSize(16),
                padding: getResponsiveSize(20),
                marginVertical: getResponsiveSize(20),
                marginHorizontal: getResponsiveSize(7.5),
                width: screenWidth * 0.90,
                backgroundColor: colors.surface,
                borderWidth: 1,
                borderColor: colors.border,
              }]}
            >
              <View style={styles.bannerTextContainer}>
                <SkeletonShimmer 
                  width={getResponsiveSize(150)} 
                  height={getResponsiveSize(22)} 
                  borderRadius={6} 
                  isDark={isDark}
                />
                <SkeletonShimmer 
                  width={getResponsiveSize(120)} 
                  height={getResponsiveSize(14)} 
                  borderRadius={6} 
                  isDark={isDark}
                  style={{ marginTop: getResponsiveSize(8) }}
                />
                <SkeletonShimmer 
                  width={getResponsiveSize(100)} 
                  height={getResponsiveSize(13)} 
                  borderRadius={6} 
                  isDark={isDark}
                  style={{ marginTop: getResponsiveSize(5) }}
                />
                <SkeletonShimmer 
                  width={getResponsiveSize(80)} 
                  height={getResponsiveSize(35)} 
                  borderRadius={8} 
                  isDark={isDark}
                  style={{ marginTop: getResponsiveSize(15) }}
                />
              </View>
              <SkeletonShimmer 
                width={getResponsiveSize(120)} 
                height={getResponsiveSize(110)} 
                borderRadius={getResponsiveSize(35)} 
                isDark={isDark}
              />
            </View>
          ))}
        </ScrollView>
      ) : advertisements.length > 0 ? (
        // Actual Advertisements from API
        <FlatList
          ref={flatListRef}
          data={infiniteOffers}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled={false}
          decelerationRate="fast"
          snapToInterval={screenWidth * 0.90 + 16} // card width + margin
          snapToAlignment="start"
          contentContainerStyle={{ paddingHorizontal: getResponsiveSize(5) }}
          onMomentumScrollEnd={onScrollEnd}
          getItemLayout={(data, index) => ({
            length: screenWidth * 0.90 + 16,
            offset: (screenWidth * 0.90 + 16) * index,
            index,
          })}
          renderItem={({ item: ad, index }) => (
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => handleAdvertisementClick(ad._id, ad.title)}
            >
              <LinearGradient
                colors={isDark ? ['#1A1A1A', '#2A2A2A'] : ['#FF6B6B', '#FF8A95']}
                style={[styles.bannerContainer, {
                  borderRadius: getResponsiveSize(16),
                  padding: getResponsiveSize(15),
                  marginVertical: getResponsiveSize(10),
                  marginHorizontal: getResponsiveSize(6.5),
                  width: screenWidth * 0.90, // 90% of screen width
                  borderWidth: isDark ? 1 : 0,
                  borderColor: isDark ? colors.border : 'transparent',
                }]}
              >
                <View style={styles.bannerTextContainer}>
                  <Text style={[styles.bannerTitle, {
                    fontSize: getResponsiveSize(22),
                    color: isDark ? colors.primary : '#FFFFFF',
                  }]}>{ad.title}{ad.offerText ? ` ${ad.offerText}% OFF` : ''}</Text>
                  
                  <Text style={[styles.bannerSub, {
                    fontSize: getResponsiveSize(14),
                    color: isDark ? colors.onBackground : '#FFFFFF',
                  }]}>{ad.description}</Text>

                  <View style={[styles.dateContainer, {
                    marginTop: getResponsiveSize(8),
                  }]}>
                    <Text style={[styles.dateText, {
                      fontSize: getResponsiveSize(11),
                      color: isDark ? colors.textSecondary : 'rgba(255,255,255,0.8)',
                    }]}>{formatDate(ad.startDate)} - {formatDate(ad.endDate)}</Text>
                  </View>

                  <TouchableOpacity 
                    style={[styles.shopNowBtn, {
                      paddingVertical: getResponsiveSize(8),
                      paddingHorizontal: getResponsiveSize(16),
                      borderRadius: getResponsiveSize(8),
                      backgroundColor: isDark ? colors.primary : '#FFFFFF',
                      marginTop: getResponsiveSize(10),
                    }]}
                    onPress={() => handleAdvertisementClick(ad._id, ad.title)}
                  >
                    <Text style={[styles.shopNowText, {
                      fontSize: getResponsiveSize(14),
                      color: isDark ? '#FFFFFF' : colors.primary,
                    }]}>Order Now →</Text>
                  </TouchableOpacity>
                </View>
                <Image
                  source={{ uri: ad.imageUrl }}
                  style={[styles.bannerImage, {
                    width: getResponsiveSize(120),
                    height: getResponsiveSize(120),
                    borderRadius: getResponsiveSize(15),
                  }]}
                />
              </LinearGradient>
            </TouchableOpacity>
          )}
          keyExtractor={(item, index) => `${item._id}-${index}`}
          style={styles.offersContainer}
        />
      ) : (
        // No Advertisements Available
        <View style={[styles.noAdsContainer, {
          padding: getResponsiveSize(40),
          alignItems: 'center',
          justifyContent: 'center',
        }]}>
          <Icon name="megaphone-outline" size={getResponsiveSize(50)} color={colors.textSecondary} />
          <Text style={[styles.noAdsText, {
            fontSize: getResponsiveSize(16),
            color: colors.textSecondary,
            marginTop: getResponsiveSize(10),
            textAlign: 'center',
          }]}>No advertisements available at the moment</Text>
        </View>
      )}

      {/* Advertisement Indicator Dots */}
      {advertisements.length > 0 && (
        <View style={styles.indicatorContainer}>
          {advertisements.map((_, index) => (
            <View
              key={index}
              style={[
                styles.indicator,
                {
                  backgroundColor: currentOffer === index ? colors.primary : colors.textSecondary,
                  width: getResponsiveSize(8),
                  height: getResponsiveSize(8),
                  borderRadius: getResponsiveSize(4),
                  marginHorizontal: getResponsiveSize(3),
                }
              ]}
            />
          ))}
        </View>
      )}


    </ScrollView>

    {/* QR Scanner Modal */}
    <Modal
      visible={qrScannerVisible}
      animationType="slide"
      onRequestClose={() => {
        console.log('QR Scanner modal closed');
        setQrScannerVisible(false);
        setScanned(false);
      }}
      presentationStyle="fullScreen"
    >
      <View style={styles.qrScannerContainer}>
        <View style={styles.qrScannerHeader}>
          <TouchableOpacity 
            onPress={() => {
              console.log('Closing QR scanner');
              setQrScannerVisible(false);
              setScanned(false);
            }}
            style={styles.closeButton}
            activeOpacity={0.7}
          >
            <Icon name="close" size={30} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.qrScannerTitle}>Scan QR Code</Text>
          <View style={{ width: 50 }} />
        </View>
        
        <View style={styles.qrInstructionsContainer}>
          <Text style={styles.qrInstructions}>
            Point your camera at a QR code to scan
          </Text>
        </View>

        {hasPermission === null ? (
          <View style={styles.permissionContainer}>
            <ActivityIndicator size="large" color="#FFFFFF" />
            <Text style={styles.permissionText}>Requesting camera permission...</Text>
          </View>
        ) : hasPermission === false ? (
          <View style={styles.permissionContainer}>
            <Icon name="camera-off" size={50} color="#FFFFFF" />
            <Text style={styles.permissionText}>No access to camera</Text>
            <TouchableOpacity 
              style={styles.qrCancelButton}
              onPress={handleQRScannerToggle}
            >
              <Text style={styles.qrCancelText}>Request Permission</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <CameraView
            style={styles.qrCamera}
            facing="back"
            onBarcodeScanned={scanned ? undefined : handleQRScan}
            barcodeScannerSettings={{
              barcodeTypes: ["qr", "pdf417", "aztec", "ean13", "ean8", "upc_e", "datamatrix", "code128", "code93", "code39", "codabar"],
            }}
          >
            {/* QR Scanner Overlay */}
            <View style={styles.qrOverlay}>
              <View style={styles.qrFrame}>
                <View style={[styles.qrCorner, styles.qrCornerTL]} />
                <View style={[styles.qrCorner, styles.qrCornerTR]} />
                <View style={[styles.qrCorner, styles.qrCornerBL]} />
                <View style={[styles.qrCorner, styles.qrCornerBR]} />
              </View>
            </View>
          </CameraView>
        )}
        
        <View style={styles.qrBottomContainer}>
          <TouchableOpacity 
            style={styles.qrCancelButton}
            onPress={() => {
              setQrScannerVisible(false);
              setScanned(false);
            }}
          >
            <Text style={styles.qrCancelText}>Cancel</Text>
          </TouchableOpacity>
          
          {scanned && (
            <TouchableOpacity 
              style={[styles.qrCancelButton, { backgroundColor: 'rgba(76, 175, 80, 0.8)' }]}
              onPress={() => setScanned(false)}
            >
              <Text style={styles.qrCancelText}>Scan Again</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: -0.5,
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: screenWidth * 0.04, // 4% of screen width
    paddingTop: 2, // Just 10px gap from header
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: screenWidth * 0.09, // 3% of screen width
    paddingHorizontal: screenWidth * 0.020, // 2.5% of screen width
    marginBottom: screenHeight * 0.01, // 2% of screen height
    marginRight: screenWidth * 0.1,
    // Android Material Design shadow
    ...Platform.select({
      android: {
        elevation: 2, 
      },
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
    }),
  },
  searchInput: {
    flex: 1,
    fontFamily: Platform.OS === 'android' ? 'Roboto' : 'System',
    marginHorizontal: screenWidth * 0.02,
    paddingVertical: Platform.OS === 'android' ? 0 : 8,
  },
  featuredRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: screenHeight * 0.02,
  },
  featuredText: {
    fontWeight: "700",
    fontFamily: Platform.OS === 'android' ? 'Roboto' : 'System',
    letterSpacing: 0.5,
  },
  actionButtons: {
    flexDirection: "row",
    gap: screenWidth * 0.02,
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: screenHeight * 0.012,
    paddingHorizontal: screenWidth * 0.04,
    borderRadius: screenWidth * 0.04,
    borderWidth: 1,
    minWidth: screenWidth * 0.12,
    minHeight: screenHeight * 0.05,
    // Material Design elevation
    ...Platform.select({
      android: {
        elevation: 2,
      },
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
    }),
  },
  actionText: {
    marginLeft: screenWidth * 0.01,
    fontFamily: Platform.OS === 'android' ? 'Roboto' : 'System',
    fontWeight: "500",
  },
  categoriesScroll: {
    marginVertical: screenHeight * 0.005,
  },
  categoryItem: {
    alignItems: "center",
    paddingVertical: screenHeight * 0.01,
  },
  categoryImageContainer: {
    borderRadius: screenWidth * 0.08,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: screenHeight * 0.008,
    // Material Design elevation
    ...Platform.select({
      android: {
        elevation: 3,
      },
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
    }),
  },
  categoryImage: {
    resizeMode: 'cover',
  },
  categoryText: {
    fontFamily: Platform.OS === 'android' ? 'Roboto' : 'System',
    fontWeight: "500",
    textAlign: 'center',
    marginTop: screenHeight * 0.005,
  },

  offersContainer: {
    marginVertical: screenHeight * 0.01,
  },
  bannerContainer: {
    flexDirection: "row",
    alignItems: "center",
    // Enhanced Material Design shadow
    ...Platform.select({
      android: {
        elevation: 8,
      },
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
      },
    }),
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: screenHeight * -0.01,
    marginBottom: screenHeight * 0.02,
  },
  indicator: {
    // Styles are applied dynamically in the component
  },
  bannerTextContainer: {
    flex: 1,
    paddingRight: screenWidth * 0.02,
  },
  bannerTitle: {
    fontWeight: "800",
    fontFamily: Platform.OS === 'android' ? 'Roboto' : 'System',
    letterSpacing: 1,
  },
  bannerSub: {
    marginTop: screenHeight * 0.003,
    fontFamily: Platform.OS === 'android' ? 'Roboto' : 'System',
    opacity: 0.9,
  },
  shopNowBtn: {
    marginTop: screenHeight * 0.015,
    alignSelf: 'flex-start',
    // Material Design button elevation
    ...Platform.select({
      android: {
        elevation: 4,
      },
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
    }),
  },
  shopNowText: {
    fontWeight: "700",
    fontFamily: Platform.OS === 'android' ? 'Roboto' : 'System',
    letterSpacing: 0.5,
  },
  bannerImage: {
    resizeMode: 'cover',
    marginLeft: screenWidth * 0.02,
    backgroundColor: '#FFF',
  },
  // QR Scanner Styles
  qrScannerContainer: {
    flex: 1,
    backgroundColor: '#000000',
  },
  qrScannerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 40 : 50,
    paddingBottom: 20,
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  closeButton: {
    padding: 10,
  },
  qrScannerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
    marginRight: 50, // Offset for close button
  },
  qrInstructionsContainer: {
    position: 'absolute',
    top: Platform.OS === 'android' ? 140 : 150,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  qrInstructions: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
    margin: 20,
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 15,
    borderRadius: 10,
  },
  qrCamera: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qrBottomContainer: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
  },
  qrCancelButton: {
    backgroundColor: 'rgba(255, 107, 107, 0.8)',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  qrCancelText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
  },
  permissionText: {
    color: '#FFFFFF',
    fontSize: 18,
    textAlign: 'center',
    marginVertical: 20,
  },
  qrOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  qrFrame: {
    width: 250,
    height: 250,
    position: 'relative',
    backgroundColor: 'transparent',
  },
  qrCorner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: '#FF6B6B',
    borderWidth: 4,
  },
  qrCornerTL: {
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  qrCornerTR: {
    top: 0,
    right: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
  },
  qrCornerBL: {
    bottom: 0,
    left: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
  },
  qrCornerBR: {
    bottom: 0,
    right: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  // Featured Medicines Styles
  medicineCard: {
    borderRadius: screenWidth * 0.03,
    padding: screenWidth * 0.03,
    marginBottom: screenHeight * 0.02,
    borderWidth: 1,
    ...Platform.select({
      android: {
        elevation: 3,
      },
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
    }),
  },
  medicineImageContainer: {
    position: 'relative',
    marginBottom: screenHeight * 0.01,
  },
  medicineImage: {
    width: '100%',
    height: screenHeight * 0.15,
    borderRadius: screenWidth * 0.02,
    backgroundColor: '#F5F5F5',
  },
  discountBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
  },
  discountText: {
    color: '#FFFFFF',
    fontSize: screenWidth * 0.025,
    fontWeight: 'bold',
  },
  medicineInfo: {
    flex: 1,
  },
  medicineTitle: {
    fontSize: screenWidth * 0.035,
    fontWeight: '600',
    marginBottom: screenHeight * 0.005,
    fontFamily: Platform.OS === 'android' ? 'Roboto' : 'System',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: screenHeight * 0.008,
    gap: screenWidth * 0.02,
  },
  effectivePrice: {
    fontSize: screenWidth * 0.04,
    fontWeight: 'bold',
    fontFamily: Platform.OS === 'android' ? 'Roboto' : 'System',
  },
  originalPrice: {
    fontSize: screenWidth * 0.032,
    textDecorationLine: 'line-through',
    fontFamily: Platform.OS === 'android' ? 'Roboto' : 'System',
  },
  medicineFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: screenWidth * 0.03,
    fontFamily: Platform.OS === 'android' ? 'Roboto' : 'System',
  },
  addButton: {
    width: screenWidth * 0.08,
    height: screenWidth * 0.08,
    borderRadius: screenWidth * 0.04,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      android: {
        elevation: 2,
      },
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
      },
    }),
  },
  noMedicinesContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: screenHeight * 0.05,
  },
  noMedicinesText: {
    fontSize: screenWidth * 0.04,
    marginTop: screenHeight * 0.01,
    fontFamily: Platform.OS === 'android' ? 'Roboto' : 'System',
  },
  // Advertisement Styles
  offerBadge: {
    alignSelf: 'flex-start',
  },
  offerText: {
    fontFamily: Platform.OS === 'android' ? 'Roboto' : 'System',
  },
  dateContainer: {
    alignSelf: 'flex-start',
  },
  dateText: {
    fontFamily: Platform.OS === 'android' ? 'Roboto' : 'System',
    fontStyle: 'italic',
  },
  noAdsContainer: {
    marginVertical: screenHeight * 0.02,
  },
  noAdsText: {
    fontFamily: Platform.OS === 'android' ? 'Roboto' : 'System',
  },
});

export default HeroSection;
