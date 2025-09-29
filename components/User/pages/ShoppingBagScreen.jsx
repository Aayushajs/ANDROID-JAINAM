import React, { useState, useContext } from 'react';
import { 
  View, 
  Text, 
  Image, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView, 
  Dimensions,
  StatusBar,
  SafeAreaView,
  Modal,
  Animated,
  TextInput
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

// Create Theme Context
const ThemeContext = React.createContext();

const ShoppingBagScreen = ({ navigation }) => {
  const colorScheme = useColorScheme();
  const [isDarkTheme, setIsDarkTheme] = useState(colorScheme === 'dark');
  const insets = useSafeAreaInsets();
  const [couponModalVisible, setCouponModalVisible] = useState(false);
  const [couponInput, setCouponInput] = useState("");
  const [couponError, setCouponError] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState("");
  const [expandedItems, setExpandedItems] = useState({});
  const [bottomSheetVisible, setBottomSheetVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const slideAnim = useState(new Animated.Value(0))[0];

  const [items, setItems] = useState([
    {
      id: 1,
      title: "Women's Casual Wear",
      subtitle: "Checked Single-Breasted Blazer",
      size: "42",
      quantity: 1,
      price: 7000,
      originalPrice: 8999,
      discount: 22,
      deliveryDate: "10 May 2024",
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSO5HFQfsPoCT56oObQL67X8S1_NTULshPkALp-Xfyl8sUUuctyobm3M2bhDX2TYda00aQ&usqp=CAU',
      inStock: true,
      rating: 4.8,
      units: ["Standard", "Large"],
      selectedUnit: "Standard"
    },
    {
      id: 2,
      title: "Men's Formal Shirt",
      subtitle: "Slim Fit Cotton Shirt",
      size: "L",
      quantity: 2,
      price: 2499,
      originalPrice: 2999,
      discount: 17,
      deliveryDate: "12 May 2024",
      image: '',
      inStock: true,
      rating: 4.5,
      units: ["Medium", "Large"],
      selectedUnit: "Large"
    }
  ]);

  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme);
  };

  const theme = {
    colors: {
      primary: isDarkTheme ? '#BB86FC' : '#E53935',
      background: isDarkTheme ? '#0B0B0B' : '#F8F9FA',
      card: isDarkTheme ? '#1A1A1A' : '#FFFFFF',
      text: isDarkTheme ? '#F9FAFB' : '#111827',
      textSecondary: isDarkTheme ? '#9CA3AF' : '#6B7280',
      border: isDarkTheme ? '#333333' : '#E5E7EB',
      success: isDarkTheme ? '#4CAF50' : '#4CAF50',
      warning: isDarkTheme ? '#FF9800' : '#FF9800',
      error: isDarkTheme ? '#CF6679' : '#EF4444',
    },
    dark: isDarkTheme
  };

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    setItems(items.map(item => 
      item.id === id ? { ...item, quantity: newQuantity } : item
    ));
  };

  const removeItem = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  const toggleItemExpansion = (itemId) => {
    setExpandedItems((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
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

  const validateCoupon = (code) => {
    return code.trim().toUpperCase() === "DISCOUNT10";
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

  // Calculations
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discount = items.reduce((sum, item) => sum + ((item.originalPrice - item.price) * item.quantity), 0);
  const deliveryFee = subtotal > 1999 ? 0 : 99;
  const tax = subtotal * 0.18;
  const finalTotal = subtotal + deliveryFee + tax;

  const calculateItemTotal = (item) => {
    return item.price * item.quantity;
  };

  const calculateItemDiscount = (item) => {
    return (item.originalPrice - item.price) * item.quantity;
  };

  const bottomSheetTranslateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [400, 0],
  });

  return (
    <ThemeContext.Provider value={theme}>
      <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.background }]}>
        <StatusBar barStyle={isDarkTheme ? 'light-content' : 'dark-content'} />
        
        {/* Header */}
        <View style={[
          styles.header, 
          { 
            backgroundColor: theme.colors.card,
            borderBottomColor: theme.colors.border,
            paddingTop: insets.top + 10,
          }
        ]}>
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons 
              name="arrow-back" 
              size={24} 
              color={theme.colors.text} 
            />
          </TouchableOpacity>
          
          <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
            Shopping Bag
            <Text style={[styles.itemCount, { color: theme.colors.primary }]}>
              {" "}({items.length})
            </Text>
          </Text>
          
          <View style={styles.headerRight}>
            {/* <TouchableOpacity 
              style={styles.headerButton}
              onPress={toggleTheme}
            >
              <Ionicons 
                name={isDarkTheme ? "sunny" : "moon"} 
                size={20} 
                color={theme.colors.text} 
              />
            </TouchableOpacity> */}
            <TouchableOpacity style={styles.headerButton}>
              <Ionicons 
                name="heart-outline" 
                size={24} 
                color={theme.colors.text} 
              />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView 
          style={[styles.container, { backgroundColor: theme.colors.background }]}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Product Items */}
          {items.map((item) => (
            <ProductCard 
              key={item.id}
              item={item}
              theme={theme}
              updateQuantity={updateQuantity}
              removeItem={removeItem}
              toggleExpansion={toggleItemExpansion}
              expanded={expandedItems[item.id]}
              showBottomSheet={showBottomSheet}
            />
          ))}

          {/* Empty State */}
          {items.length === 0 && (
            <View style={styles.emptyContainer}>
              <Ionicons name="bag-outline" size={80} color={theme.colors.textSecondary} />
              <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>
                Your bag is empty
              </Text>
              <Text style={[styles.emptySubtitle, { color: theme.colors.textSecondary }]}>
                Add some items to get started
              </Text>
              <TouchableOpacity 
                style={[styles.continueShopping, { backgroundColor: theme.colors.primary }]}
                onPress={() => navigation.navigate('Home')}
              >
                <Text style={styles.continueShoppingText}>Continue Shopping</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Coupon Section */}
          {items.length > 0 && (
            <TouchableOpacity 
              style={[styles.couponSection, { backgroundColor: theme.colors.card }]}
              onPress={() => setCouponModalVisible(true)}
            >
              <View style={styles.couponLeft}>
                <Ionicons 
                  name="pricetag" 
                  size={20} 
                  color={theme.colors.primary} 
                />
                <View style={styles.couponTextContainer}>
                  <Text style={[styles.couponTitle, { color: theme.colors.text }]}>
                    Apply Coupons
                  </Text>
                  <Text style={[styles.couponSubtitle, { color: theme.colors.textSecondary }]}>
                    {appliedCoupon ? `Applied: ${appliedCoupon}` : 'Save more on your order'}
                  </Text>
                </View>
              </View>
              <View style={[styles.couponRight, { backgroundColor: theme.colors.primary }]}>
                <Text style={styles.couponApplyText}>
                  {appliedCoupon ? 'APPLIED' : 'APPLY'}
                </Text>
              </View>
            </TouchableOpacity>
          )}

          {/* Order Summary */}
          {items.length > 0 && (
            <View style={[styles.orderSummary, { backgroundColor: theme.colors.card }]}>
              <Text style={[styles.summaryTitle, { color: theme.colors.text }]}>
                Order Summary
              </Text>
              
              <View style={styles.summaryRow}>
                <Text style={[styles.summaryLabel, { color: theme.colors.textSecondary }]}>
                  Subtotal ({items.reduce((sum, item) => sum + item.quantity, 0)} items)
                </Text>
                <Text style={[styles.summaryValue, { color: theme.colors.text }]}>
                  ₹{subtotal.toLocaleString()}
                </Text>
              </View>
              
              <View style={styles.summaryRow}>
                <Text style={[styles.summaryLabel, { color: theme.colors.textSecondary }]}>
                  Discount
                </Text>
                <Text style={[styles.discountValue, { color: theme.colors.success }]}>
                  -₹{discount.toLocaleString()}
                </Text>
              </View>

              <View style={styles.summaryRow}>
                <Text style={[styles.summaryLabel, { color: theme.colors.textSecondary }]}>
                  Tax (18%)
                </Text>
                <Text style={[styles.summaryValue, { color: theme.colors.text }]}>
                  ₹{tax.toLocaleString()}
                </Text>
              </View>
              
              <View style={styles.summaryRow}>
                <Text style={[styles.summaryLabel, { color: theme.colors.textSecondary }]}>
                  Delivery Fee
                </Text>
                <Text style={[styles.summaryValue, { 
                  color: deliveryFee === 0 ? theme.colors.success : theme.colors.text 
                }]}>
                  {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                </Text>
              </View>

              {deliveryFee > 0 && (
                <View style={[styles.freeDeliveryBanner, { backgroundColor: isDarkTheme ? '#2A1B3D' : '#F3E5F5' }]}>
                  <Ionicons name="rocket" size={16} color={theme.colors.primary} />
                  <Text style={[styles.freeDeliveryText, { color: theme.colors.primary }]}>
                    Add ₹{(1999 - subtotal).toLocaleString()} more for FREE delivery
                  </Text>
                </View>
              )}
              
              <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
              
              <View style={styles.totalRow}>
                <Text style={[styles.totalLabel, { color: theme.colors.text }]}>
                  Total Amount
                </Text>
                <Text style={[styles.totalValue, { color: theme.colors.primary }]}>
                  ₹{finalTotal.toLocaleString()}
                </Text>
              </View>

              <View style={[styles.savingsBanner, { backgroundColor: isDarkTheme ? '#1B3D2A' : '#E8F5E8' }]}>
                <Ionicons name="checkmark-circle" size={16} color={theme.colors.success} />
                <Text style={[styles.savingsText, { color: theme.colors.success }]}>
                  You save ₹{discount.toLocaleString()} on this order
                </Text>
              </View>
            </View>
          )}

          {/* Security Features */}
          {items.length > 0 && (
            <View style={styles.securitySection}>
              <View style={styles.securityRow}>
                <Ionicons name="shield-checkmark" size={20} color={theme.colors.success} />
                <Text style={[styles.securityText, { color: theme.colors.textSecondary }]}>
                  Safe and Secure Payments
                </Text>
              </View>
              <View style={styles.securityRow}>
                <Ionicons name="lock-closed" size={20} color={theme.colors.success} />
                <Text style={[styles.securityText, { color: theme.colors.textSecondary }]}>
                  100% Payment Protection
                </Text>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Fixed Bottom Button */}
        {items.length > 0 && (
          <View style={[styles.bottomContainer, { 
            backgroundColor: theme.colors.card,
            borderTopColor: theme.colors.border,
            paddingBottom: insets.bottom + 10,
          }]}>
            <View style={styles.bottomPrice}>
              <Text style={[styles.bottomPriceLabel, { color: theme.colors.textSecondary }]}>
                Total
              </Text>
              <Text style={[styles.bottomPriceValue, { color: theme.colors.text }]}>
                ₹{finalTotal.toLocaleString()}
              </Text>
            </View>
            <TouchableOpacity 
              style={[styles.proceedButton, { backgroundColor: theme.colors.primary }]}
              onPress={() => navigation.navigate("PaymentScreen")}
            >
              <Text style={styles.proceedButtonText}>Proceed to Payment</Text>
              <Ionicons name="arrow-forward" size={10} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        )}

        {/* Coupon Modal */}
        <Modal
          visible={couponModalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setCouponModalVisible(false)}
        >
          <View style={styles.couponModalOverlay}>
            <View
              style={[
                styles.couponModal,
                { backgroundColor: theme.colors.card }
              ]}
            >
              <Text
                style={[
                  styles.couponModalTitle,
                  { color: theme.colors.text }
                ]}
              >
                ADD COUPON
              </Text>
              <View style={styles.couponInputContainer}>
                <TextInput
                  style={[
                    styles.couponInput,
                    {
                      color: theme.colors.text,
                      borderColor: theme.colors.primary,
                      backgroundColor: theme.colors.background
                    }
                  ]}
                  placeholder="Enter coupon code"
                  placeholderTextColor={theme.colors.textSecondary}
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
                  style={[
                    styles.couponCancelBtn,
                    { borderColor: theme.colors.primary }
                  ]}
                  onPress={() => {
                    setCouponModalVisible(false);
                    setCouponError("");
                    setCouponInput("");
                  }}
                >
                  <Text style={[styles.couponCancelBtnText, { color: theme.colors.primary }]}>
                    Cancel
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.couponSaveBtn, { backgroundColor: theme.colors.primary }]}
                  onPress={handleApplyCoupon}
                >
                  <Text style={styles.couponSaveBtnText}>
                    Apply
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

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
                  backgroundColor: theme.colors.card,
                  transform: [{ translateY: bottomSheetTranslateY }],
                },
              ]}
            >
              <View style={styles.bottomSheetHeader}>
                <View style={[styles.handle, { backgroundColor: theme.colors.textSecondary }]} />
                <Text
                  style={[
                    styles.bottomSheetTitle,
                    { color: theme.colors.text },
                  ]}
                >
                  Quick Actions
                </Text>
              </View>

              {selectedProduct && (
                <View style={styles.bottomSheetContent}>
                  <Text
                    style={[
                      styles.productTitle,
                      { color: theme.colors.text },
                    ]}
                  >
                    {selectedProduct.title}
                  </Text>
                  <Text
                    style={[
                      styles.productSubtitle,
                      { color: theme.colors.textSecondary },
                    ]}
                  >
                    {selectedProduct.subtitle}
                  </Text>

                  <View style={styles.bottomSheetTotal}>
                    <Text
                      style={[
                        styles.totalLabel,
                        { color: theme.colors.textSecondary },
                      ]}
                    >
                      Total Amount:
                    </Text>
                    <Text style={[styles.bottomSheetTotalValue, { color: theme.colors.primary }]}>
                      ₹{calculateItemTotal(selectedProduct).toLocaleString()}
                    </Text>
                  </View>

                  <TouchableOpacity
                    style={[styles.bottomSheetButton, { backgroundColor: theme.colors.primary }]}
                    onPress={() => {
                      hideBottomSheet();
                      navigation.navigate("PaymentScreen", { items: [selectedProduct] });
                    }}
                  >
                    <Text style={styles.bottomSheetButtonText}>
                      Buy This Item
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </Animated.View>
          </TouchableOpacity>
        </Modal>
      </SafeAreaView>
    </ThemeContext.Provider>
  );
};

const ProductCard = ({ item, theme, updateQuantity, removeItem, toggleExpansion, expanded, showBottomSheet }) => (
  <View style={[styles.productCard, { backgroundColor: theme.colors.card }]}>
    <TouchableOpacity onPress={() => showBottomSheet(item)}>
      <Image source={{ uri: item.image }} style={styles.productImage} />
    </TouchableOpacity>
    
    <View style={styles.productDetails}>
      <View style={styles.productHeader}>
        <TouchableOpacity onPress={() => showBottomSheet(item)} style={{ flex: 1 }}>
          <Text style={[styles.productTitle, { color: theme.colors.text }]} numberOfLines={1}>
            {item.title}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => removeItem(item.id)}>
          <Ionicons name="close" size={20} color={theme.colors.textSecondary} />
        </TouchableOpacity>
      </View>
      
      <Text style={[styles.productSubTitle, { color: theme.colors.textSecondary }]} numberOfLines={1}>
        {item.subtitle}
      </Text>
      
      <View style={styles.productMeta}>
        <Text style={[styles.productMetaText, { color: theme.colors.textSecondary }]}>
          Size: {item.size} • {item.selectedUnit}
        </Text>
        <View style={[styles.stockStatus, { 
          backgroundColor: item.inStock ? (theme.dark ? '#1B3D2A' : '#E8F5E8') : (theme.dark ? '#3D1B1B' : '#FFEBEE') 
        }]}>
          <Text style={[styles.stockStatusText, { 
            color: item.inStock ? theme.colors.success : theme.colors.error 
          }]}>
            {item.inStock ? 'In Stock' : 'Out of Stock'}
          </Text>
        </View>
      </View>

      <View style={styles.ratingContainer}>
        <Ionicons name="star" size={14} color="#F59E0B" />
        <Text style={[styles.ratingText, { color: theme.colors.textSecondary }]}>
          {item.rating} • Delivery by {item.deliveryDate}
        </Text>
      </View>

      <View style={styles.priceContainer}>
        <View style={styles.priceRow}>
          <Text style={[styles.currentPrice, { color: theme.colors.text }]}>
            ₹{(item.price * item.quantity).toLocaleString()}
          </Text>
          {item.originalPrice > item.price && (
            <Text style={[styles.originalPrice, { color: theme.colors.textSecondary }]}>
              ₹{(item.originalPrice * item.quantity).toLocaleString()}
            </Text>
          )}
        </View>
        {item.discount > 0 && (
          <View style={[styles.discountBadge, { backgroundColor: theme.dark ? '#3D1B1B' : '#FFEBEE' }]}>
            <Text style={[styles.discountText, { color: theme.colors.primary }]}>
              {item.discount}% OFF
            </Text>
          </View>
        )}
      </View>

      {/* Expandable Section
      <TouchableOpacity
        style={styles.expandButton}
        onPress={() => toggleExpansion(item.id)}
      >
        <Text style={[styles.expandButtonText, { color: theme.colors.primary }]}>
          {expanded ? "Hide Details" : "Show Order Details"}
        </Text>
        <Ionicons
          name={expanded ? "chevron-up" : "chevron-down"}
          size={16}
          color={theme.colors.primary}
        />
      </TouchableOpacity> */}

      {expanded && (
        <View style={[styles.orderDetailsFull, { backgroundColor: theme.colors.background }]}>
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabelLarge, { color: theme.colors.textSecondary }]}>
              Unit Price
            </Text>
            <Text style={[styles.detailValueLarge, { color: theme.colors.text }]}>
              ₹{item.price}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabelLarge, { color: theme.colors.textSecondary }]}>
              Quantity
            </Text>
            <Text style={[styles.detailValueLarge, { color: theme.colors.text }]}>
              {item.quantity}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabelLarge, { color: theme.colors.textSecondary }]}>
              Discount
            </Text>
            <Text style={[styles.discountValueLarge, { color: theme.colors.success }]}>
              -₹{calculateItemDiscount(item).toLocaleString()}
            </Text>
          </View>
          <View style={[styles.finalRow, { borderTopColor: theme.colors.border }]}>
            <Text style={[styles.finalLabelLarge, { color: theme.colors.text }]}>
              Item Total
            </Text>
            <Text style={[styles.finalValueLarge, { color: theme.colors.primary }]}>
              ₹{calculateItemTotal(item).toLocaleString()}
            </Text>
          </View>
        </View>
      )}

      <View style={styles.quantityContainer}>
        <Text style={[styles.quantityLabel, { color: theme.colors.textSecondary }]}>
          Quantity:
        </Text>
        <View style={styles.quantityControls}>
          <TouchableOpacity 
            style={[styles.quantityButton, { borderColor: theme.colors.border }]}
            onPress={() => updateQuantity(item.id, item.quantity - 1)}
          >
            <Ionicons name="remove" size={16} color={theme.colors.text} />
          </TouchableOpacity>
          <Text style={[styles.quantityValue, { color: theme.colors.text }]}>
            {item.quantity}
          </Text>
          <TouchableOpacity 
            style={[styles.quantityButton, { borderColor: theme.colors.border }]}
            onPress={() => updateQuantity(item.id, item.quantity + 1)}
          >
            <Ionicons name="add" size={16} color={theme.colors.text} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </View>
);

const styles = StyleSheet.create({
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  headerButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemCount: {
    fontWeight: '700',
  },
  productCard: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  productImage: {
    width: screenWidth * 0.22,
    height: screenWidth * 0.28,
    borderRadius: 12,
  },
  productDetails: {
    flex: 1,
    marginLeft: 12,
  },
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  productTitle: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    marginRight: 8,
  },
  productSubTitle: {
    fontSize: 14,
    marginBottom: 6,
  },
  productMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  productMetaText: {
    fontSize: 12,
  },
  stockStatus: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  stockStatusText: {
    fontSize: 10,
    fontWeight: '600',
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
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currentPrice: {
    fontSize: 16,
    fontWeight: '700',
    marginRight: 8,
  },
  originalPrice: {
    fontSize: 14,
    textDecorationLine: 'line-through',
  },
  discountBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  discountText: {
    fontSize: 10,
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
    marginBottom: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  detailLabelLarge: {
    fontSize: 14,
    fontWeight: '500',
  },
  detailValueLarge: {
    fontSize: 14,
    fontWeight: '600',
  },
  discountValueLarge: {
    fontSize: 14,
    fontWeight: '700',
  },
  finalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    marginTop: 4,
  },
  finalLabelLarge: {
    fontSize: 15,
    fontWeight: '700',
  },
  finalValueLarge: {
    fontSize: 15,
    fontWeight: '800',
  },
  quantityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quantityLabel: {
    fontSize: 14,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityValue: {
    fontSize: 14,
    fontWeight: '600',
    marginHorizontal: 12,
    minWidth: 20,
    textAlign: 'center',
  },
  couponSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  couponLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  couponTextContainer: {
    marginLeft: 12,
  },
  couponTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  couponSubtitle: {
    fontSize: 12,
  },
  couponRight: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  couponApplyText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  orderSummary: {
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  discountValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  freeDeliveryBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 6,
    marginBottom: 12,
  },
  freeDeliveryText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  divider: {
    height: 1,
    marginVertical: 8,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '700',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  savingsBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 6,
    marginTop: 8,
  },
  savingsText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  securitySection: {
    marginBottom: 100,
    paddingHorizontal: 16,
  },
  securityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  securityText: {
    fontSize: 12,
    marginLeft: 8,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  bottomPrice: {
    flex: 1,
  },
  bottomPriceLabel: {
    fontSize: 12,
    marginBottom: 2,
  },
  bottomPriceValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  proceedButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 8,
    marginLeft: 16,
  },
  proceedButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginRight: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    marginBottom: 24,
  },
  continueShopping: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  continueShoppingText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  // Modal Styles
  couponModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  couponModal: {
    width: '85%',
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
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    width: '100%',
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
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  couponSaveBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  couponCancelBtn: {
    flex: 1,
    backgroundColor: 'transparent',
    borderWidth: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  couponCancelBtnText: {
    fontSize: 16,
    fontWeight: '700',
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
  bottomSheetTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  bottomSheetTotalValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  bottomSheetButton: {
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

export default ShoppingBagScreen;