// Reusable BottomTabs Navigation Component
import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, useColorScheme, Platform, StatusBar } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/Ionicons";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute, useNavigationState, useFocusEffect } from '@react-navigation/native';

// Placeholder component for tab screens (will be replaced by navigation)
const PlaceholderScreen = ({ route }) => null;

const Tab = createBottomTabNavigator();
const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

export default function BottomTabs({ 
  tabs = [
    { name: "Search", screenName: "Search", icon: "search", iconOutline: "search-outline" },
    { name: "Cart", screenName: "CheckoutPage", icon: "cart", iconOutline: "cart-outline" },
    { name: "Home", screenName: "HomeTabs", icon: "home", iconOutline: "home-outline" },
    { name: "History", screenName: "HistoryPage", icon: "time", iconOutline: "time-outline" },
    { name: "Settings", screenName: "SettingsPage", icon: "settings", iconOutline: "settings-outline" }
  ],
  currentActiveTab = "Home" // Default to Home tab being active, can be passed from parent
}) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState(currentActiveTab);
  
  // Get the actual current screen name from navigation
  const getCurrentScreenName = () => {
    try {
      const state = navigation.getState();
      
      // Get the current route from navigation state
      const getCurrentRoute = (navState) => {
        if (!navState || !navState.routes) {
          return null;
        }
        
        const currentRoute = navState.routes[navState.index];
        
        // If current route has nested state, go deeper
        if (currentRoute.state) {
          return getCurrentRoute(currentRoute.state);
        }
        
        return currentRoute.name;
      };
      
      return getCurrentRoute(state);
    } catch (error) {
      console.log('Navigation state error:', error);
      return null;
    }
  };
  
  // Sync active tab with current screen
  useFocusEffect(
    React.useCallback(() => {
      const currentScreenName = getCurrentScreenName();
      console.log('Current screen name:', currentScreenName);
      
      // Find the tab that matches the current screen
      const matchingTab = tabs.find(tab => tab.screenName === currentScreenName);
      if (matchingTab) {
        console.log('Setting active tab to:', matchingTab.name);
        setActiveTab(matchingTab.name);
      }
    }, [])
  );

  // Calculate safe bottom height for Android navigation
  const bottomSafeHeight = Platform.OS === 'android' 
    ? Math.max(insets.bottom, 10) 
    : insets.bottom;
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: [
          styles.tabBar,
          {
            backgroundColor: isDark ? '#1F1F1F' : '#FFFFFF',
            borderTopColor: isDark ? '#333333' : '#E5E5E5',
            paddingBottom: bottomSafeHeight + (Platform.OS === 'android' ? 5 : 0),
            height: Platform.OS === 'android' 
              ? Math.max(screenHeight * 0.085, 70) + bottomSafeHeight
              : Math.max(screenHeight * 0.09, 75) + bottomSafeHeight,
          }
        ],
        tabBarIcon: ({ focused, color, size }) => {
          const currentTab = tabs.find(tab => tab.name === route.name);
          const iconName = focused ? currentTab?.icon : currentTab?.iconOutline;
          
          return <Icon name={iconName || 'circle'} size={Math.min(screenWidth * 0.055, 24)} color={color} />;
        },
        tabBarLabel: ({ focused }) => (
          <Text
            style={{
              fontSize: Math.min(screenWidth * 0.028, 12),
              color: focused 
                ? (isDark ? "#FF6B6B" : "#E53935")
                : (isDark ? "#CCCCCC" : "#666666"),
              fontWeight: focused ? "600" : "400",
              fontFamily: Platform.OS === 'android' ? 'Roboto' : 'System',
            }}
          >
            {route.name}
          </Text>
        ),
        tabBarActiveTintColor: isDark ? "#FF6B6B" : "#E53935",
        tabBarInactiveTintColor: isDark ? "#CCCCCC" : "#666666",
      })}
      tabBar={(props) => <CustomTabBar {...props} tabs={tabs} navigation={navigation} activeTab={activeTab} setActiveTab={setActiveTab} />}
    >
      {tabs.map((tab) => (
        <Tab.Screen 
          key={tab.name} 
          name={tab.name} 
          component={PlaceholderScreen} 
        />
      ))}
    </Tab.Navigator>
  );
}

// Custom Tab Bar Component that handles navigation without importing screens
const CustomTabBar = ({ state, descriptors, navigation: tabNavigation, tabs, navigation, activeTab, setActiveTab }) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const insets = useSafeAreaInsets();
  
  const bottomSafeHeight = Platform.OS === 'android' 
    ? Math.max(insets.bottom, 10) 
    : insets.bottom;

  // Simple function to check if tab is active
  const isTabActive = (tab) => {
    return activeTab === tab.name;
  };

  // Simple color scheme - Red for active, Gray for inactive
  const getActiveColor = (isActive) => {
    if (isActive) {
      return "#E53935"; // Red color for active tab (same in light/dark)
    }
    return isDark ? "#CCCCCC" : "#666666"; // Gray for inactive
  };

  return (
    <View style={[
      styles.customTabBar,
      {
        backgroundColor: isDark ? '#1F1F1F' : '#FFFFFF',
        borderTopColor: isDark ? '#333333' : '#E5E5E5',
        paddingBottom: bottomSafeHeight + (Platform.OS === 'android' ? 5 : 0),
        height: Platform.OS === 'android' 
          ? Math.max(screenHeight * 0.085, 70) + bottomSafeHeight
          : Math.max(screenHeight * 0.09, 75) + bottomSafeHeight,
      }
    ]}>
      {state.routes.map((route, index) => {
        const currentTab = tabs.find(tab => tab.name === route.name);
        const isActive = isTabActive(currentTab);
        
        const onPress = () => {
          // Set the active tab and navigate to the actual screen using screenName
          setActiveTab(currentTab.name);
          if (currentTab?.screenName) {
            navigation.navigate(currentTab.screenName);
          }
        };

        const iconName = isActive ? currentTab?.icon : currentTab?.iconOutline;
        const activeColor = getActiveColor(isActive);

        return (
          <TouchableOpacity
            key={route.name}
            onPress={onPress}
            style={styles.tabItem}
            activeOpacity={0.7}
          >
            <Icon 
              name={iconName || 'circle'} 
              size={Math.min(screenWidth * 0.055, 24)} 
              color={activeColor}
            />
            <Text
              style={[
                styles.tabLabel,
                {
                  color: activeColor,
                  fontWeight: isActive ? "600" : "400",
                }
              ]}
            >
              {route.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}



const styles = StyleSheet.create({
  customTabBar: {
    flexDirection: 'row',
    paddingTop: Math.max(screenHeight * 0.012, 10),
    paddingHorizontal: screenWidth * 0.02,
    borderTopWidth: 1,
    elevation: Platform.OS === 'android' ? 8 : 0,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: screenHeight * 0.01,
    paddingHorizontal: screenWidth * 0.01,
  },
  tabLabel: {
    fontSize: Math.min(screenWidth * 0.028, 12),
    fontFamily: Platform.OS === 'android' ? 'Roboto' : 'System',
    textAlign: 'center',
    marginTop: 4,
  },
});
