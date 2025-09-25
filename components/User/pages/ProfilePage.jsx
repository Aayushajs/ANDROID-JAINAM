import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions,
  Platform, StatusBar, useColorScheme, Alert, Animated, Easing,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../context/AuthContext';
import { useNavigation } from '@react-navigation/native';

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

// User Data
const userData = {
  name: 'Aayush Sharma',
  email: 'aayush.sharma@gmail.com',
  phone: '+91 98765 43210',
  age: '28 Years',
  bloodGroup: 'B+',
  avatar: 'A',
  bio: 'Regular customer at MEDICARE+ pharmacy. Health-conscious individual who prefers quality medicines and reliable healthcare products.',
};

// Menu Items
const profileMenuItems = [
  { id: 1, title: 'Personal Information', icon: 'account-outline', nav: 'EditProfile' },
  { id: 2, title: 'Order History', icon: 'shopping-outline', nav: 'OrderHistory' },
  { id: 3, title: 'My Prescriptions', icon: 'file-document-outline', nav: 'MyPrescriptions' },
  { id: 4, title: 'Saved Addresses', icon: 'map-marker-multiple-outline', nav: 'SavedAddresses' },
  { id: 5, title: 'Loyalty Points', icon: 'star-circle-outline', nav: 'LoyaltyPoints' },
  { id: 6, title: 'Wishlist', icon: 'heart-outline', nav: 'Wishlist' },
  { id: 7, title: 'Notifications', icon: 'bell-outline', nav: 'Notifications' },
  { id: 8, title: 'Settings', icon: 'cog-outline', nav: 'Settings' },
  { id: 9, title: 'Help & Support', icon: 'help-circle-outline', nav: 'Support' },
];

// Components
const MenuItem = ({ item, navigation, isDark }) => (
  <TouchableOpacity
    style={[styles.menuItem, { backgroundColor: isDark ? COLORS.darkBg : COLORS.white }]}
    onPress={() => navigation.navigate(item.nav)}
    activeOpacity={0.7}
  >
    <View style={styles.menuItemLeft}>
      <View style={[styles.menuIconContainer, { backgroundColor: isDark ? COLORS.darkBgLight : COLORS.lightGray }]}>
        <MaterialCommunityIcons 
          name={item.icon} 
          size={getResponsiveSize(22)} 
          color={isDark ? COLORS.primaryDark : COLORS.primary} 
        />
      </View>
      <Text style={[styles.menuItemText, { color: isDark ? COLORS.white : COLORS.black }]}>
        {item.title}
      </Text>
    </View>
    <MaterialCommunityIcons 
      name="chevron-right" 
      size={getResponsiveSize(20)} 
      color={isDark ? '#CCCCCC' : '#9CA3AF'} 
    />
  </TouchableOpacity>
);

const ContactItem = ({ icon, text, isDark }) => (
  <View style={styles.contactItem}>
    <MaterialCommunityIcons 
      name={icon} 
      size={getResponsiveSize(20)} 
      color={isDark ? COLORS.primaryDark : COLORS.primary} 
    />
    <Text style={[styles.contactText, { color: isDark ? '#CCCCCC' : '#4B5563' }]}>
      {text}
    </Text>
  </View>
);

const ProfilePage = () => {
  const navigation = useNavigation();
  const { logout } = useAuth();
  const isDark = useColorScheme() === 'dark';

  const handleLogout = () => {
    Alert.alert(
      '🔐 Secure Logout',
      'You are about to sign out of your MEDICARE+ account. Your session will be terminated securely.\n\nAre you sure you want to continue?',
      [
        {
          text: 'Stay Logged In',
          style: 'cancel',
          onPress: () => console.log('Logout cancelled'),
        },
        {
          text: 'Logout Safely',
          style: 'destructive',
          onPress: () => {
            console.log('User logged out securely');
            logout();
          },
        },
      ],
      {
        cancelable: true,
        onDismiss: () => console.log('Alert dismissed'),
      }
    );
  };

  const ProfileCard = ({ userData, isDark }) => {
    const [cardExpanded, setCardExpanded] = useState(false);
    const profilePicScale = new Animated.Value(1);
    const cardBorderRadius = new Animated.Value(16);
    const contentTop = new Animated.Value(80);
  
    const animateCard = (expand) => {
      // Separate native and layout animations to avoid conflicts
      const nativeAnimations = [
        Animated.timing(profilePicScale, { 
          toValue: expand ? 0.4 : 1, 
          duration: 500, 
          easing: Easing.out(Easing.ease), 
          useNativeDriver: true 
        }),
      ];
      
      const layoutAnimations = [
        Animated.timing(cardBorderRadius, { 
          toValue: expand ? 55 : 16, 
          duration: 500, 
          easing: Easing.out(Easing.ease), 
          useNativeDriver: false 
        }),
        Animated.timing(contentTop, { 
          toValue: expand ? 20 : 80, 
          duration: 500, 
          easing: Easing.out(Easing.ease), 
          useNativeDriver: false 
        }),
      ];
      
      // Run animations in parallel but separated by driver type
      Animated.parallel([
        Animated.parallel(nativeAnimations),
        Animated.parallel(layoutAnimations)
      ]).start();
      setCardExpanded(expand);
    };

    const socialIcons = ['instagram', 'twitter', 'github'];
  
    return (
      <TouchableOpacity 
        activeOpacity={0.9}
        onPress={() => animateCard(!cardExpanded)}
        style={[styles.cardContainer, { backgroundColor: isDark ? COLORS.darkBg : COLORS.white }]}
      >
        <Animated.View 
          style={[
            styles.profilePicContainer,
            { 
              transform: [{ scale: profilePicScale }],
              borderRadius: cardExpanded ? 20 : 50,
              borderColor: isDark ? '#c56161ff' : '#fff' // Green border color
            }
          ]}
        >
          <View style={styles.profilePic}>
            <Text style={styles.avatarText}>{userData.avatar}</Text>
          </View>
        </Animated.View>
  
        <Animated.View 
          style={[
            styles.contentContainer,
            { top: contentTop, backgroundColor: isDark ? COLORS.primaryDark : COLORS.primary }
          ]}
        >
          <View style={styles.content}>
            <Text style={styles.userName}>{userData.name}</Text>
            <Text style={styles.userBio}>{userData.bio}</Text>
          </View>
  
          <View style={styles.bottomContainer}>
            <View style={styles.socialLinks}>
              {socialIcons.map((icon) => (
                <TouchableOpacity key={icon}>
                  <MaterialCommunityIcons name={icon} size={getResponsiveSize(30)} color={COLORS.white} />
                </TouchableOpacity>
              ))}
            </View>
            
            <TouchableOpacity 
              style={styles.contactButton}
              onPress={() => navigation.navigate('EditProfile')}
            >
              <Text style={styles.contactButtonText}>Contact Me</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </TouchableOpacity>
    );
  };

  const contactItems = [
    { icon: 'email-outline', text: userData.email },
    { icon: 'phone-outline', text: userData.phone },
    { icon: 'water', text: `Blood Group: ${userData.bloodGroup}` },
    { icon: 'cake-variant', text: `Age: ${userData.age}` },
  ];

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
        <Text style={[styles.headerTitle, { color: isDark ? COLORS.white : COLORS.black }]}>Profile</Text>
        <TouchableOpacity 
          onPress={() => navigation.navigate('EditProfile')}
          style={[styles.headerButton, { backgroundColor: isDark ? COLORS.primaryDark : COLORS.primary }]}
        >
          <MaterialCommunityIcons name="pencil" size={getResponsiveSize(18)} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <ProfileCard userData={userData} isDark={isDark} />

        {/* Contact & Health Information */}
        <View style={[styles.section, { backgroundColor: isDark ? COLORS.darkBg : COLORS.white }]}>
          <Text style={[styles.sectionTitle, { color: isDark ? COLORS.white : COLORS.black }]}>Personal Details</Text>
          {contactItems.map((item, index) => (
            <ContactItem key={index} icon={item.icon} text={item.text} isDark={isDark} />
          ))}
        </View>

        {/* Menu Items */}
        <View style={styles.menuSection}>
          {profileMenuItems.map((item) => (
            <MenuItem key={item.id} item={item} navigation={navigation} isDark={isDark} />
          ))}
        </View>

        {/* Circular Logout Button */}
        <TouchableOpacity
          style={[
            styles.circularLogoutButton, 
            { 
              backgroundColor: isDark ? '#DC2626' : '#da5959ff',
              shadowColor: isDark ? '#DC2626' : '#EF4444',
            }
          ]}
          onPress={handleLogout}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons 
            name="logout" 
            size={getResponsiveSize(22)} 
            color={COLORS.white} 
          />
        </TouchableOpacity>

        <Text style={[styles.versionText, { color: isDark ? '#666666' : '#9CA3AF' }]}>MEDICARE+ v1.0.0</Text>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  
  // Common styles
  shadow: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 5 },
  centerItems: { alignItems: 'center', justifyContent: 'center' },
  font: { fontFamily: Platform.OS === 'android' ? 'Roboto' : 'System' },
  
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
    ...StyleSheet.flatten([{ alignItems: 'center', justifyContent: 'center' }])
  },
  headerTitle: { fontSize: getResponsiveSize(20), fontWeight: 'bold' },

  // Scroll View
  scrollView: { flex: 1 },
  scrollContent: { paddingBottom: 30 },

  // Profile Card
  cardContainer: {
    margin: screenWidth * 0.04,
    height: getResponsiveSize(280),
    borderRadius: 32,
    padding: 3,
    overflow: 'hidden',
    ...StyleSheet.flatten([{ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 8, elevation: 5 }])
  },
  profilePicContainer: {
    position: 'absolute',
    top: 10,
    left: 10,
    width: getResponsiveSize(100),
    height: getResponsiveSize(100),
    borderRadius: 50,
    borderWidth: 7,
    zIndex: 3,
    ...StyleSheet.flatten([{ alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 8, elevation: 5 }])
  },
  profilePic: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
    backgroundColor: COLORS.primaryDark,
    ...StyleSheet.flatten([{ alignItems: 'center', justifyContent: 'center' }])
  },
  avatarText: { color: COLORS.white, fontSize: getResponsiveSize(32), fontWeight: 'bold' },
  contentContainer: {
    position: 'absolute',
    left: 3,
    right: 3,
    bottom: 3,
    borderRadius: 29,
    borderTopLeftRadius: 70,
    borderTopRightRadius:30,
    backgroundColor: COLORS.primary,
    padding: getResponsiveSize(20),
    zIndex: 2,
  },
  content: { marginBottom: getResponsiveSize(20) },
  userName: { color: COLORS.white, fontSize: getResponsiveSize(25), fontWeight: 'bold', marginBottom: getResponsiveSize(5), marginTop: 10 },
  userBio: { color: COLORS.white, fontSize: getResponsiveSize(13), opacity: 0.9 },
  bottomContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  socialLinks: { flexDirection: 'row', gap: getResponsiveSize(15) },
  contactButton: { backgroundColor: COLORS.white, paddingHorizontal: getResponsiveSize(15), paddingVertical: getResponsiveSize(8), borderRadius: 20 },
  contactButtonText: { color: COLORS.primary, fontSize: getResponsiveSize(12), fontWeight: 'bold' },

  // Sections
  section: {
    marginHorizontal: screenWidth * 0.04,
    marginBottom: 20,
    padding: screenWidth * 0.05,
    borderRadius: 16,
    ...StyleSheet.flatten([{ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 5 }])
  },
  sectionTitle: { fontSize: getResponsiveSize(18), fontWeight: 'bold', marginBottom: 15 },
  contactItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10 },
  contactText: { fontSize: getResponsiveSize(14), marginLeft: 15 },

  // Menu
  menuSection: { marginHorizontal: screenWidth * 0.04, marginBottom: 20 },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: screenWidth * 0.04,
    marginBottom: 8,
    borderRadius: 12,
    ...StyleSheet.flatten([{ shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 }])
  },
  menuItemLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  menuIconContainer: {
    width: getResponsiveSize(40),
    height: getResponsiveSize(40),
    borderRadius: getResponsiveSize(20),
    marginRight: 15,
    ...StyleSheet.flatten([{ alignItems: 'center', justifyContent: 'center' }])
  },
  menuItemText: { fontSize: getResponsiveSize(16), flex: 1 },

  // Circular Logout Button
  circularLogoutButton: {
    width: getResponsiveSize(50),
    height: getResponsiveSize(50),
    borderRadius: getResponsiveSize(25),
    marginHorizontal: screenWidth * 0.8,
    marginBottom: 20,
    ...StyleSheet.flatten([{ 
      alignItems: 'center', 
      justifyContent: 'center',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.3,
      shadowRadius: 6,
      elevation: 5
    }])
  },

  // Version
  versionText: { textAlign: 'center', fontSize: getResponsiveSize(12), marginBottom: 10 },
});

export default ProfilePage;