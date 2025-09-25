import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
  FlatList,
  useColorScheme,
  Platform,
  StatusBar,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ActivityIndicator } from "react-native";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

// Dummy Data
const dealOfDay = [
  {
    title: "Vitamin C Tablets",
    desc: "Boost your immunity",
    price: "₹199",
    originalPrice: "₹299",
    discount: "33% off",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQCAFq44qPtfmzKLT2B9aOwfhRFgbu6RYujcg&s",
  },
  {
    title: "Pain Relief Spray",
    desc: "Instant relief",
    price: "₹299",
    originalPrice: "₹499",
    discount: "40% off",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTK5Yd8-VAaHVTgdUXVRFavHzQhBX9dtakIrA&s",
  },
  {
    title: "Multivitamin Capsules",
    desc: "Complete nutrition",
    price: "₹399",
    originalPrice: "₹599",
    discount: "33% off",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT3odw2e0OzDWPG1qrML7SoK5ugUdqEKHmDVAOHOCR6dzaeKZaCQkWsc53ngFNDVGghUzU&usqp=CAU",
  },
  {
    title: "Cough Syrup",
    desc: "Soothes throat",
    price: "₹249",
    originalPrice: "₹349",
    discount: "29% off",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQUH2iFpAQi741_X84WORSX13E6CeL1pv_39A&s",
  },
  {
    title: "First Aid Kit",
    desc: "Emergency essentials",
    price: "₹499",
    originalPrice: "₹699",
    discount: "28% off",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_NeIVoRvR2EpH7kfAu6uw-eQ7dzpShqt8WlozjJBxqvkMF0nK0oicUBjittio9PzjaE4&usqp=CAU",
  },
];

const offers = [
  {
    title: "Diabetes Care",
    desc: "Flat 40% OFF",
    img: "https://static.vecteezy.com/system/resources/previews/002/217/707/non_2x/medicine-trendy-banner-vector.jpg",
    bgColor: ["#FF9A9E", "#FAD0C4"],
  },
  {
    title: "Multivitamins",
    desc: "Buy 1 Get 1 Free",
    img: "https://5.imimg.com/data5/SELLER/Default/2023/5/307797715/FU/EL/RC/90163806/condom-3-500x500.jpg",
    bgColor: ["#A1C4FD", "#C2E9FB"],
  },
  {
    title: "Skincare",
    desc: "Upto 50% OFF",
    img: "https://t4.ftcdn.net/jpg/02/81/42/77/360_F_281427785_gfahY8bX4VYCGo6jlfO8St38wS9cJQop.jpg",
    bgColor: ["#FFD1FF", "#FAD0C4"],
  },
  {
    title: "Skincare",
    desc: "Upto 50% OFF",
    img: "https://giace.org/wp-content/uploads/2019/08/AdobeStock_171882033.jpeg",
    bgColor: ["#FFD1FF", "#FAD0C4"],
  },
  {
    title: "Skincare",
    desc: "Upto 50% OFF",
    img: "https://articles-1mg.gumlet.io/articles/wp-content/uploads/2024/08/shutterstock_2378382317.jpg?compress=true&quality=80&w=1000&dpr=2.6",
    bgColor: ["#FFD1FF", "#FAD0C4"],
  },
];

const categories = [
  {
    name: "Medicines",
    image:
      "https://static.vecteezy.com/system/resources/previews/017/695/607/non_2x/online-pharmacy-line-circle-background-icon-vector.jpg",
  },
  {
    name: "Vitamins",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTkeHYamA0HcjH5TpiJd1t8rvAU7ISB3XYWoA&s",
  },
  {
    name: "Baby Care",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT2CGtaRzN5cFXigDSbOyKvX5jIAc8EcFZtsw&s",
  },
  {
    name: "First Aid",
    image:
      "https://c8.alamy.com/comp/2HPJCFC/healthcare-icon-medical-pharmacy-logo-on-letter-e-health-charity-logo-with-e-logotype-template-2HPJCFC.jpg",
  },
  {
    name: "Wellness",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQB-fqeDuG--dxqEeoI_In_bN8gzTBszw4Ddw&shttps://png.pngtree.com/png-vector/20221005/ourmid/pngtree-bag-with-pills-pharmacy-online-png-image_6252019.png",
  },
];

const trending = [
  {
    title: "Blood Pressure Monitor",
    price: "₹1,299",
    rating: 4.5,
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT5vNDXiKdpsCwanXiHh89FU5JpvuYczaelDg&s",
  },
  {
    title: "Diabetic Test Strips",
    price: "₹499",
    rating: 4.2,
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQqyCvpaCHA8mRtH3FKaRSRPqWQHN-LoTcK2nx1PxPWA2Ra5PFId2XXlGJQGE0j-nFWDIM&usqp=CAU",
  },
  {
    title: "Baby Nutrition",
    price: "₹899",
    rating: 4.7,
    img: "https://assets.indiadesire.com/images/amazon%20pharmacy%20offers.jpg",
  },
  {
    title: "Diabetic Test Strips",
    price: "₹499",
    rating: 4.2,
    img: "https://assets.indiadesire.com/images/apollo%20pharmacy%20offers.jpg",
  },
  {
    title: "Baby Nutrition",
    price: "₹899",
    rating: 4.7,
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-h6GUHKDB9znJ9-VT1Kg8p95QYsA8gaBoEA&s",
  },
  {
    title: "Digital Thermometer",
    price: "₹299",
    rating: 4.3,
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRezMiTv84VR3OIlXXRDWmxV8VTGzHzCjkFRQ&s",
  },
];

const newArrivals = [
  {
    title: "Organic Herbal Tea",
    price: "₹249",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRmNrKRu43wEKHRrP1K2pXgFuuzdZ_LiRGp-w&s",
  },
  {
    title: "Energy Booster",
    price: "₹699",
    img: "https://img.freepik.com/free-vector/pharmaceutical-medicine-healthcare-template-vector-social-media-post_53876-117769.jpg?semt=ais_hybrid&w=740&q=80",
  },
  {
    title: "Ayurvedic Supplements",
    price: "₹549",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQwGVv-WnOjAs7YgD8YZrYMfSVc39BuY4jFEyx8h-ZIkcbSfdtPH5MwI5x3TF-7EnGVC-4&usqp=CAU",
  },
];

const StoreScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const [selectedCategory, setSelectedCategory] = React.useState(null);

  // Responsive dimensions based on screen size
  const getResponsiveSize = (size) => {
    const baseWidth = 375; // iPhone 6/7/8 width as base
    return (screenWidth / baseWidth) * size;
  };

  // Dynamic colors matching HeroSection system
  const colors = {
    background: isDark ? "#1A1A1A" : "#FFFFFF",
    surface: isDark ? "#3A3A3A" : "#F8F9FA",
    primary: isDark ? "#a55353ff" : "#e96462ff",
    secondary: isDark ? "#FFFFFF" : "#1F2937",
    onBackground: isDark ? "#FFFFFF" : "#333333",
    onSurface: isDark ? "#FFFFFF" : "#000000",
    searchBg: isDark ? "#3A3A3A" : "#F0F0F0",
    cardBg: isDark ? "#3A3A3A" : "#FFFFFF",
    textSecondary: isDark ? "#CCCCCC" : "#666666",
    border: isDark ? "#333333" : "#E5E5E5",
    iconButton: isDark ? "#3A3A3A" : "#F0F0F0",
    accent: isDark ? "#FF6B6B" : "#1976D2",
  };

  return (
    <LinearGradient
      colors={isDark ? ["#2A2A2A", "#2A2A2A"] : ["#FFFFFF", "#F8F9FA"]}
      style={styles.container}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.content}
        contentContainerStyle={{ paddingBottom: getResponsiveSize(20) }}
      >
        {/* Categories */}
        <Text
          style={[
            styles.sectionTitle,
            {
              color: colors.onBackground,
              fontSize: getResponsiveSize(18),
            },
          ]}
        >
          Categories
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesScroll}
          contentContainerStyle={{ paddingHorizontal: getResponsiveSize(6) }}
        >
          {categories.map((item, index) => {
            const selected = selectedCategory === item.name;
            return (
              <TouchableOpacity
                key={index}
                activeOpacity={0.8}
                onPress={() => setSelectedCategory(item.name)}
                style={[
                  styles.categoryPill,
                  { marginRight: getResponsiveSize(12) },
                ]}
                accessibilityRole="button"
                accessibilityState={{ selected }}
              >
                <LinearGradient
                  colors={
                    selected
                      ? [colors.primary, colors.accent || colors.primary]
                      : [colors.surface, colors.cardBg]
                  }
                  style={[
                    styles.categoryCircle,
                    {
                      width: getResponsiveSize(64),
                      height: getResponsiveSize(64),
                      borderRadius: getResponsiveSize(32),
                    },
                  ]}
                >
                  <AppImage
                    uri={item.image}
                    style={{
                      width: getResponsiveSize(64),
                      height: getResponsiveSize(64),
                      borderRadius: getResponsiveSize(32),
                    }}
                    resizeMode="cover"
                    alt={item.name}
                  />
                </LinearGradient>
                <Text
                  style={[
                    styles.categoryText,
                    {
                      color: colors.onBackground,
                      fontSize: getResponsiveSize(12),
                    },
                  ]}
                  numberOfLines={1}
                >
                  {item.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Deal of the Day */}
        <View style={{ marginHorizontal: getResponsiveSize(16) }}>
          <SectionHeader
            title="Deal of the Day"
            actionText="View all"
            colors={colors}
            getResponsiveSize={getResponsiveSize}
          />
        </View>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={dealOfDay}
          keyExtractor={(_, i) => i.toString()}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => navigation.navigate('ProductDetail', { productId: item.title, product: item })}
            >
              <ProductCard
                title={item.title}
                desc={item.desc}
                price={item.price}
                originalPrice={item.originalPrice}
                discount={item.discount}
                img={item.img}
                colors={colors}
                getResponsiveSize={getResponsiveSize}
                imageSize={getResponsiveSize(110)}
                cardWidth={screenWidth * 0.56}
              />
            </TouchableOpacity>
          )}
        />

        {/* Offers */}
        <View style={{ marginHorizontal: getResponsiveSize(16) }}>
          <SectionHeader
            title="Special Offers"
            actionText="See all"
            colors={colors}
            getResponsiveSize={getResponsiveSize}
          />
        </View>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={offers}
          keyExtractor={(_, i) => i.toString()}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <OfferBanner
              title={item.title}
              desc={item.desc}
              img={item.img}
              bgColor={item.bgColor}
              colors={colors}
              isDark={isDark}
              getResponsiveSize={getResponsiveSize}
            />
          )}
        />

        {/* Trending */}
        <View style={{ marginHorizontal: getResponsiveSize(16) }}>
          <SectionHeader
            title="Trending Products"
            actionText="View all"
            colors={colors}
            getResponsiveSize={getResponsiveSize}
          />
        </View>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={trending}
          keyExtractor={(_, i) => i.toString()}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <TouchableOpacity activeOpacity={0.85} onPress={() => navigation.navigate('ProductDetail', { productId: item.title, product: item })}>
              <TrendingProductCard
                title={item.title}
                price={item.price}
                rating={item.rating}
                img={item.img}
                colors={colors}
                getResponsiveSize={getResponsiveSize}
              />
            </TouchableOpacity>
          )}
        />

        {/* New Arrivals */}
        <View style={{ marginHorizontal: getResponsiveSize(16) }}>
          <SectionHeader
            title="New Arrivals"
            actionText="View all"
            colors={colors}
            getResponsiveSize={getResponsiveSize}
          />
        </View>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={newArrivals}
          keyExtractor={(_, i) => i.toString()}
          contentContainerStyle={[
            styles.listContent,
            { paddingLeft: getResponsiveSize(10) },
          ]}
          renderItem={({ item }) => (
            <TouchableOpacity activeOpacity={0.85} onPress={() => navigation.navigate('ProductDetail', { productId: item.title, product: item })}>
              <NewArrivalCard
                title={item.title}
                price={item.price}
                img={item.img}
                colors={colors}
                getResponsiveSize={getResponsiveSize}
              />
            </TouchableOpacity>
          )}
        />

        {/* Sponsored */}
        <Text
          style={[
            styles.sectionTitle,
            {
              color: colors.onBackground,
              fontSize: getResponsiveSize(18),
            },
          ]}
        >
          Sponsored
        </Text>
        <View
          style={[
            styles.sponsoredContainer,
            {
              backgroundColor: colors.surface,
              borderRadius: 12,
              padding: 10,
              marginHorizontal: getResponsiveSize(0),
            },
          ]}
        >
          <AppImage
            uri={
              "https://media.istockphoto.com/id/1091707480/vector/pills.jpg?s=612x612&w=0&k=20&c=DnR_GBwTQRnr4IY9vMfSGsPNKaiA7wrNRvgxKwR73Zs="
            }
            style={[
              styles.sponsoredImg,
              {
                backgroundColor: colors.cardBg,
                borderRadius: 12,
                overflow: "hidden",
              },
            ]}
            resizeMode="cover"
            placeholderColor={colors.cardBg}
            alt="Sponsored banner"
          />
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

// AppImage: robust image wrapper with placeholder and loading state
const AppImage = ({
  uri,
  style,
  resizeMode = "contain",
  alt,
  placeholderColor = "#E0E0E0",
}) => {
  const [error, setError] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

  if (error || !uri) {
    return (
      <View
        style={[
          {
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: placeholderColor,
          },
          style,
        ]}
      >
        <Icon name="image-outline" size={24} color="#9E9E9E" />
      </View>
    );
  }

  return (
    <View
      style={[
        { justifyContent: "center", alignItems: "center", overflow: "hidden" },
        style,
      ]}
    >
      {loading && <ActivityIndicator style={{ position: "absolute" }} />}
      <Image
        source={{ uri }}
        style={{ width: "100%", height: "100%" }}
        resizeMode={resizeMode}
        onError={() => setError(true)}
        onLoadEnd={() => setLoading(false)}
        accessibilityLabel={alt}
      />
    </View>
  );
};

// Section Header
const SectionHeader = ({ title, actionText, colors, getResponsiveSize }) => (
  <View style={styles.sectionHeader}>
    <Text
      style={[
        styles.sectionHeaderTitle,
        {
          color: colors.onBackground,
          fontSize: getResponsiveSize(18),
        },
      ]}
    >
      {title}
    </Text>
    <TouchableOpacity>
      <Text
        style={[
          styles.sectionAction,
          {
            color: colors.accent,
            fontSize: getResponsiveSize(14),
          },
        ]}
      >
        {actionText}
      </Text>
    </TouchableOpacity>
  </View>
);

// Product Card
const ProductCard = ({
  title,
  desc,
  price,
  originalPrice,
  discount,
  img,
  isNew,
  colors,
  getResponsiveSize,
  imageSize,
  cardWidth,
}) => {
  const requestedImgH = imageSize || getResponsiveSize(70);
  const maxImgH = screenHeight * 0.16; // cap image height so it doesn't push content out
  const imgH = Math.min(requestedImgH, maxImgH);
  const cw = cardWidth || screenWidth * 0.58;

  return (
    <View
      style={[
        styles.productCard,
        {
          backgroundColor: colors.cardBg,
          borderColor: colors.border,
          width: cw,
          minHeight: screenHeight * 0.22,
        },
      ]}
    >
      {isNew && (
        <View
          style={[
            styles.newBadge,
            {
              backgroundColor: colors.primary,
            },
          ]}
        >
          <Text
            style={[
              styles.newBadgeText,
              {
                fontSize: getResponsiveSize(10),
              },
            ]}
          >
            NEW
          </Text>
        </View>
      )}

      {/* full-width image, capped height */}
      <AppImage
        uri={img}
        style={[{ width: "100%", height: imgH }, styles.productImg]}
        resizeMode="contain"
        alt={title}
      />

      <View style={[styles.productInfo, { flexShrink: 1 }]}>
        <Text
          style={[
            styles.productTitle,
            {
              color: colors.onSurface,
              fontSize: getResponsiveSize(12),
            },
          ]}
          numberOfLines={1}
        >
          {title}
        </Text>
        {desc && (
          <Text
            style={[
              styles.productDesc,
              {
                color: colors.textSecondary,
                fontSize: getResponsiveSize(10),
              },
            ]}
            numberOfLines={1}
          >
            {desc}
          </Text>
        )}

        <View style={styles.priceContainer}>
          <Text
            style={[
              styles.productPrice,
              {
                color: colors.primary,
                fontSize: getResponsiveSize(13),
              },
            ]}
          >
            {price}
          </Text>
          {originalPrice && (
            <Text
              style={[
                styles.originalPrice,
                {
                  color: colors.textSecondary,
                  fontSize: getResponsiveSize(10),
                },
              ]}
            >
              {originalPrice}
            </Text>
          )}
        </View>

        <View style={styles.bottomRow}>
          {discount && (
            <Text
              style={[
                styles.discountText,
                {
                  fontSize: getResponsiveSize(15),
                },
              ]}
            >
              {discount}
            </Text>
          )}
          <TouchableOpacity
            style={[
              styles.addToCartBtn,
              {
                backgroundColor: colors.primary,
                width: getResponsiveSize(38),
                height: getResponsiveSize(35),
                borderRadius: getResponsiveSize(20),
              },
            ]}
          >
            <Icon name="add" size={getResponsiveSize(16)} color="#FFF" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

// Trending Product Card
const TrendingProductCard = ({
  title,
  price,
  rating,
  img,
  colors,
  getResponsiveSize,
}) => (
  <View
    style={[
      styles.trendingCard,
      {
        backgroundColor: colors.cardBg,
        borderColor: colors.border,
        width: screenWidth * 0.47,
      },
    ]}
  >
    <View
      style={[
        styles.trendingImageContainer,
        {
          backgroundColor: colors.surface,
        },
      ]}
    >
      <AppImage
        uri={img}
        style={{
          width: getResponsiveSize(160),
          height: getResponsiveSize(100),
          borderRadius: getResponsiveSize(16),
        }}
        resizeMode="cover"
        alt={title}
      />
      <View
        style={[
          styles.trendingBadge,
          {
            backgroundColor: colors.primary,
          },
        ]}
      >
        <Icon name="trending-up" size={getResponsiveSize(12)} color="#fff" />
        <Text
          style={[
            styles.trendingBadgeText,
            {
              fontSize: getResponsiveSize(8),
            },
          ]}
        >
          HOT
        </Text>
      </View>
      <TouchableOpacity
        style={[
          styles.favoriteBtn,
          {
            backgroundColor: colors.cardBg,
            borderColor: colors.border,
          },
        ]}
      >
        <Icon
          name="heart-outline"
          size={getResponsiveSize(16)}
          color={colors.textSecondary}
        />
      </TouchableOpacity>
    </View>

    <View
      style={[
        styles.trendingInfo,
        {
          backgroundColor: colors.cardBg,
        },
      ]}
    >
      <View style={styles.trendingHeader}>
        <Text
          style={[
            styles.trendingTitle,
            {
              color: colors.onSurface,
              fontSize: getResponsiveSize(13),
            },
          ]}
          numberOfLines={2}
        >
          {title}
        </Text>
        <View
          style={[
            styles.ratingBadge,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
            },
          ]}
        >
          <Icon name="star" size={getResponsiveSize(10)} color="#FFD700" />
          <Text
            style={[
              styles.ratingText,
              {
                fontSize: getResponsiveSize(10),
              },
            ]}
          >
            {rating}
          </Text>
        </View>
      </View>

      <View style={styles.trendingFooter}>
        <View style={styles.priceSection}>
          <Text
            style={[
              styles.trendingPrice,
              {
                fontSize: getResponsiveSize(16),
              },
            ]}
          >
            {price}
          </Text>
          <Text
            style={[
              styles.trendingPriceLabel,
              {
                fontSize: getResponsiveSize(14),
                backgroundColor: colors.surface,
              },
            ]}
          >
            Best Price
          </Text>
        </View>
        <TouchableOpacity style={styles.trendingAddBtn}>
          <LinearGradient
            colors={[colors.primary, colors.accent]}
            style={[
              styles.addBtnGradient,
              {
                width: getResponsiveSize(36),
                height: getResponsiveSize(36),
              },
            ]}
          >
            <Icon
              name="cart-outline"
              size={getResponsiveSize(18)}
              color="#FFF"
            />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  </View>
);

// Offer Banner
const OfferBanner = ({
  title,
  desc,
  img,
  bgColor,
  colors,
  isDark,
  getResponsiveSize,
}) => (
  <LinearGradient
    colors={isDark ? [colors.surface, colors.cardBg] : bgColor}
    style={[
      styles.offerBanner,
      {
        width: screenWidth * 0.8,
        borderRadius: getResponsiveSize(12),
        padding: getResponsiveSize(15),
        borderWidth: isDark ? 1 : 0,
        borderColor: isDark ? colors.border : "transparent",
      },
    ]}
  >
    <View style={styles.offerContent}>
      <View>
        <Text
          style={[
            styles.offerTitle,
            {
              color: isDark ? colors.onBackground : "#2C3E50",
              fontSize: getResponsiveSize(16),
            },
          ]}
        >
          {title}
        </Text>
        <Text
          style={[
            styles.offerDesc,
            {
              color: isDark ? colors.textSecondary : "#2C3E50",
              fontSize: getResponsiveSize(13),
            },
          ]}
        >
          {desc}
        </Text>
        <TouchableOpacity
          style={[
            styles.offerBtn,
            {
              backgroundColor: isDark ? colors.primary : "#FFF",
              paddingHorizontal: getResponsiveSize(12),
              paddingVertical: getResponsiveSize(6),
              borderRadius: getResponsiveSize(16),
            },
          ]}
        >
          <Text
            style={[
              styles.offerBtnText,
              {
                color: isDark ? "#FFF" : "#2C3E50",
                fontSize: getResponsiveSize(12),
              },
            ]}
          >
            Shop Now
          </Text>
        </TouchableOpacity>
      </View>
      <AppImage
        uri={img}
        style={[
          styles.offerImg,
          {
            width: getResponsiveSize(150),
            height: getResponsiveSize(90),
            borderRadius: getResponsiveSize(12),
            backgroundColor: colors.cardBg,
          },
        ]}
        resizeMode="cover"
        alt={title}
        placeholderColor={colors.cardBg}
      />
    </View>
  </LinearGradient>
);

// New Arrival Card (polished, production-ready look)
const NewArrivalCard = ({ title, price, img, colors, getResponsiveSize }) => (
  <LinearGradient
    colors={[colors.surface, colors.cardBg]}
    style={[
      styles.newArrivalCard,
      { width: screenWidth * 0.68, borderRadius: getResponsiveSize(12) },
    ]}
  >
    <View style={styles.newArrivalContent}>
      <AppImage
        uri={img}
        style={[
          styles.newArrivalImg,
          { width: getResponsiveSize(110), height: getResponsiveSize(110) },
        ]}
        resizeMode="contain"
        alt={title}
      />
      <View style={{ flex: 1, paddingLeft: getResponsiveSize(12) }}>
        <Text
          style={[
            styles.newArrivalTitle,
            { color: colors.onSurface, fontSize: getResponsiveSize(16) },
          ]}
          numberOfLines={2}
        >
          {title}
        </Text>
        <Text
          style={[
            styles.newArrivalPrice,
            {
              color: colors.primary,
              fontSize: getResponsiveSize(15),
              marginTop: getResponsiveSize(8),
            },
          ]}
        >
          {price}
        </Text>
        <View
          style={{
            flexDirection: "row",
            marginTop: getResponsiveSize(10),
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            style={[
              styles.addBtnSmall,
              {
                backgroundColor: colors.primary,
                width: getResponsiveSize(36),
                height: getResponsiveSize(36),
                borderRadius: getResponsiveSize(18),
              },
            ]}
          >
            <Icon
              name="cart-outline"
              size={getResponsiveSize(20)}
              color="#FFF"
            />
          </TouchableOpacity>
          <TouchableOpacity style={{ marginLeft: getResponsiveSize(10) }}>
            <Text
              style={{
                color: colors.textSecondary,
                fontSize: getResponsiveSize(13),
              }}
            >
              Details
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </LinearGradient>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: -30,
  },
  content: {
    flex: 1,
    paddingHorizontal: 0, // removed page left/right padding to make content edge-to-edge
    paddingTop: 0, // Just 2px gap from header
  },
  sectionTitle: {
    fontWeight: "700",
    marginTop: screenHeight * 0.025,
    marginBottom: screenHeight * 0.02,
    fontFamily: Platform.OS === "android" ? "Roboto" : "System",
    letterSpacing: 0.3,
    marginLeft: screenWidth * 0.025,
  },
  categoriesScroll: {
    marginVertical: screenHeight * 0.008,
  },
  categoryItem: {
    alignItems: "center",
    backgroundColor: "000",
    paddingVertical: screenHeight * 0.01,
  },
  categoryImageContainer: {
    borderRadius: screenWidth * 0.08,
    borderWidth: 1,
    alignItems: "center",

    justifyContent: "center",
    marginBottom: screenHeight * 0.008,
    // Material Design elevation
    ...Platform.select({
      android: {
        elevation: 3,
      },
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
    }),
  },
  categoryImage: {
    resizeMode: "contain",
  },
  categoryText: {
    fontFamily: Platform.OS === "android" ? "Roboto" : "System",
    fontWeight: "500",
    textAlign: "center",
    marginTop: screenHeight * 0.005,
  },
  categoryPill: {
    alignItems: "center",
    width: screenWidth * 0.18,
  },
  categoryCircle: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 999,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: screenHeight * 0.03,
    marginBottom: screenHeight * 0.02,
    paddingHorizontal: 0,
  },
  sectionHeaderTitle: {
    fontWeight: "700",
    fontFamily: Platform.OS === "android" ? "Roboto" : "System",
    letterSpacing: 0.5,
  },
  sectionAction: {
    fontWeight: "600",
    fontFamily: Platform.OS === "android" ? "Roboto" : "System",
  },
  listContent: {
    paddingHorizontal: screenWidth * 0.009,
    paddingLeft: screenWidth * 0.02, // add left margin for lists like Deal of the Day
  },
  productCard: {
    marginHorizontal: screenWidth * 0.01,
    borderRadius: screenWidth * 0.025,
    marginBottom: screenHeight * 0.01,
    position: "relative",
    overflow: "hidden",
    minHeight: screenHeight * 0.22,
    borderWidth: 1,
    // Enhanced Material Design shadow
    ...Platform.select({
      android: {
        elevation: 4,
      },
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
    }),
  },
  newBadge: {
    position: "absolute",
    top: screenHeight * 0.012,
    left: screenWidth * 0.025,
    paddingHorizontal: screenWidth * 0.015,
    paddingVertical: screenHeight * 0.003,
    borderRadius: screenWidth * 0.01,
    zIndex: 1,
  },
  newBadgeText: {
    color: "#FFF",
    fontWeight: "bold",
    fontFamily: Platform.OS === "android" ? "Roboto" : "System",
  },
  productImg: {
    width: "100%",
    resizeMode: "contain",
    marginTop: screenHeight * 0.004,
  },
  productInfo: {
    padding: screenWidth * 0.015,
    flexShrink: 1,
  },
  productTitle: {
    fontWeight: "600",
    marginBottom: screenHeight * 0.003,
    lineHeight: screenHeight * 0.017,
    fontFamily: Platform.OS === "android" ? "Roboto" : "System",
  },
  productDesc: {
    marginBottom: screenHeight * 0.004,
    fontFamily: Platform.OS === "android" ? "Roboto" : "System",
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: screenHeight * 0.003,
  },
  productPrice: {
    fontWeight: "700",
    marginRight: screenWidth * 0.015,
    fontFamily: Platform.OS === "android" ? "Roboto" : "System",
  },
  originalPrice: {
    textDecorationLine: "line-through",
    fontFamily: Platform.OS === "android" ? "Roboto" : "System",
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: screenHeight * 0.0,
  },
  discountText: {
    color: "#4CAF50",
    fontWeight: "800",
    flex: 1,
    fontFamily: Platform.OS === "android" ? "Roboto" : "System",
  },
  addToCartBtn: {
    alignItems: "center",
    justifyContent: "center",
    // Material Design elevation
    ...Platform.select({
      android: {
        elevation: 3,
      },
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
      },
    }),
  },
  // New Arrivals
  newArrivalCard: {
    marginRight: screenWidth * 0.04,
    marginBottom: screenHeight * 0.02,
    padding: screenWidth * 0.03,
    overflow: "hidden",
    ...Platform.select({
      android: { elevation: 4 },
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
      },
    }),
  },
  newArrivalContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  newArrivalImg: {
    resizeMode: "contain",
    borderRadius: 12,
    backgroundColor: "transparent",
  },
  newArrivalTitle: {
    fontWeight: "700",
  },
  newArrivalPrice: {
    fontWeight: "700",
  },
  addBtnSmall: {
    justifyContent: "center",
    alignItems: "center",
    ...Platform.select({
      android: { elevation: 3 },
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.12,
        shadowRadius: 2,
      },
    }),
  },
  // ==================== TRENDING CARD STYLES ====================

  // Main Card Container
  trendingCard: {
    width: screenWidth * 0.47,
    height: 240,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    marginHorizontal: 6,
    marginBottom: 15,
    overflow: "hidden",
    position: "relative",
    // Shadow & Elevation
    elevation: 8,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    // Border
    borderWidth: 0.5,
    borderColor: "rgba(0,0,0,0.05)",
  },

  // Image Section Styles
  trendingImageContainer: {
    position: "relative",
    height: 110,
    backgroundColor: "#F8F9FA",
    justifyContent: "center",
    alignItems: "center",
  },
  trendingImg: {
    // replaced by inline style for full size
  },

  // Badge & Button Overlays
  trendingBadge: {
    position: "absolute",
    top: 8,
    left: 8,
    backgroundColor: "#FF4757",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 12,
    elevation: 2,
    shadowColor: "#FF4757",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  trendingBadgeText: {
    color: "#FFFFFF",
    fontSize: 8,
    fontWeight: "700",
    marginLeft: 2,
    letterSpacing: 0.5,
  },
  favoriteBtn: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.95)",
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },

  // Content Section Styles
  trendingInfo: {
    padding: 12,
    flex: 1,
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    position: "relative",
  },
  trendingHeader: {
    marginBottom: 0,
  },
  trendingTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#2C3E50",
    lineHeight: 16,
    marginBottom: -6,
    minHeight: 32,
  },

  // Rating Section
  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF8E1",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    alignSelf: "flex-start",
    borderWidth: 0.5,
    borderColor: "#FFD700",
    elevation: 1,
    marginBottom: -10,
  },
  ratingText: {
    fontSize: 10,
    color: "#ddd1bcff",
    marginLeft: 3,
    fontWeight: "700",
  },

  // Footer Section
  trendingFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginTop: 6,
  },
  priceSection: {
    flex: 1,
    marginRight: 8,
  },
  trendingPrice: {
    fontSize: 16,
    fontWeight: "700",
    color: "#f8f5edff",

    marginLeft: 2,
  },
  trendingPriceLabel: {
    fontSize: 8,
    color: "#37973bff",
    fontWeight: "600",
    backgroundColor: "#E8F5E8",
    paddingHorizontal: 6,
    marginBottom: 12,
    paddingVertical: 1,
    borderRadius: 4,
    alignSelf: "flex-start",
    elevation: 1,
  },

  // Add Button Styles
  trendingAddBtn: {
    borderRadius: 25,
    elevation: 3,
    shadowColor: "#4CAF50",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    marginBottom: 12,
  },
  addBtnGradient: {
    width: 32,
    height: 32,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },

  // ==================== END TRENDING CARD STYLES ====================
  offerBanner: {
    width: screenWidth * 0.8,
    borderRadius: 12,
    marginHorizontal: 8,
    padding: 15,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginBottom: 10,
  },
  offerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  offerTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2C3E50",
    marginBottom: 5,
  },
  offerDesc: {
    fontSize: 13,
    color: "#2C3E50",
    marginBottom: 10,
  },
  offerBtn: {
    backgroundColor: "#FFF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: "flex-start",
  },
  offerBtnText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#2C3E50",
  },
  offerImg: {
    width: 70,
    height: 70,
    resizeMode: "contain",
    borderRadius: 12,
    overflow: "hidden",
  },
  sponsoredContainer: {
    paddingHorizontal: 15,
  },
  sponsoredImg: {
    width: "100%",
    height: 150,
    resizeMode: "cover",
    borderRadius: 12,
    marginBottom: 100,
  },
});

export default StoreScreen;
