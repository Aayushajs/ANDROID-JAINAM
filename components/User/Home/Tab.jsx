import React, { useRef } from 'react';
import { View, TouchableOpacity, StyleSheet, Animated, Dimensions, Text, Easing, Alert } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext'; // Import your AuthContext

// Import your screens
import HomePage from './Home';

const { width, height } = Dimensions.get('window');
const Tab = createBottomTabNavigator();
const TAB_BAR_HEIGHT = height * 0.12;
const BUTTON_SIZE = width * 0.14;
const ACTIVE_BUTTON_SIZE = width * 0.16;

const HomeTabs = () => {
  const navigation = useNavigation();
  const { logout } = useAuth(); // Get logout function from AuthContext
  const animatedValues = useRef(tabs.map(() => new Animated.Value(0))).current;
  const backgroundAnim = useRef(new Animated.Value(0)).current;

  const handleTabPress = (index) => {
    if (tabs[index].name === 'Logout') {
      // Handle logout
      Alert.alert(
        'Logout',
        'Are you sure you want to logout?',
        [
          {
            text: 'Cancel',
            style: 'cancel'
          },
          { 
            text: 'Logout', 
            onPress: async () => {
              try {
                await logout(); // Call the logout function from AuthContext
                navigation.reset({
                  index: 0,
                  routes: [{ name: 'Login' }], // Replace 'Login' with your actual login screen name
                });
              } catch (error) {
                console.error('Logout error:', error);
                Alert.alert('Error', 'Failed to logout. Please try again.');
              }
            } 
          }
        ]
      );
      return;
    }

    // Animate all buttons
    animatedValues.forEach((value, i) => {
      Animated.timing(value, {
        toValue: i === index ? 1 : 0,
        duration: 350,
        easing: Easing.out(Easing.exp),
        useNativeDriver: true,
      }).start();
    });

    // Background pulse animation
    Animated.sequence([
      Animated.timing(backgroundAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(backgroundAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const bgScale = backgroundAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.05],
  });

  return (
    <View style={{ flex: 1 }}>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: styles.tabBar,
          tabBarShowLabel: false,
        }}
      >
        {tabs.map((tab, index) => (
          <Tab.Screen
            key={tab.name}
            name={tab.name}
            component={tab.component || View} // Use View as fallback for logout
            options={{
              tabBarButton: (props) => (
                <Animated.View style={{ transform: [{ scale: bgScale }] }}>
                  <TabButton
                    {...props}
                    index={index}
                    icon={tab.icon}
                    label={tab.label}
                    animatedValue={animatedValues[index]}
                    onPress={() => handleTabPress(index)}
                    isLogout={tab.name === 'Logout'}
                  />
                </Animated.View>
              ),
            }}
          />
        ))}
      </Tab.Navigator>
    </View>
  );
};

const TabButton = ({ onPress, icon, label, animatedValue, isLogout }) => {
  const scale = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.15],
  });

  const translateY = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -height * 0.02],
  });

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.8, 1],
  });

  const borderWidth = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 3],
  });

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      style={styles.tabButton}
    >
      <Animated.View style={[
        styles.buttonContainer,
        { 
          transform: [{ scale }, { translateY }],
          opacity,
          borderWidth,
          borderColor: isLogout ? '#FF3B30' : '#FFF',
        }
      ]}>
        <LinearGradient
          colors={isLogout ? ['#FF3B30', '#C62828'] : ['#4A90E2', '#1E3C72']}
          style={styles.buttonGradient}
          start={{ x: 0.7, y: 0 }}
          end={{ x: 0.3, y: 1 }}
        >
          <Icon name={icon} size={width * 0.06} color="#FFF" />
        </LinearGradient>
      </Animated.View>
      <Animated.Text style={[
        styles.label,
        { 
          opacity,
          transform: [{ translateY }],
          color: isLogout ? '#FF3B30' : '#FFF',
        }
      ]}>
        {label}
      </Animated.Text>
    </TouchableOpacity>
  );
};

const tabs = [
  { name: 'Home', component: HomePage, icon: 'home-sharp', label: 'Home' },
  { name: 'Logout', icon: 'log-out-outline', label: 'Logout' },
];

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    bottom: height * 0.0,
    left: width * 0.05,
    right: width * 0.05,
    height: TAB_BAR_HEIGHT,
    backgroundColor: '#0A0A0A',
    borderRadius: 25,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: width * 0.02,
    elevation: 15,
    shadowColor: '#1E90FF',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 15,
    borderWidth: 1,
    borderColor: '#1E1E1E',
  },
  tabButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  buttonContainer: {
    width: ACTIVE_BUTTON_SIZE,
    height: ACTIVE_BUTTON_SIZE,
    borderRadius: ACTIVE_BUTTON_SIZE / 2,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#FFF',
    backgroundColor: '#0A0A0A',
  },
  buttonGradient: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    marginTop: height * 0.005,
    fontSize: width * 0.03,
    color: '#FFF',
    fontWeight: '600',
    letterSpacing: 0.5,
    textShadowColor: 'rgba(30, 144, 255, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
});

export default HomeTabs;