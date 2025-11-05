import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Platform,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');
const getResponsiveSize = (size) => (width / 375) * size;

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

const ActionGrid = ({ navigation, isDark }) => {
  const items = [
    { id: 1, title: 'Orders', icon: 'package-variant-closed', nav: 'Orders' },
    { id: 2, title: 'Wishlist', icon: 'heart-outline', nav: 'Wishlist' },
    { id: 3, title: 'Coupons', icon: 'gift-outline', nav: 'Coupons' },
    { id: 4, title: 'Help Center', icon: 'headset', nav: 'HelpCenter' },
  ];

  return (
    <View style={styles.container}>
      {items.map((item) => (
        <TouchableOpacity
          key={item.id}
          activeOpacity={0.85}
          style={[
            styles.cardWrapper,
            {
              backgroundColor: isDark ? COLORS.darkBgLight : COLORS.white,
              shadowColor: isDark ? '#000' : '#aaa',
            },
          ]}
          onPress={() => navigation?.navigate(item.nav)}
        >
          <LinearGradient
            colors={
              isDark
                ? [COLORS.primaryDark, '#b74b4b']
                : [COLORS.primary, '#f89f92']
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.iconWrapper}
          >
            <MaterialCommunityIcons
              name={item.icon}
              size={getResponsiveSize(28)}
              color={COLORS.white}
            />
          </LinearGradient>

          <Text
            style={[
              styles.cardText,
              { color: isDark ? COLORS.white : COLORS.black },
            ]}
          >
            {item.title}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default ActionGrid;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: width * 0.05,
    marginTop: 20,
  },
  cardWrapper: {
    width: '47%',
    borderRadius: 10,
    paddingVertical: 7,
    marginBottom: 15,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  iconWrapper: {
    width: getResponsiveSize(45),
    height: getResponsiveSize(45),
    borderRadius: getResponsiveSize(30),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
    marginTop: 5,
    ...Platform.select({
      android: {
        elevation: 4,
      },
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
    }),
  },
  cardText: {
    fontSize: getResponsiveSize(15),
    fontWeight: '600',
    letterSpacing: 0.5,
    marginBottom: 5,
  },
});
