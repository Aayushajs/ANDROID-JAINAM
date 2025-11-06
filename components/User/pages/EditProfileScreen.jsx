import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions,
  Platform, StatusBar, useColorScheme, Alert, ActivityIndicator,
  TextInput, Image,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import DateTimePicker from '@react-native-community/datetimepicker';
import { updateUserProfile } from '../../../Apis/ApiSlashing';
import { useAuth } from '../../context/AuthContext';

// Constants
const { width: screenWidth } = Dimensions.get('window');
const getResponsiveSize = (size) => (screenWidth / 375) * size;
const COLORS = {
  primary: '#e16c61f1',
  primaryDark: '#d77b7bff',
  white: '#FFFFFF',
  black: '#1F2937',
  gray: '#6B7280',
  lightGray: '#F3F4F6',
  darkBg: '#2A2A2A',
  darkBgLight: '#3A3A3A',
};

const EditProfileScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const isDark = useColorScheme() === 'dark';
  const { handleTokenExpiry } = useAuth();
  const { userData: initialUserData, refreshProfile } = route.params || {};

  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [formData, setFormData] = useState({
    name: initialUserData?.name || '',
    email: initialUserData?.email || '',
    phone: initialUserData?.phone || '',
    age: initialUserData?.age?.toString() || '',
    dob: initialUserData?.dob ? new Date(initialUserData.dob) : new Date(),
    address: {
      street: initialUserData?.address?.street || '',
      city: initialUserData?.address?.city || '',
      state: initialUserData?.address?.state || '',
      zip: initialUserData?.address?.zip || '',
      country: initialUserData?.address?.country || '',
      location: {
        latitude: initialUserData?.address?.location?.latitude || null,
        longitude: initialUserData?.address?.location?.longitude || null,
      },
    },
    profileImage: null,
  });

  const [profileImageUri, setProfileImageUri] = useState(
    initialUserData?.profileImage && initialUserData.profileImage.length > 0
      ? initialUserData.profileImage[0]
      : null
  );

  const pickImage = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (permissionResult.granted === false) {
        Alert.alert('Permission Required', 'Permission to access camera roll is required!');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        // Removed mediaTypes to avoid compatibility issues - defaults to images
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        setProfileImageUri(asset.uri);
        setFormData(prev => ({
          ...prev,
          profileImage: {
            uri: asset.uri,
            type: 'image/jpeg',
            name: 'profile.jpg',
          }
        }));
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setFormData(prev => ({
        ...prev,
        dob: selectedDate,
      }));
    }
  };

  // Get current location function
  const getCurrentLocation = async () => {
    try {
      setLocationLoading(true);
      
      // Request location permission
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Location Permission Required',
          'Please grant location permission to get your current location.',
          [{ text: 'OK' }]
        );
        return;
      }

      // Get current location
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      if (location) {
        setFormData(prev => ({
          ...prev,
          address: {
            ...prev.address,
            location: {
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            },
          },
        }));

        Alert.alert(
          'Location Updated',
          `Latitude: ${location.coords.latitude.toFixed(6)}\nLongitude: ${location.coords.longitude.toFixed(6)}`,
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Error getting location:', error);
      Alert.alert('Error', 'Failed to get current location. Please try again.');
    } finally {
      setLocationLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      // Validate required fields
      if (!formData.name.trim()) {
        Alert.alert('Validation Error', 'Name is required');
        return;
      }

      if (!formData.email.trim()) {
        Alert.alert('Validation Error', 'Email is required');
        return;
      }

      // Check if there's an image to upload
      const hasImage = formData.profileImage !== null;

      let response;
      
      if (hasImage) {
        // Use FormData for image upload
        const submitFormData = new FormData();
        
        // Add basic fields
        submitFormData.append('name', formData.name.trim());
        submitFormData.append('email', formData.email.trim());
        
        if (formData.phone && formData.phone.trim()) {
          submitFormData.append('phone', formData.phone.trim());
        }
        if (formData.age && formData.age.toString().trim()) {
          submitFormData.append('age', parseInt(formData.age));
        }
        if (formData.dob) {
          submitFormData.append('dob', formData.dob.toISOString());
        }

        // Add address fields
        if (formData.address.street && formData.address.street.trim()) {
          submitFormData.append('street', formData.address.street.trim());
        }
        if (formData.address.city && formData.address.city.trim()) {
          submitFormData.append('city', formData.address.city.trim());
        }
        if (formData.address.state && formData.address.state.trim()) {
          submitFormData.append('state', formData.address.state.trim());
        }
        if (formData.address.zip && formData.address.zip.trim()) {
          submitFormData.append('zip', formData.address.zip.trim());
        }
        if (formData.address.country && formData.address.country.trim()) {
          submitFormData.append('country', formData.address.country.trim());
        }
        
        // Add location coordinates
        if (formData.address.location.latitude) {
          submitFormData.append('latitude', parseFloat(formData.address.location.latitude));
        }
        if (formData.address.location.longitude) {
          submitFormData.append('longitude', parseFloat(formData.address.location.longitude));
        }

        // Add profile image
        const imageFile = {
          uri: formData.profileImage.uri,
          type: formData.profileImage.type || 'image/jpeg',
          name: formData.profileImage.name || `profile_${Date.now()}.jpg`,
        };
        
        submitFormData.append('profileImage', imageFile);
        
        response = await updateUserProfile(submitFormData, true);
      } else {
        // Use JSON for no image upload
        const jsonData = {
          name: formData.name.trim(),
          email: formData.email.trim(),
        };

        if (formData.phone.trim()) jsonData.phone = formData.phone.trim();
        if (formData.age) jsonData.age = parseInt(formData.age);
        if (formData.dob) jsonData.dob = formData.dob.toISOString();

        // Add address object
        const addressData = {};
        if (formData.address.street) addressData.street = formData.address.street;
        if (formData.address.city) addressData.city = formData.address.city;
        if (formData.address.state) addressData.state = formData.address.state;
        if (formData.address.zip) addressData.zip = formData.address.zip;
        if (formData.address.country) addressData.country = formData.address.country;
        
        if (formData.address.location.latitude && formData.address.location.longitude) {
          addressData.location = {
            latitude: parseFloat(formData.address.location.latitude),
            longitude: parseFloat(formData.address.location.longitude),
          };
        }

        if (Object.keys(addressData).length > 0) {
          jsonData.address = addressData;
        }
        
        response = await updateUserProfile(jsonData, false);
      }

      if (response.success) {
        Alert.alert(
          'Success',
          'Profile updated successfully!',
          [
            {
              text: 'OK',
              onPress: () => {
                if (refreshProfile) refreshProfile();
                navigation.goBack();
              },
            },
          ]
        );
      } else {
        // Check if it's a JWT expiry error - can be status 401 or 500
        const isJWTExpired = 
          (response.status === 401 || response.status === 500) && (
            response.message === 'jwt expired' ||
            response.message === 'Token expired' ||
            response.message === 'jwt malformed' ||
            response.message === 'invalid token' ||
            (response.message?.toLowerCase?.()?.includes('jwt') && 
             response.message?.toLowerCase?.()?.includes('expired'))
          );

        if (isJWTExpired) {
          if (handleTokenExpiry) {
            await handleTokenExpiry();
          }
          return;
        }

        Alert.alert(
          'Update Failed', 
          response.message || 'Failed to update profile',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      // Check if it's a JWT expiry error - can be status 401 or 500
      const isJWTExpired = 
        (error.response?.status === 401 || error.response?.status === 500) && (
          error.response?.data?.message === 'jwt expired' ||
          error.response?.data?.message === 'Token expired' ||
          error.response?.data?.message === 'jwt malformed' ||
          error.response?.data?.message === 'invalid token' ||
          (error.response?.data?.message?.toLowerCase?.()?.includes('jwt') && 
           error.response?.data?.message?.toLowerCase?.()?.includes('expired'))
        );

      if (isJWTExpired) {
        if (handleTokenExpiry) {
          await handleTokenExpiry();
        }
        return;
      }

      const errorMessage = error.response?.data?.message || error.message || 'An unexpected error occurred';
      Alert.alert(
        'Update Failed',
        errorMessage,
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
    }
  };

  // Fixed InputField component with stable refs
  const InputField = useCallback(({ label, value, onChangeText, placeholder, keyboardType = 'default', multiline = false }) => (
    <View style={styles.inputGroup}>
      <Text style={[styles.inputLabel, { color: isDark ? COLORS.white : COLORS.black }]}>
        {label}
      </Text>
      <TextInput
        style={[
          styles.textInput,
          multiline && styles.textInputMultiline,
          { 
            backgroundColor: isDark ? COLORS.darkBgLight : COLORS.lightGray,
            color: isDark ? COLORS.white : COLORS.black,
          }
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={isDark ? '#999' : '#666'}
        keyboardType={keyboardType}
        multiline={multiline}
        autoCorrect={false}
        autoCapitalize={keyboardType === 'email-address' ? 'none' : 'sentences'}
      />
    </View>
  ), [isDark]);

  return (
    <LinearGradient
      colors={isDark ? ['#1A1A1A', COLORS.darkBg] : [COLORS.white, '#F8F9FA']}
      style={styles.container}
    >
      <StatusBar 
        backgroundColor={isDark ? '#1A1A1A' : COLORS.white} 
        barStyle={isDark ? 'light-content' : 'dark-content'} 
      />
      
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: isDark ? COLORS.darkBgLight : '#E5E7EB' }]}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={[styles.headerButton, { backgroundColor: isDark ? COLORS.darkBgLight : COLORS.lightGray }]}
        >
          <MaterialCommunityIcons name="arrow-left" size={getResponsiveSize(24)} color={isDark ? COLORS.white : COLORS.black} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: isDark ? COLORS.white : COLORS.black }]}>Edit Profile</Text>
        <TouchableOpacity 
          onPress={handleSubmit}
          disabled={loading}
          style={[
            styles.headerButton, 
            { backgroundColor: isDark ? COLORS.primaryDark : COLORS.primary, opacity: loading ? 0.6 : 1 }
          ]}
        >
          {loading ? (
            <ActivityIndicator size="small" color={COLORS.white} />
          ) : (
            <MaterialCommunityIcons name="check" size={getResponsiveSize(18)} color={COLORS.white} />
          )}
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Profile Image Section */}
        <View style={[styles.imageSection, { backgroundColor: isDark ? COLORS.darkBg : COLORS.white }]}>
          <Text style={[styles.sectionTitle, { color: isDark ? COLORS.white : COLORS.black }]}>
            Profile Picture
          </Text>
          <View style={styles.imageContainer}>
            <TouchableOpacity onPress={pickImage} style={styles.imagePickerContainer}>
              {profileImageUri ? (
                <Image source={{ uri: profileImageUri }} style={styles.profileImage} />
              ) : (
                <View style={[styles.placeholderImage, { backgroundColor: isDark ? COLORS.primaryDark : COLORS.primary }]}>
                  <MaterialCommunityIcons 
                    name="camera-plus" 
                    size={getResponsiveSize(40)} 
                    color={COLORS.white} 
                  />
                </View>
              )}
              <View style={[styles.imageOverlay, { backgroundColor: isDark ? 'rgba(0,0,0,0.6)' : 'rgba(0,0,0,0.4)' }]}>
                <MaterialCommunityIcons 
                  name="camera" 
                  size={getResponsiveSize(20)} 
                  color={COLORS.white} 
                />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Basic Information */}
        <View style={[styles.section, { backgroundColor: isDark ? COLORS.darkBg : COLORS.white }]}>
          <Text style={[styles.sectionTitle, { color: isDark ? COLORS.white : COLORS.black }]}>
            Basic Information
          </Text>
          
          <InputField
            label="Full Name *"
            value={formData.name}
            onChangeText={useCallback((text) => {
              setFormData(prev => ({ ...prev, name: text }));
            }, [])}
            placeholder="Enter your full name"
          />

          <InputField
            label="Email Address *"
            value={formData.email}
            onChangeText={useCallback((text) => {
              setFormData(prev => ({ ...prev, email: text }));
            }, [])}
            placeholder="Enter your email"
            keyboardType="email-address"
          />

          <InputField
            label="Phone Number"
            value={formData.phone}
            onChangeText={useCallback((text) => {
              setFormData(prev => ({ ...prev, phone: text }));
            }, [])}
            placeholder="Enter your phone number"
            keyboardType="phone-pad"
          />

          <InputField
            label="Age"
            value={formData.age}
            onChangeText={useCallback((text) => {
              setFormData(prev => ({ ...prev, age: text }));
            }, [])}
            placeholder="Enter your age"
            keyboardType="numeric"
          />

          {/* Date of Birth */}
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: isDark ? COLORS.white : COLORS.black }]}>
              Date of Birth
            </Text>
            <TouchableOpacity
              style={[
                styles.textInput,
                { backgroundColor: isDark ? COLORS.darkBgLight : COLORS.lightGray }
              ]}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={{ color: isDark ? COLORS.white : COLORS.black }}>
                {formData.dob.toLocaleDateString()}
              </Text>
              <MaterialCommunityIcons 
                name="calendar" 
                size={getResponsiveSize(20)} 
                color={isDark ? COLORS.white : COLORS.black} 
              />
            </TouchableOpacity>
          </View>

          {showDatePicker && (
            <DateTimePicker
              value={formData.dob}
              mode="date"
              display="default"
              onChange={handleDateChange}
              maximumDate={new Date()}
            />
          )}
        </View>

        {/* Address Information */}
        <View style={[styles.section, { backgroundColor: isDark ? COLORS.darkBg : COLORS.white }]}>
          <Text style={[styles.sectionTitle, { color: isDark ? COLORS.white : COLORS.black }]}>
            Address Information
          </Text>
          
          <InputField
            label="Street Address"
            value={formData.address.street}
            onChangeText={useCallback((text) => {
              setFormData(prev => ({ 
                ...prev, 
                address: { ...prev.address, street: text }
              }));
            }, [])}
            placeholder="Enter street address"
            multiline
          />

          <InputField
            label="City"
            value={formData.address.city}
            onChangeText={useCallback((text) => {
              setFormData(prev => ({ 
                ...prev, 
                address: { ...prev.address, city: text }
              }));
            }, [])}
            placeholder="Enter city"
          />

          <InputField
            label="State"
            value={formData.address.state}
            onChangeText={useCallback((text) => {
              setFormData(prev => ({ 
                ...prev, 
                address: { ...prev.address, state: text }
              }));
            }, [])}
            placeholder="Enter state"
          />

          <InputField
            label="ZIP Code"
            value={formData.address.zip}
            onChangeText={useCallback((text) => {
              setFormData(prev => ({ 
                ...prev, 
                address: { ...prev.address, zip: text }
              }));
            }, [])}
            placeholder="Enter ZIP code"
            keyboardType="numeric"
          />

          <InputField
            label="Country"
            value={formData.address.country}
            onChangeText={useCallback((text) => {
              setFormData(prev => ({ 
                ...prev, 
                address: { ...prev.address, country: text }
              }));
            }, [])}
            placeholder="Enter country"
          />

          {/* Location Section */}
          <View style={styles.locationSection}>
            <View style={styles.locationHeader}>
              <Text style={[styles.inputLabel, { color: isDark ? COLORS.white : COLORS.black }]}>
                Location Coordinates
              </Text>
              <TouchableOpacity
                style={[styles.locationButton, { backgroundColor: isDark ? COLORS.primaryDark : COLORS.primary }]}
                onPress={getCurrentLocation}
                disabled={locationLoading}
              >
                {locationLoading ? (
                  <ActivityIndicator size="small" color={COLORS.white} />
                ) : (
                  <>
                    <MaterialCommunityIcons name="crosshairs-gps" size={16} color={COLORS.white} />
                    <Text style={styles.locationButtonText}>Get Current Location</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>

            <View style={styles.locationRow}>
              <View style={[styles.locationInput, { flex: 1, marginRight: 10 }]}>
                <InputField
                  label="Latitude"
                  value={formData.address.location.latitude?.toString() || ''}
                  onChangeText={useCallback((text) => {
                    setFormData(prev => ({ 
                      ...prev, 
                      address: { 
                        ...prev.address, 
                        location: { ...prev.address.location, latitude: text }
                      }
                    }));
                  }, [])}
                  placeholder="Latitude"
                  keyboardType="numeric"
                />
              </View>
              <View style={[styles.locationInput, { flex: 1, marginLeft: 10 }]}>
                <InputField
                  label="Longitude"
                  value={formData.address.location.longitude?.toString() || ''}
                  onChangeText={useCallback((text) => {
                    setFormData(prev => ({ 
                      ...prev, 
                      address: { 
                        ...prev.address, 
                        location: { ...prev.address.location, longitude: text }
                      }
                    }));
                  }, [])}
                  placeholder="Longitude"
                  keyboardType="numeric"
                />
              </View>
            </View>
          </View>
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[
            styles.submitButton,
            { 
              backgroundColor: isDark ? COLORS.primaryDark : COLORS.primary,
              opacity: loading ? 0.6 : 1,
            }
          ]}
          onPress={handleSubmit}
          disabled={loading}
        >
          <LinearGradient
            colors={[isDark ? COLORS.primaryDark : COLORS.primary, isDark ? COLORS.primary : COLORS.primaryDark]}
            style={styles.submitButtonGradient}
          >
            {loading ? (
              <ActivityIndicator size="small" color={COLORS.white} />
            ) : (
              <>
                <MaterialCommunityIcons name="content-save" size={getResponsiveSize(20)} color={COLORS.white} />
                <Text style={styles.submitButtonText}>Update Profile</Text>
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>

        <View style={{ height: 30 }} />
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  
  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 15 : 50,
    paddingBottom: 15,
    paddingHorizontal: screenWidth * 0.04,
    borderBottomWidth: 1,
  },
  headerButton: {
    width: getResponsiveSize(40),
    height: getResponsiveSize(40),
    borderRadius: getResponsiveSize(20),
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: { fontSize: getResponsiveSize(20), fontWeight: 'bold' },

  // Scroll View
  scrollView: { flex: 1 },

  // Sections
  section: {
    margin: screenWidth * 0.04,
    padding: screenWidth * 0.05,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  sectionTitle: { 
    fontSize: getResponsiveSize(18), 
    fontWeight: 'bold', 
    marginBottom: 20,
  },

  // Image Section
  imageSection: {
    margin: screenWidth * 0.04,
    padding: screenWidth * 0.05,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  imageContainer: {
    alignItems: 'center',
  },
  imagePickerContainer: {
    position: 'relative',
    width: getResponsiveSize(120),
    height: getResponsiveSize(120),
    borderRadius: getResponsiveSize(60),
    overflow: 'hidden',
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: getResponsiveSize(60),
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: getResponsiveSize(60),
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '35%',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Input Fields
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: getResponsiveSize(14),
    fontWeight: '600',
    marginBottom: 8,
  },
  textInput: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    fontSize: getResponsiveSize(16),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textInputMultiline: {
    minHeight: getResponsiveSize(80),
    textAlignVertical: 'top',
  },

  // Location Section
  locationSection: {
    marginBottom: 20,
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  locationButtonText: {
    color: COLORS.white,
    fontSize: getResponsiveSize(12),
    fontWeight: '600',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  locationInput: {
    flex: 1,
  },

  // Submit Button
  submitButton: {
    margin: screenWidth * 0.04,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  submitButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: getResponsiveSize(16),
    paddingHorizontal: getResponsiveSize(32),
    gap: getResponsiveSize(10),
  },
  submitButtonText: {
    color: COLORS.white,
    fontSize: getResponsiveSize(18),
    fontWeight: 'bold',
  },
});

export default EditProfileScreen;