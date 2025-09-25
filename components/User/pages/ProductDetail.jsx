import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  ScrollView,
  Animated,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColorScheme } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const { width: screenWidth } = Dimensions.get('window');

const ProductDetail = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const productId = route?.params?.productId;

  // placeholder product data (in real app fetch by id)
  const passed = route?.params?.product;
  const product = passed
    ? {
        id: passed.title || productId || '1',
        name: passed.title || 'Product',
        shortTitle: passed.desc || '',
        images: [passed.img || 'https://via.placeholder.com/800x600.png?text=Product'],
        units: ['Strip of 10', 'Bottle 60ml', 'Pack of 20'],
        rating: 4.5,
        reviews: 120,
        price: passed.price ? Number((passed.price + '').replace(/[^0-9]/g, '')) || 0 : 0,
        finalPrice: passed.price ? Number((passed.price + '').replace(/[^0-9]/g, '')) || 0 : 0,
        discountPercent: passed.discount || '',
        gst: '18% (incl.)',
        deliveryTime: '2 - 4 days',
        description: passed.desc || 'No description provided.',
        benefits: [
          'Fast acting pain relief',
          'Reduces fever effectively',
          'Suitable for adults and children'
        ],
        similar: [],
      }
    : {
        id: productId || '1',
        name: 'Paracetamol 500mg Tablet',
        shortTitle: 'Fast acting pain relief',
        images: [
          'https://via.placeholder.com/800x600.png?text=Product+1',
          'https://via.placeholder.com/800x600.png?text=Product+2',
          'https://via.placeholder.com/800x600.png?text=Product+3',
        ],
        units: ['Strip of 10', 'Bottle 60ml', 'Pack of 20'],
        rating: 4.6,
        reviews: 5800,
        price: 599,
        finalPrice: 449,
        discountPercent: 25,
        gst: '18% (incl.)',
        deliveryTime: '2 - 4 days',
        description:
          'This is an effective pain reliever and fever reducer. Use as directed. Keep out of reach of children.',
        benefits: [
          'Fast acting pain relief',
          'Reduces fever effectively',
          'Suitable for adults and children',
          'Trusted by healthcare professionals'
        ],
        similar: [
          { 
            id: 's1', 
            name: 'Ibuprofen 200mg', 
            price: 749, 
            discount: 15,
            image: 'https://via.placeholder.com/300x300.png?text=Ibuprofen',
            rating: 4.3
          },
          { 
            id: 's2', 
            name: 'Vitamin D3 1000IU', 
            price: 1299, 
            discount: 20,
            image: 'https://via.placeholder.com/300x300.png?text=Vitamin+D3',
            rating: 4.7
          },
          { 
            id: 's3', 
            name: 'Multivitamin Complex', 
            price: 999, 
            discount: 10,
            image: 'https://via.placeholder.com/300x300.png?text=Multivitamin',
            rating: 4.5
          },
        ],
      };

  const [activeImage, setActiveImage] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const imageRef = useRef(null);
  const [selectedUnit, setSelectedUnit] = useState(product.units[0]);
  const [quantity, setQuantity] = useState(1);

  const renderImage = ({ item }) => (
    <View style={styles.imageContainer}>
      <Image source={{ uri: item }} style={styles.image} resizeMode="cover" />
    </View>
  );

  const renderDot = (idx) => {
    const inputRange = [
      (idx - 1) * screenWidth,
      idx * screenWidth,
      (idx + 1) * screenWidth,
    ];
    
    const scale = scrollX.interpolate({
      inputRange,
      outputRange: [0.8, 1.4, 0.8],
      extrapolate: 'clamp',
    });
    
    const opacity = scrollX.interpolate({
      inputRange,
      outputRange: [0.6, 1, 0.6],
      extrapolate: 'clamp',
    });

    return (
      <Animated.View
        key={`dot-${idx}`}
        style={[
          styles.dot,
          { 
            transform: [{ scale }],
            opacity,
            backgroundColor: isDark ? '#fff' : '#000',
          }
        ]}
      />
    );
  };

  const renderUnit = (unit) => (
    <TouchableOpacity
      key={unit}
      style={[
        styles.unitBox,
        selectedUnit === unit 
          ? { 
              borderColor: '#40C057', 
              backgroundColor: isDark ? 'rgba(64, 192, 87, 0.2)' : 'rgba(64, 192, 87, 0.1)',
            } 
          : { 
              borderColor: isDark ? '#444' : '#ddd', 
              backgroundColor: isDark ? '#222' : '#f8f9fa',
            },
      ]}
      onPress={() => setSelectedUnit(unit)}
    >
      <Text style={[
        styles.unitText, 
        { color: isDark ? '#fff' : '#222' },
        selectedUnit === unit && { color: '#40C057', fontWeight: '700' }
      ]}>
        {unit}
      </Text>
    </TouchableOpacity>
  );

  const renderSimilarProduct = ({ item }) => (
    <TouchableOpacity 
      style={[styles.similarCard, { backgroundColor: isDark ? '#222' : '#fff' }]}
      onPress={() => navigation.push('ProductDetail', { productId: item.id, product: item })}
    >
      <View style={styles.similarImageContainer}>
        <Image source={{ uri: item.image }} style={styles.similarImage} />
        {item.discount > 0 && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>-{item.discount}%</Text>
          </View>
        )}
      </View>
      <View style={styles.similarContent}>
        <Text style={[styles.similarName, { color: isDark ? '#fff' : '#222' }]} numberOfLines={2}>
          {item.name}
        </Text>
        <View style={styles.ratingContainer}>
          <Icon name="star" size={12} color="#FFD166" />
          <Text style={[styles.ratingText, { color: isDark ? '#ccc' : '#666' }]}>
            {item.rating}
          </Text>
        </View>
        <View style={styles.priceContainer}>
          <Text style={[styles.similarPrice, { color: isDark ? '#fff' : '#222' }]}>
            ₹{item.price}
          </Text>
          {item.discount > 0 && (
            <Text style={styles.originalPrice}>
              ₹{Math.round(item.price * 100 / (100 - item.discount))}
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => setQuantity(prev => Math.max(1, prev - 1));

  return (
    <View style={[styles.safe, { backgroundColor: isDark ? '#0B0B0B' : '#F8F9FA' }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top, backgroundColor: isDark ? '#1A1A1A' : '#fff' }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Icon name="arrow-back" size={24} color={isDark ? '#fff' : '#000'} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: isDark ? '#fff' : '#000' }]}>Product Details</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.iconBtn} onPress={() => {}}>
            <Icon name="heart-outline" size={22} color={isDark ? '#fff' : '#000'} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.navigate('Cart')}>
            <Icon name="cart-outline" size={22} color={isDark ? '#fff' : '#000'} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        style={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Image carousel */}
        <View style={[styles.imageCarousel, { backgroundColor: isDark ? '#1A1A1A' : '#fff' }]}>
          <Animated.FlatList
            ref={imageRef}
            data={product.images}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            renderItem={renderImage}
            keyExtractor={(item, idx) => `img-${idx}`}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { x: scrollX } } }],
              { useNativeDriver: false }
            )}
            onMomentumScrollEnd={(ev) => {
              const idx = Math.round(ev.nativeEvent.contentOffset.x / screenWidth);
              setActiveImage(idx);
            }}
          />
          <View style={styles.dotsRow}>
            {product.images.map((_, i) => renderDot(i))}
          </View>
        </View>

        {/* Product details card */}
        <View style={[styles.detailsCard, { backgroundColor: isDark ? '#1A1A1A' : '#fff' }]}>
          {/* Product title and price */}
          <View style={styles.titleRow}>
            <Text style={[styles.productName, { color: isDark ? '#fff' : '#222' }]}>
              {product.name}
            </Text>
            <View style={styles.priceContainer}>
              <Text style={[styles.finalPrice, { color: isDark ? '#fff' : '#222' }]}>
                ₹{product.finalPrice}
              </Text>
              {product.discountPercent > 0 && (
                <Text style={styles.originalPrice}>
                  ₹{product.price}
                </Text>
              )}
            </View>
          </View>

          {/* Discount badge */}
          {product.discountPercent > 0 && (
            <View style={styles.discountContainer}>
              <View style={styles.discountChip}>
                <Text style={styles.discountChipText}>
                  {product.discountPercent}% OFF
                </Text>
              </View>
            </View>
          )}

          {/* Rating and reviews */}
          <View style={styles.ratingContainer}>
            <View style={styles.ratingStars}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Icon 
                  key={star} 
                  name={star <= Math.floor(product.rating) ? "star" : "star-outline"} 
                  size={16} 
                  color="#FFD166" 
                />
              ))}
            </View>
            <Text style={[styles.reviewsText, { color: isDark ? '#ccc' : '#666' }]}>
              {product.reviews.toLocaleString()} reviews
            </Text>
          </View>

          {/* Short description */}
          <Text style={[styles.shortTitle, { color: isDark ? '#ccc' : '#666' }]}>
            {product.shortTitle}
          </Text>

          {/* Benefits */}
          <View style={styles.benefitsContainer}>
            <View style={styles.benefitsHeader}>
              <Text style={[styles.sectionTitle, { color: isDark ? '#fff' : '#222' }]}>Key Benefits</Text>
              <TouchableOpacity
                style={[styles.shareIconBorder, { borderColor: isDark ? '#FF69B4' : '#000' }]}
                onPress={() => {}}
              >
                <Icon name="share-social" size={16} color={isDark ? '#FF69B4' : '#000'} />
              </TouchableOpacity>
            </View>
            {product.benefits.map((benefit, index) => (
              <View key={index} style={styles.benefitItem}>
                <View style={[styles.benefitIcon, { backgroundColor: isDark ? '#333' : '#f1f3f5' }]}>
                  <Icon name="checkmark" size={16} color="#40C057" />
                </View>
                <Text style={[styles.benefitText, { color: isDark ? '#ccc' : '#666' }]}>
                  {benefit}
                </Text>
              </View>
            ))}
          </View>

          {/* Unit selection */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: isDark ? '#fff' : '#222' }]}>
              Select Unit
            </Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.unitsContainer}
            >
              {product.units.map(renderUnit)}
            </ScrollView>
          </View>

         

          {/* Description */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: isDark ? '#fff' : '#222' }]}>
              Description
            </Text>
            <Text style={[styles.description, { color: isDark ? '#ccc' : '#666' }]}>
              {product.description}
            </Text>
          </View>

          {/* Delivery info */}
          <View style={[styles.deliveryCard, { backgroundColor: isDark ? '#222' : '#f8f9fa' }]}>
            <Icon name="time-outline" size={20} color={isDark ? '#40C057' : '#40C057'} />
            <View style={styles.deliveryInfo}>
              <Text style={[styles.deliveryTitle, { color: isDark ? '#fff' : '#222' }]}>
                Delivery in {product.deliveryTime}
              </Text>
              <Text style={[styles.deliveryText, { color: isDark ? '#ccc' : '#666' }]}>
                Order in the next 2 hours to get it by {product.deliveryTime}
              </Text>
            </View>
          </View>

          {/* GST info */}
          <View style={styles.gstContainer}>
            <Text style={[styles.gstText, { color: isDark ? '#ccc' : '#666' }]}>
              GST: {product.gst}
            </Text>
          </View>
        </View>

        {/* Similar products */}
        {product.similar.length > 0 && (
          <View style={styles.similarSection}>
            <Text style={[styles.similarTitle, { color: isDark ? '#fff' : '#222' }]}>
              Similar Products
            </Text>
            <FlatList
              data={product.similar}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item.id}
              renderItem={renderSimilarProduct}
              contentContainerStyle={styles.similarList}
            />
          </View>
        )}
      </ScrollView>

      {/* Fixed bottom action bar */}
      <View style={[styles.actionBar, { 
        backgroundColor: isDark ? '#1A1A1A' : '#fff',
        borderTopColor: isDark ? '#333' : '#eee',
        paddingBottom: insets.bottom > 0 ? insets.bottom : 16
      }]}>
        <View style={styles.actionPrice}>
          <Text style={[styles.totalText, { color: isDark ? '#ccc' : '#666' }]}>Total:</Text>
          <Text style={[styles.totalPrice, { color: isDark ? '#fff' : '#222' }]}>
            ₹{product.finalPrice * quantity}
          </Text>
        </View>
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={[styles.addToCartBtn, { backgroundColor: isDark ? '#333' : '#f1f3f5' }]}
            onPress={() => {}}
          >
            <Icon name="cart" size={18} color={isDark ? '#fff' : '#222'} />
            <Text style={[styles.addToCartText, { color: isDark ? '#fff' : '#222' }] }>
              Add to Cart
            </Text>
          </TouchableOpacity>

          {/* Circular Buy Now button (icon-only) */}
          <TouchableOpacity
            style={styles.buyNowCircle}
            onPress={() => {}}
            activeOpacity={0.85}
          >
            <Icon name="flash" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  safe: { 
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    zIndex: 10,
  },
  backBtn: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBtn: {
    padding: 8,
    marginLeft: 8,
  },
  container: {
    flex: 1,
  },
  imageCarousel: {
    width: screenWidth,
    height: screenWidth * 0.95,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    width: screenWidth,
    height: screenWidth * 0.80,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
   
  },
  image: {
    width: "100%",
    height: '100%',
    borderRadius: 30,
  },
  dotsRow: {
    position: 'absolute',
    bottom: 36,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  detailsCard: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -24,
    padding: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  productName: {
    fontSize: 20,
    fontWeight: '700',
    flex: 1,
    marginRight: 16,
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  finalPrice: {
    fontSize: 22,
    fontWeight: '800',
  },
  originalPrice: {
    fontSize: 16,
    color: '#999',
    textDecorationLine: 'line-through',
    marginTop: 2,
  },
  discountContainer: {
    marginBottom: 12,
  },
  discountChip: {
    backgroundColor: '#FA5252',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  discountChipText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 12,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingStars: {
    flexDirection: 'row',
    marginRight: 8,
  },
  reviewsText: {
    fontSize: 14,
  },
  shortTitle: {
    fontSize: 16,
    marginBottom: 16,
  },
  benefitsContainer: {
    marginBottom: 20,
  },
  benefitsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  benefitIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  benefitText: {
    fontSize: 14,
    flex: 1,
  },
  shareIconBorder: {
    width: 36,
    height: 36,
    borderRadius: 20,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  unitsContainer: {
    marginHorizontal: -4,
  },
  unitBox: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    marginRight: 10,
    borderWidth: 1,
  },
  unitText: {
    fontSize: 14,
    fontWeight: '600',
  },
  quantitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 10,
    padding: 4,
    width: 120,
  },
  quantityBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    fontSize: 16,
    fontWeight: '700',
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
  },
  deliveryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  deliveryInfo: {
    marginLeft: 12,
    flex: 1,
  },
  deliveryTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  deliveryText: {
    fontSize: 14,
  },
  gstContainer: {
    marginBottom: 20,
  },
  gstText: {
    fontSize: 14,
  },
  similarSection: {
    padding: 20,
  },
  similarTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  similarList: {
    paddingRight: 20,
  },
  similarCard: {
    width: 150,
    borderRadius: 12,
    marginRight: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  similarImageContainer: {
    position: 'relative',
  },
  similarImage: {
    width: 150,
    height: 120,
  },
  discountBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#FA5252',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  discountText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
  similarContent: {
    padding: 12,
  },
  similarName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
    height: 36,
  },
  ratingText: {
    fontSize: 12,
    marginLeft: 4,
  },
  actionBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  actionPrice: {
    flex: 1,
  },
  totalText: {
    fontSize: 14,
    marginBottom: 2,
  },
  totalPrice: {
    fontSize: 20,
    fontWeight: '800',
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 2,
  },
  addToCartBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 10,
    marginRight: 12,
  },
  addToCartText: {
    marginLeft: 6,
    fontWeight: '600',
    fontSize: 14,
  },
  buyNowCircle: {
    width: 72,
    height: 42,
    borderRadius: 26,
    backgroundColor: '#40C057',
    justifyContent: 'center',
    alignItems: 'center',
    // subtle shadow
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
  },
});

export default ProductDetail;