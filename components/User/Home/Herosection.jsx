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
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const categories = [
  { name: "Medicines", image: "https://cdn-icons-png.flaticon.com/512/3004/3004458.png" },
  { name: "Vitamins", image: "https://cdn-icons-png.flaticon.com/128/375/375279.png" },
  { name: "Baby Care", image: "https://cdn-icons-png.flaticon.com/128/11496/11496762.png" },
  { name: "First Aid", image: "https://cdn-icons-png.flaticon.com/128/2869/2869818.png" },
  { name: "Wellness", image: "https://cdn-icons-png.flaticon.com/128/10605/10605925.png" },
];

const placeholders = [
  "Search medicines, vitamins...",
  "Find health products...",
  "Search for supplements...",
  "Look for baby care items...",
  "Find wellness products...",
  "Search prescription drugs...",
];

const offers = [
  {
    title: "UP TO 50% OFF",
    subtitle: "On Health & Wellness",
    description: "Premium medicines",
    image: "https://static.vecteezy.com/system/resources/thumbnails/023/367/257/small_2x/flash-sale-discount-banner-template-promotion-posts-super-sale-banner-template-design-web-banner-for-mega-sale-promotion-discount-sale-banner-end-of-season-special-offer-banner-vector.jpg",
    colors: ["#FF6B6B", "#FF8A95"]
  },
  {
    title: "BUY 1 GET 1 FREE",
    subtitle: "On All Vitamins",
    description: "Boost your immunity",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQpbIxZe6RotTGkJ-V-j9ItFIKx4jQUSuIrzw&s",
    colors: ["#4ECDC4", "#44A08D"]
  },
  {
    title: "30% OFF",
    subtitle: "Baby Care Products",
    description: "Safe & gentle care",
    image: "https://www.shutterstock.com/image-vector/world-pharmacist-day-vector-template-260nw-1734942017.jpg",
    colors: ["#A8E6CF", "#7FCDCD"]
  },
  {
    title: "FLAT 40% OFF",
    subtitle: "First Aid Essentials",
    description: "Emergency ready kit",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRnIO2oHnHs3TtLQbINvFuGRuXK-Ou0Xe92KpM7X-UxTGHlrFXA0IRmZ5SCma4cxnt-Luw&usqp=CAU",
    colors: ["#FFB6C1", "#FFA07A"]
  },
  {
    title: "25% OFF",
    subtitle: "Wellness Products",
    description: "Natural supplements",
    image: "https://img.freepik.com/premium-vector/pharmacist_23-2148174024.jpg",
    colors: ["#DDA0DD", "#DA70D6"]
  }
];

// Get screen dimensions for responsive design
const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

const HeroSection = ({ navigation }) => {
  const [currentPlaceholder, setCurrentPlaceholder] = useState(0);
  const [currentOffer, setCurrentOffer] = useState(0);
  const [currentScrollIndex, setCurrentScrollIndex] = useState(0);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const insets = useSafeAreaInsets();
  const flatListRef = useRef(null);

  // Create infinite scroll data by repeating offers
  const infiniteOffers = [...offers, ...offers, ...offers]; // 3 sets for smooth infinite scroll
  const startIndex = offers.length; // Start from middle set

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

  useEffect(() => {
    // Initialize scroll position to middle set
    setTimeout(() => {
      if (flatListRef.current) {
        setCurrentScrollIndex(startIndex);
        flatListRef.current.scrollToIndex({
          index: startIndex,
          animated: false,
        });
      }
    }, 100);

    // Placeholder text changer
    const placeholderInterval = setInterval(() => {
      setCurrentPlaceholder((prev) => (prev + 1) % placeholders.length);
    }, 2000);

    // Auto-scroll with infinite loop
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
        const visibleOfferIndex = (nextScrollIndex - startIndex) % offers.length;
        setCurrentOffer(visibleOfferIndex);
        
        return nextScrollIndex;
      });
    }, 3000);

    return () => {
      clearInterval(placeholderInterval);
      clearInterval(offerInterval);
    };
  }, [startIndex]);

  // Handle scroll end for infinite loop
  const onScrollEnd = (event) => {
    const contentOffset = event.nativeEvent.contentOffset.x;
    const cardWidth = screenWidth * 0.85 + 16;
    const currentIndex = Math.round(contentOffset / cardWidth);
    
    setCurrentScrollIndex(currentIndex);
    
    // Calculate which offer is visible for dots
    const visibleOfferIndex = (currentIndex - startIndex + offers.length) % offers.length;
    setCurrentOffer(visibleOfferIndex);
    
    // Reset position if we're near the edges for seamless infinite scroll
    if (currentIndex >= infiniteOffers.length - offers.length) {
      // Near the end, jump back to middle section
      setTimeout(() => {
        const resetIndex = startIndex + (currentIndex - startIndex) % offers.length;
        setCurrentScrollIndex(resetIndex);
        if (flatListRef.current) {
          flatListRef.current.scrollToIndex({
            index: resetIndex,
            animated: false,
          });
        }
      }, 50);
    } else if (currentIndex < offers.length) {
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
      {/* 🔍 Search Bar */}
      <View style={[
        styles.searchContainer, 
        { 
          backgroundColor: colors.searchBg,
          height: getResponsiveSize(48),
          marginTop: Platform.OS === 'android' ? getResponsiveSize(10) : 0,
        }
      ]}>
        <Icon 
          name="search-outline" 
          size={getResponsiveSize(20)} 
          color={colors.textSecondary} 
        />
        <TouchableOpacity
          activeOpacity={0.8}
          style={{ flex: 1 }}
          onPress={() => {
            if (navigation && typeof navigation.navigate === 'function') {
              navigation.navigate('Search', { query: placeholders[currentPlaceholder] });
            }
          }}
        >
          <Text style={[styles.searchInput, { 
            color: colors.onSurface,
            fontSize: getResponsiveSize(14),
            textAlign: 'center',
            marginHorizontal: 0,
            marginTop: Platform.OS === 'android' ? getResponsiveSize(12) : 0,
          }]} numberOfLines={1}>{placeholders[currentPlaceholder]}</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Icon 
            name="mic-outline" 
            size={getResponsiveSize(20)} 
            color={colors.textSecondary} 
          />
        </TouchableOpacity>
      </View>

      {/* Featured Title + Sort/Filter */}
      <View style={styles.featuredRow}>
        <Text style={[styles.featuredText, { 
          color: colors.onBackground,
          fontSize: getResponsiveSize(20),
        }]}>Featured Medicines</Text>
        <View style={styles.actionButtons}>
          <TouchableOpacity style={[styles.actionBtn, {
            backgroundColor: colors.surface,
            borderColor: colors.border,
          }]}>
            <Icon 
              name="swap-vertical-outline" 
              size={getResponsiveSize(16)} 
              color={colors.onSurface} 
            />
            <Text style={[styles.actionText, { 
              color: colors.onSurface,
              fontSize: getResponsiveSize(12),
            }]}>Sort</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionBtn, {
            backgroundColor: colors.surface,
            borderColor: colors.border,
          }]}>
            <Icon 
              name="filter-outline" 
              size={getResponsiveSize(16)} 
              color={colors.onSurface} 
            />
            <Text style={[styles.actionText, { 
              color: colors.onSurface,
              fontSize: getResponsiveSize(12),
            }]}>Filter</Text>
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
        {categories.map((item, index) => (
          <TouchableOpacity key={index} style={[styles.categoryItem, {
            marginRight: getResponsiveSize(15),
          }]}>
            <View style={[styles.categoryImageContainer, {
              backgroundColor: colors.surface,
              borderColor: colors.border,
              width: getResponsiveSize(65),
              height: getResponsiveSize(65),
            }]}>
              <Image 
                source={{ uri: item.image }} 
                style={[styles.categoryImage, {
                  width: getResponsiveSize(35),
                  height: getResponsiveSize(35),
                }]} 
              />
            </View>
            <Text style={[styles.categoryText, { 
              color: colors.onBackground,
              fontSize: getResponsiveSize(12),
            }]}>{item.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Auto-Scrolling Offer Banners */}
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
        renderItem={({ item: offer, index }) => (
          <LinearGradient
            colors={isDark ? ['#1A1A1A', '#2A2A2A'] : offer.colors}
            style={[styles.bannerContainer, {
              borderRadius: getResponsiveSize(16),
              padding: getResponsiveSize(20),
              marginVertical: getResponsiveSize(20),
              marginHorizontal: getResponsiveSize(7.5),
              width: screenWidth * 0.90, // 90% of screen width
              borderWidth: isDark ? 1 : 0,
              borderColor: isDark ? colors.border : 'transparent',
            }]}
          >
            <View style={styles.bannerTextContainer}>
              <Text style={[styles.bannerTitle, {
                fontSize: getResponsiveSize(22),
                color: isDark ? colors.primary : '#FFFFFF',
              }]}>{offer.title}</Text>
              <Text style={[styles.bannerSub, {
                fontSize: getResponsiveSize(14),
                color: isDark ? colors.onBackground : '#FFFFFF',
              }]}>{offer.subtitle}</Text>
              <Text style={[styles.bannerSub, {
                fontSize: getResponsiveSize(13),
                color: isDark ? colors.textSecondary : '#FFFFFF',
                opacity: 0.9,
              }]}>{offer.description}</Text>

              <TouchableOpacity style={[styles.shopNowBtn, {
                paddingVertical: getResponsiveSize(8),
                paddingHorizontal: getResponsiveSize(16),
                borderRadius: getResponsiveSize(8),
                backgroundColor: isDark ? colors.primary : '#FFFFFF',
              }]}>
                <Text style={[styles.shopNowText, {
                  fontSize: getResponsiveSize(14),
                  color: isDark ? '#FFFFFF' : offer.colors[0],
                }]}>Order Now →</Text>
              </TouchableOpacity>
            </View>
            <Image
              source={{ uri: offer.image }}
              style={[styles.bannerImage, {
                width: getResponsiveSize(120),
                height: getResponsiveSize(110),
                borderRadius: getResponsiveSize(35),
              }]}
            />
          </LinearGradient>
        )}
        keyExtractor={(item, index) => index.toString()}
        style={styles.offersContainer}
      />

      {/* Offer Indicator Dots */}
      <View style={styles.indicatorContainer}>
        {offers.map((_, index) => (
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
    </ScrollView>
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
    borderRadius: screenWidth * 0.03, // 3% of screen width
    paddingHorizontal: screenWidth * 0.025, // 2.5% of screen width
    marginBottom: screenHeight * 0.02, // 2% of screen height
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
    paddingVertical: screenHeight * 0.008,
    paddingHorizontal: screenWidth * 0.03,
    borderRadius: screenWidth * 0.02,
    borderWidth: 1,
    // Material Design elevation
    ...Platform.select({
      android: {
        elevation: 1,
      },
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 1,
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
    resizeMode: 'contain',
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
});

export default HeroSection;
