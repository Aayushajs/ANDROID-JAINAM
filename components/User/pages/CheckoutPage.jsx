import React, { useContext, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Dimensions,
  Modal,
  Animated,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { CartContext } from "./CartContext";
import { useColorScheme } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TextInput } from "react-native";

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const CheckoutPage = ({ navigation }) => {
  const { cart, removeFromCart } = useContext(CartContext);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const insets = useSafeAreaInsets();
  const [selectedAddress, setSelectedAddress] = useState(0);
  const [selectedPayment, setSelectedPayment] = useState(0);
  const [expandedItems, setExpandedItems] = useState({});
  const [bottomSheetVisible, setBottomSheetVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [couponModalVisible, setCouponModalVisible] = useState(false);
const [couponInput, setCouponInput] = useState("");
const [couponError, setCouponError] = useState("");
const [appliedCoupon, setAppliedCoupon] = useState("");

  const slideAnim = useState(new Animated.Value(0))[0];

  const addresses = [
    {
      id: 1,
      type: "Home",
      address: "216 St Paul's Rd, London N1 2LL, UK",
      contact: "+44-784232",
      isDefault: true
    },
    {
      id: 2,
      type: "Work",
      address: "123 Business Ave, London EC1A 1BB, UK",
      contact: "+44-784233",
      isDefault: false
    }
  ];

  const paymentMethods = [
    { id: 1, name: "Credit Card", icon: "card-outline", color: "#4F46E5", type: "card" },
    { id: 2, name: "PayPal", icon: "logo-paypal", color: "#00457C", type: "digital" },
    { id: 3, name: "Apple Pay", icon: "logo-apple", color: "#000000", type: "digital" },
    { id: 4, name: "Google Pay", icon: "logo-google", color: "#4285F4", type: "digital" },
    { id: 5, name: "Cash on Delivery", icon: "wallet-outline", color: "#10B981", type: "cod" },
  ];

  const toggleItemExpansion = (itemId) => {
    setExpandedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  const showBottomSheet = (product) => {
    setSelectedProduct(product);
    setBottomSheetVisible(true);
    Animated.timing(slideAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const validateCoupon = (code) => {
  // Example: only 'DISCOUNT10' is valid
  return code.trim().toUpperCase() === 'DISCOUNT10';
};

const handleApplyCoupon = () => {
  if (validateCoupon(couponInput)) {
    setAppliedCoupon(couponInput.trim().toUpperCase());
    setCouponError("");
    setCouponModalVisible(false);
    setCouponInput("");
  } else {
    setCouponError("Invalid coupon code. Please try again.");
  }
};

  const hideBottomSheet = () => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setBottomSheetVisible(false);
      setSelectedProduct(null);
    });
  };

  const calculateItemTotal = (item) => {
    return (item.finalPrice || item.price) * (item.quantity || 1);
  };

  const calculateItemDiscount = (item) => {
    const originalPrice = item.price || item.finalPrice * (100 / (100 - (item.discountPercent || 0)));
    return (originalPrice - (item.finalPrice || item.price)) * (item.quantity || 1);
  };

  const calculateTotal = () => {
    return cart.reduce((acc, item) => acc + calculateItemTotal(item), 0);
  };

  const calculateDiscount = () => {
    return cart.reduce((acc, item) => acc + calculateItemDiscount(item), 0);
  };

  const calculateTax = () => calculateTotal() * 0.18;
  const calculateShipping = () => cart.length > 0 ? 5.99 : 0;
  const calculateFinalTotal = () => calculateTotal() + calculateTax() + calculateShipping();

  const renderAddressItem = ({ item, index }) => (
    <TouchableOpacity
      style={[
        styles.addressItem,
        {
          backgroundColor: isDark ? '#1A1A1A' : '#fff',
          borderColor: selectedAddress === index ? '#10B981' : isDark ? '#333' : '#E5E7EB',
        }
      ]}
      onPress={() => setSelectedAddress(index)}
    >
      <View style={styles.addressHeader}>
        <View style={styles.addressTypeContainer}>
          <Text style={[
            styles.addressType,
            { color: isDark ? '#10B981' : '#10B981' }
          ]}>
            {item.type}
          </Text>
          {item.isDefault && (
            <View style={styles.defaultBadge}>
              <Text style={styles.defaultBadgeText}>Default</Text>
            </View>
          )}
        </View>
        {selectedAddress === index && (
          <View style={styles.selectedIndicator}>
            <Icon name="checkmark-circle" size={20} color="#10B981" />
          </View>
        )}
      </View>
      <Text style={[styles.addressText, { color: isDark ? '#E5E7EB' : '#4B5563' }]}>
        {item.address}
      </Text>
      <Text style={[styles.contactText, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
        Contact: {item.contact}
      </Text>
    </TouchableOpacity>
  );

  const renderCartItem = ({ item }) => (
    <TouchableOpacity 
      style={[
        styles.cartItem,
        { borderWidth: 1, borderColor: isDark ? '#fff' : '#000', backgroundColor: isDark ? '#1A1A1A' : '#fff' }
      ]}
      onPress={() => showBottomSheet(item)}
      activeOpacity={0.9}
    >
      <TouchableOpacity 
        onPress={() => navigation.navigate('ProductDetail', { product: item })}
        style={styles.imageTouchable}
      >
        <Image 
          source={{ uri: item.images?.[0] || item.image }} 
          style={styles.productImage} 
        />
      </TouchableOpacity>
      
      <View style={styles.productInfo}>
        <TouchableOpacity onPress={() => navigation.navigate('ProductDetail', { product: item })}>
          <Text style={[styles.productName, { color: isDark ? '#F9FAFB' : '#111827' }]}>
            {item.name}
          </Text>
        </TouchableOpacity>
        
        <Text style={[styles.productUnit, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
          {item.selectedUnit || item.units?.[0] || 'Standard'}
        </Text>
        
        <View style={styles.ratingContainer}>
          <Icon name="star" size={14} color="#F59E0B" />
          <Text style={[styles.ratingText, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
            {item.rating || "4.8"} • Qty: {item.quantity || 1}
          </Text>
        </View>

        <View style={styles.priceContainer}>
          <Text style={[styles.currentPrice, { color: isDark ? '#F9FAFB' : '#111827' }]}>
            ₹{calculateItemTotal(item).toFixed(2)}
          </Text>
          
          {/* Single Payment Button */}
          <TouchableOpacity
            style={[styles.couponBtn, { borderWidth: 1, borderColor: isDark ? '#fff' : '#000' }]}
  onPress={() => setCouponModalVisible(true)}
>
  <Text style={[styles.couponBtnText, { color: isDark ? '#fff' : '#000' }]}>Add Coupon</Text>
</TouchableOpacity>
        </View>

        {/* Expandable Order Total Section */}
        <TouchableOpacity 
          style={styles.expandButton}
          onPress={() => toggleItemExpansion(item.id)}
        >
          <Text style={[styles.expandButtonText, { color: isDark ? '#10B981' : '#10B981' }]}>
            {expandedItems[item.id] ? 'Hide Details' : 'Show Order Details'}
          </Text>
          <Icon 
            name={expandedItems[item.id] ? "chevron-up" : "chevron-down"} 
            size={16} 
            color={isDark ? '#10B981' : '#10B981'} 
          />
        </TouchableOpacity>

        {/* Expanded Order Details */}
        {expandedItems[item.id] && (
          <View style={[styles.orderDetailsFull, { backgroundColor: isDark ? '#252525' : '#F8F9FA' }]}>
            <View style={styles.detailRow}>
              <Text style={[styles.detailLabelLarge, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>Unit Price</Text>
              <Text style={[styles.detailValueLarge, { color: isDark ? '#F9FAFB' : '#111827' }]}>₹{item.finalPrice || item.price}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={[styles.detailLabelLarge, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>Quantity</Text>
              <Text style={[styles.detailValueLarge, { color: isDark ? '#F9FAFB' : '#111827' }]}> {item.quantity || 1}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={[styles.detailLabelLarge, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>Discount</Text>
              <Text style={[styles.discountValueLarge, { color: '#10B981' }]}>-₹{calculateItemDiscount(item).toFixed(2)}</Text>
            </View>
            <View style={[styles.finalRow, { borderTopColor: isDark ? '#333' : '#E5E7EB' }]}>
              <Text style={[styles.finalLabelLarge, { color: isDark ? '#F9FAFB' : '#111827' }]}>Item Total</Text>
              <Text style={styles.finalValueLarge}>₹{calculateItemTotal(item).toFixed(2)}</Text>
            </View>
          </View>
        )}
      </View>

      <TouchableOpacity 
        style={[styles.deleteBtn, { borderWidth: 1, borderColor: isDark ? '#fff' : '#000' }]}
        onPress={() => removeFromCart(item.id, item.selectedUnit)}
      >
        <Icon name="trash-outline" size={20} color="#EF4444" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const handleSinglePayment = (item) => {
    // Handle single item payment
    navigation.navigate('Payment', { items: [item], total: calculateItemTotal(item) });
  };

  const handleFullPayment = () => {
    // Handle full cart payment
    navigation.navigate('Payment', { items: cart, total: calculateFinalTotal() });
  };

  const bottomSheetTranslateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [400, 0],
  });

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: isDark ? '#0B0B0B' : '#F8F9FA' }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      {/* Header */}
      <View style={[
        styles.header,
        { borderBottomColor: isDark ? '#fff' : '#1A1A1A',
            borderBottomWidth: 0.2,
          backgroundColor: isDark ? '#1A1A1A' : '#fff',
          paddingTop: insets.top + 10
        }
      ]}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={24} color={isDark ? '#F9FAFB' : '#111827'} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: isDark ? '#F9FAFB' : '#111827' }]}>
          Your Cart <Text style={{ fontWeight: 'bold', color: isDark ? '#10B981' : '#111827' }}>{cart.length}</Text>
        </Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView 
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Delivery Address Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: isDark ? '#F9FAFB' : '#111827' }]}>
              Delivery Address
            </Text>
            <TouchableOpacity style={styles.addButton}>
              <Icon name="add" size={20} color={isDark ? '#10B981' : '#10B981'} />
              <Text style={[styles.addButtonText, { color: isDark ? '#10B981' : '#10B981' }]}>
                Add New
              </Text>
            </TouchableOpacity>
          </View>
          
          <FlatList
            data={addresses}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderAddressItem}
            contentContainerStyle={styles.addressesList}
          />
        </View>

        {/* Order Summary Section */}
        <View style={styles.section }>
          <Text style={[styles.sectionTitle, { color: isDark ? '#F9FAFB' : '#111827' }]}>
            Order Summary ({cart.length} items)
          </Text>
          
          {cart.length === 0 ? (
            <View style={styles.emptyCart}>
              <Icon name="cart-outline" size={64} color={isDark ? '#4B5563' : '#9CA3AF'} />
              <Text style={[styles.emptyText, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
                Your cart is empty
              </Text>
              <TouchableOpacity 
                style={styles.continueShoppingBtn}
                onPress={() => navigation.navigate('Home')}
              >
                <Text style={styles.continueShoppingText}>Continue Shopping</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <FlatList
              data={cart}
              scrollEnabled={false}
              keyExtractor={(item) => item.id + "-" + (item.selectedUnit || 'default')}
              renderItem={renderCartItem}
            />
          )}
        </View>

        {/* Full Cart Total Section */}
        {cart.length > 0 && (
          <View style={[styles.fullTotalSection, {borderWidth: 1, borderColor: isDark ? '#fff' : '#000', backgroundColor: isDark ? '#1A1A1A' : '#fff' }]}>
            <Text style={[styles.fullTotalTitle, { color: isDark ? '#F9FAFB' : '#111827' }]}>
              Cart Total
            </Text>
            
            <View style={styles.totalRow}>
              <Text style={[styles.totalLabel, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
                Items Total
              </Text>
              <Text style={[styles.totalValue, { color: isDark ? '#F9FAFB' : '#111827' }]}>
                ₹{calculateTotal().toFixed(2)}
              </Text>
            </View>
            
            <View style={styles.totalRow}>
              <Text style={[styles.totalLabel, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
                Total Discount
              </Text>
              <Text style={[styles.discountValue, { color: '#10B981' }]}>
                -₹{calculateDiscount().toFixed(2)}
              </Text>
            </View>
            
            <View style={styles.totalRow}>
              <Text style={[styles.totalLabel, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
                Shipping
              </Text>
              <Text style={[styles.totalValue, { color: isDark ? '#F9FAFB' : '#111827' }]}>
                ₹{calculateShipping().toFixed(2)}
              </Text>
            </View>
            
            <View style={styles.totalRow}>
              <Text style={[styles.totalLabel, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
                Tax (18%)
              </Text>
              <Text style={[styles.totalValue, { color: isDark ? '#F9FAFB' : '#111827' }]}>
                ₹{calculateTax().toFixed(2)}
              </Text>
            </View>
            
            <View style={[styles.finalTotalRow, { borderTopColor: isDark ? '#333' : '#E5E7EB' }]}>
              <Text style={[styles.finalTotalLabel, { color: isDark ? '#F9FAFB' : '#111827' }]}>
                Final Amount
              </Text>
              <Text style={styles.finalTotalValue}>
                ₹{calculateFinalTotal().toFixed(2)}
              </Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Bottom Sheet Modal */}
      <Modal
        visible={bottomSheetVisible}
        transparent={true}
        animationType="none"
        onRequestClose={hideBottomSheet}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={hideBottomSheet}
        >
          <Animated.View 
            style={[
              styles.bottomSheet,
              { 
                backgroundColor: isDark ? '#1A1A1A' : '#fff',
                transform: [{ translateY: bottomSheetTranslateY }]
              }
            ]}
          >
            <View style={styles.bottomSheetHeader}>
              <View style={styles.handle} />
              <Text style={[styles.bottomSheetTitle, { color: isDark ? '#F9FAFB' : '#111827' }]}>
                Order Details
              </Text>
            </View>
            
            {selectedProduct && (
              <View style={styles.bottomSheetContent}>
                <Text style={[styles.productTitle, { color: isDark ? '#F9FAFB' : '#111827' }]}>
                  {selectedProduct.name}
                </Text>
                <Text style={[styles.productSubtitle, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
                  {selectedProduct.selectedUnit}
                </Text>
                
                <View style={styles.bottomSheetTotal}>
                  <Text style={[styles.totalLabel, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
                    Total Amount:
                  </Text>
                  <Text style={styles.bottomSheetTotalValue}>
                    ₹{calculateItemTotal(selectedProduct).toFixed(2)}
                  </Text>
                </View>
                
                <TouchableOpacity 
                  style={styles.bottomSheetButton}
                  onPress={() => {
                    hideBottomSheet();
                    handleSinglePayment(selectedProduct);
                  }}
                >
                  <Text style={styles.bottomSheetButtonText}>Proceed to Payment</Text>
                </TouchableOpacity>
              </View>
            )}
          </Animated.View>
        </TouchableOpacity>
      </Modal>
      <Modal
  visible={couponModalVisible}
  transparent={true}
  animationType="fade"
  onRequestClose={() => setCouponModalVisible(false)}
>
  <View style={styles.couponModalOverlay}>
    <View style={[styles.couponModal, { backgroundColor: isDark ? '#1A1A1A' : '#fff' }]}>
      <Text style={[styles.couponModalTitle, { color: isDark ? '#F9FAFB' : '#111827' }]}>ADD COUPON</Text>
      <View style={styles.couponInputContainer}>
        <TextInput
          style={[styles.couponInput, { color: isDark ? '#F9FAFB' : '#111827', borderColor: isDark ? '#fff' : '#000' }]}
          placeholder="Enter coupon code"
          placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
          value={couponInput}
          onChangeText={setCouponInput}
          autoCapitalize="characters"
        />
      </View>
      {couponError ? (
        <Text style={styles.couponError}>{couponError}</Text>
      ) : null}
      <View style={styles.couponModalButtons}>
        <TouchableOpacity
          style={styles.couponSaveBtn}
          onPress={handleApplyCoupon}
        >
          <Text style={[styles.couponSaveBtnText, { color: isDark ? '#fff' : '#1A1A1A' }]}>Save</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.couponCancelBtn}
          onPress={() => {
            setCouponModalVisible(false);
            setCouponError("");
            setCouponInput("");
          }}
        >
          <Text style={[styles.couponCancelBtnText, { color: isDark ? '#fff' : '#1A1A1A' }]}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
</Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    couponBtn: {
  borderWidth: 0.7,
  borderColor: '#10B981',
  backgroundColor: 'transparent',
  paddingHorizontal: 12,
  paddingVertical: 8,
  borderRadius: 8,
  marginLeft: 20,
},
couponBtnText: {
  color: '#10B981',
  fontSize: 13,
  fontWeight: '700',
},
couponModalOverlay: {
  flex: 1,
  backgroundColor: 'rgba(0,0,0,0.4)',
  justifyContent: 'center',
  alignItems: 'center',
},
couponModal: {
  width: '90%',
  borderRadius: 16,
  padding: 24,
  alignItems: 'center',
  elevation: 8,
},
couponModalTitle: {
  fontSize: 20,
  fontWeight: '700',
  marginBottom: 16,
},
couponInputContainer: {
  width: '100%',
  marginBottom: 12,
},
couponInput: {
  borderWidth: 1,
  borderColor: '#10B981',
  borderRadius: 8,
  padding: 12,
  fontSize: 16,
  width: '100%',
  backgroundColor: 'transparent',
},
couponError: {
  color: '#EF4444',
  fontSize: 14,
  marginBottom: 8,
  textAlign: 'center',
},
couponModalButtons: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  width: '100%',
  marginTop: 8,
  gap: 12,
},
couponSaveBtn: {
  flex: 1,
  backgroundColor: 'transparent',
  borderWidth: 1,
  borderColor: '#10B981',
  paddingVertical: 12,
  borderRadius: 8,
  alignItems: 'center',
},
couponSaveBtnText: {
  color: '#fff',
  fontSize: 16,
  fontWeight: '700',
},
couponCancelBtn: {
  flex: 1,
  backgroundColor: 'transparent',
  borderWidth: 1,
  borderColor: '#10B981',
  paddingVertical: 12,
  borderRadius: 8,
  alignItems: 'center',
},
couponCancelBtnText: {
  color: '#f1eaeaff',
  fontSize: 16,
  fontWeight: '700',
},
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
   
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  headerRight: {
    width: 32,
  },
  section: {
    marginBottom: 24,
    marginTop: 10,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 10,
    marginLeft: 4,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  addressesList: {
    paddingRight: 20,
  },
  addressItem: {
    width: 280,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1.5,
    marginRight: 12,
   
  },
  addressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  addressTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addressType: {
    fontSize: 14,
    fontWeight: '700',
    marginRight: 8,
  },
  defaultBadge: {
    backgroundColor: '#10B981',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  defaultBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
  },
  addressText: {
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 4,
    lineHeight: 18,
  },
  contactText: {
    fontSize: 12,
  },
  emptyCart: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    marginTop: 16,
    marginBottom: 24,
  },
  continueShoppingBtn: {
    backgroundColor: '#10B981',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  continueShoppingText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  cartItem: {
    borderRadius: 16,
   
    marginBottom: 12,
    padding: 16,
    flexDirection: 'row',
  },
  imageTouchable: {
    marginRight: 12,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  productUnit: {
    fontSize: 13,
    marginBottom: 6,
    color: '#6B7280',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingText: {
    fontSize: 12,
    marginLeft: 4,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  currentPrice: {
    fontSize: 18,
    fontWeight: '700',
  },
  payNowBtn: {
    backgroundColor: '#10B981',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  payNowText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  expandButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    marginBottom: 8,
  },
  expandButtonText: {
    fontSize: 12,
    fontWeight: '600',
    marginRight: 4,
  },
  orderDetailsFull: {
    borderRadius: 8,
    padding: 12,
    marginRight: 50,
    marginTop: 8,
    marginBottom: -15,
    width: '210%',
    alignSelf: 'center',
  },
  detailLabelLarge: {
    fontSize: 16,
    fontWeight: '600',
  },
  detailValueLarge: {
    fontSize: 16,
    fontWeight: '600',
  },
  discountValueLarge: {
    fontSize: 16,
    fontWeight: '700',
    color: '#10B981',
  },
  finalLabelLarge: {
    fontSize: 18,
    fontWeight: '700',
  },
  finalValueLarge: {
    fontSize: 18,
    fontWeight: '800',
    color: '#10B981',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  detailLabel: {
    fontSize: 12,
  },
  detailValue: {
    fontSize: 12,
    fontWeight: '500',
  },
  discountValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#10B981',
  },
  finalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    marginTop: 4,
  },
  finalLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  finalValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#10B981',
  },
  deleteBtn: {
    padding: 8,
    marginLeft: 8,
    borderWidth: 1,
borderRadius: 15,
    alignSelf: 'flex-start',
  },
  fullTotalSection: {
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 16,
    marginBottom: 40,
  },
  fullTotalTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  totalLabel: {
    fontSize: 14,
  },
  totalValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  finalTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    marginTop: 8,
  },
  finalTotalLabel: {
    fontSize: 16,
    fontWeight: '700',
  },
  finalTotalValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#10B981',
  },
  checkoutFooter: {
    paddingHorizontal: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  footerButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  secondaryButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  primaryButton: {
    flex: 2,
    backgroundColor: '#10B981',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    elevation: 4,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    marginRight: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  bottomSheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 40,
    maxHeight: screenHeight * 0.4,
  },
  bottomSheetHeader: {
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: '#D1D5DB',
    borderRadius: 2,
    marginBottom: 12,
  },
  bottomSheetTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  bottomSheetContent: {
    padding: 20,
  },
  productTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  productSubtitle: {
    fontSize: 14,
    marginBottom: 16,
  },
  bottomSheetTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  bottomSheetTotalValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#10B981',
  },
  bottomSheetButton: {
    backgroundColor: '#10B981',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  bottomSheetButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default CheckoutPage;