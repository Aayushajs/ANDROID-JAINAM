import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView, 
  Dimensions,
  StatusBar,
  SafeAreaView,
  Modal,
  TextInput
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const PaymentScreen = ({ navigation }) => {
  const colorScheme = useColorScheme();
  const [isDarkTheme, setIsDarkTheme] = useState(colorScheme === 'dark');
  const insets = useSafeAreaInsets();
  const [selectedPayment, setSelectedPayment] = useState(0);
  const [cardModalVisible, setCardModalVisible] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: ''
  });

  const theme = {
    colors: {
      primary: isDarkTheme ? '#BB86FC' : '#E53935',
      primaryLight: isDarkTheme ? '#3700B3' : '#FFCDD2',
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

  const orderSummary = {
    subtotal: 7000,
    shipping: 30,
    tax: 1260,
    discount: 500,
    total: 7790
  };

  const paymentMethods = [
    {
      id: 1,
      type: 'VISA',
      lastFour: '2109',
      name: 'Primary Card',
      icon: 'card-outline',
      color: '#1A1F71'
    },
    {
      id: 2,
      type: 'PayPal',
      email: 'user@example.com',
      icon: 'logo-paypal',
      color: '#003087'
    },
    {
      id: 3,
      type: 'MasterCard',
      lastFour: '7845',
      name: 'Secondary Card',
      icon: 'card-outline',
      color: '#EB001B'
    },
    {
      id: 4,
      type: 'Google Pay',
      icon: 'logo-google',
      color: '#4285F4'
    },
    {
      id: 5,
      type: 'Apple Pay',
      icon: 'logo-apple',
      color: '#000000'
    },
    {
      id: 6,
      type: 'Cash on Delivery',
      icon: 'cash-outline',
      color: '#4CAF50'
    }
  ];

  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme);
  };

  const handleAddCard = () => {
    setCardModalVisible(true);
  };

  const handlePayment = () => {
    // Handle payment logic here
    console.log('Processing payment with method:', paymentMethods[selectedPayment]);
    // navigation.navigate('OrderConfirmation');
  };

  const formatCardNumber = (number) => {
    return number.replace(/\d{4}(?=.)/g, '$& ');
  };

  return (
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
          Payment
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
        </View>
      </View>

      <ScrollView 
        style={[styles.container, { backgroundColor: theme.colors.background }]}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Order Summary Card */}
        <View style={[styles.summaryCard, { backgroundColor: theme.colors.card }]}>
          <Text style={[styles.summaryTitle, { color: theme.colors.text }]}>
            Order Summary
          </Text>
          
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: theme.colors.textSecondary }]}>
              Subtotal
            </Text>
            <Text style={[styles.summaryValue, { color: theme.colors.text }]}>
              ₹{orderSummary.subtotal.toLocaleString()}
            </Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: theme.colors.textSecondary }]}>
              Discount
            </Text>
            <Text style={[styles.discountValue, { color: theme.colors.success }]}>
              -₹{orderSummary.discount.toLocaleString()}
            </Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: theme.colors.textSecondary }]}>
              Tax (18%)
            </Text>
            <Text style={[styles.summaryValue, { color: theme.colors.text }]}>
              ₹{orderSummary.tax.toLocaleString()}
            </Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: theme.colors.textSecondary }]}>
              Shipping
            </Text>
            <Text style={[styles.summaryValue, { color: theme.colors.text }]}>
              ₹{orderSummary.shipping.toLocaleString()}
            </Text>
          </View>

          <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
          
          <View style={styles.totalRow}>
            <Text style={[styles.totalLabel, { color: theme.colors.text }]}>
              Total Amount
            </Text>
            <Text style={[styles.totalValue, { color: theme.colors.primary }]}>
              ₹{orderSummary.total.toLocaleString()}
            </Text>
          </View>

          <View style={[styles.deliveryInfo, { backgroundColor: isDarkTheme ? '#1B3D2A' : '#E8F5E8' }]}>
            <Ionicons name="time-outline" size={16} color={theme.colors.success} />
            <Text style={[styles.deliveryText, { color: theme.colors.success }]}>
              Estimated delivery: 2-3 business days
            </Text>
          </View>
        </View>

        {/* Payment Methods */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Payment Methods</Text>
          <View style={styles.paymentMethodsGrid}>
            {paymentMethods.map((method, index) => (
              <TouchableOpacity
                key={method.id}
                style={[
                  styles.paymentCard,
                  {
                    borderColor: selectedPayment === index ? theme.colors.primary : theme.colors.border,
                    backgroundColor: selectedPayment === index ? (theme.dark ? '#23234b' : '#FFF5F5') : theme.colors.card,
                    shadowOpacity: selectedPayment === index ? 0.18 : 0.08,
                  },
                ]}
                activeOpacity={0.85}
                onPress={() => setSelectedPayment(index)}
              >
                <View style={[styles.paymentCardIcon, { backgroundColor: method.color }]}> 
                  <Ionicons name={method.icon} size={32} color="#fff" />
                </View>
                <Text style={[styles.paymentCardType, { color: theme.colors.text }]}>{method.type}</Text>
                <Text style={[styles.paymentCardInfo, { color: theme.colors.textSecondary }]}> 
                  {method.lastFour ? `**** ${method.lastFour}` : method.email || method.name}
                </Text>
                {selectedPayment === index && (
                  <View style={styles.paymentCardCheck}>
                    <Ionicons name="checkmark-circle" size={28} color={theme.colors.primary} />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
          {/* Add New Card Button */}
          <TouchableOpacity
            style={[styles.addCardButtonModern, { borderColor: theme.colors.primary }]}
            onPress={handleAddCard}
          >
            <Ionicons name="add-circle-outline" size={24} color={theme.colors.primary} />
            <Text style={[styles.addCardText, { color: theme.colors.primary }]}>Add New Card</Text>
          </TouchableOpacity>
        </View>

        {/* Security Features */}
        <View style={styles.securitySection}>
          <View style={styles.securityRow}>
            <Ionicons name="shield-checkmark" size={20} color={theme.colors.success} />
            <Text style={[styles.securityText, { color: theme.colors.textSecondary }]}>
              256-bit SSL Secure Payment
            </Text>
          </View>
          <View style={styles.securityRow}>
            <Ionicons name="lock-closed" size={20} color={theme.colors.success} />
            <Text style={[styles.securityText, { color: theme.colors.textSecondary }]}>
              Your payment details are encrypted
            </Text>
          </View>
          <View style={styles.securityRow}>
            <Ionicons name="card-outline" size={20} color={theme.colors.success} />
            <Text style={[styles.securityText, { color: theme.colors.textSecondary }]}>
              We don't store your card details
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Fixed Bottom Button */}
      <View style={[styles.bottomContainer, { 
        backgroundColor: theme.colors.card,
        borderTopColor: theme.colors.border,
        paddingBottom: insets.bottom + 10,
      }]}>
        <View style={styles.bottomPrice}>
          <Text style={[styles.bottomPriceLabel, { color: theme.colors.textSecondary }]}>
            Total to Pay
          </Text>
          <Text style={[styles.bottomPriceValue, { color: theme.colors.text }]}>
            ₹{orderSummary.total.toLocaleString()}
          </Text>
        </View>
        <TouchableOpacity 
          style={[styles.payButton, { backgroundColor: theme.colors.primary }]}
          onPress={handlePayment}
        >
          <Text style={styles.payButtonText}>
            Pay Now
          </Text>
          <Ionicons name="lock-closed" size={16} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Add Card Modal */}
      <Modal
        visible={cardModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setCardModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.colors.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.colors.text }]}>
                Add New Card
              </Text>
              <TouchableOpacity 
                onPress={() => setCardModalVisible(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color={theme.colors.text} />
              </TouchableOpacity>
            </View>

            <View style={styles.cardForm}>
              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: theme.colors.text }]}>
                  Card Number
                </Text>
                <TextInput
                  style={[
                    styles.textInput,
                    {
                      color: theme.colors.text,
                      borderColor: theme.colors.border,
                      backgroundColor: theme.colors.background
                    }
                  ]}
                  placeholder="1234 5678 9012 3456"
                  placeholderTextColor={theme.colors.textSecondary}
                  value={cardDetails.number}
                  onChangeText={(text) => setCardDetails({...cardDetails, number: text})}
                  keyboardType="numeric"
                  maxLength={19}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: theme.colors.text }]}>
                  Cardholder Name
                </Text>
                <TextInput
                  style={[
                    styles.textInput,
                    {
                      color: theme.colors.text,
                      borderColor: theme.colors.border,
                      backgroundColor: theme.colors.background
                    }
                  ]}
                  placeholder="John Doe"
                  placeholderTextColor={theme.colors.textSecondary}
                  value={cardDetails.name}
                  onChangeText={(text) => setCardDetails({...cardDetails, name: text})}
                />
              </View>

              <View style={styles.rowInputs}>
                <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                  <Text style={[styles.inputLabel, { color: theme.colors.text }]}>
                    Expiry Date
                  </Text>
                  <TextInput
                    style={[
                      styles.textInput,
                      {
                        color: theme.colors.text,
                        borderColor: theme.colors.border,
                        backgroundColor: theme.colors.background
                      }
                    ]}
                    placeholder="MM/YY"
                    placeholderTextColor={theme.colors.textSecondary}
                    value={cardDetails.expiry}
                    onChangeText={(text) => setCardDetails({...cardDetails, expiry: text})}
                    maxLength={5}
                  />
                </View>

                <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
                  <Text style={[styles.inputLabel, { color: theme.colors.text }]}>
                    CVV
                  </Text>
                  <TextInput
                    style={[
                      styles.textInput,
                      {
                        color: theme.colors.text,
                        borderColor: theme.colors.border,
                        backgroundColor: theme.colors.background
                      }
                    ]}
                    placeholder="123"
                    placeholderTextColor={theme.colors.textSecondary}
                    value={cardDetails.cvv}
                    onChangeText={(text) => setCardDetails({...cardDetails, cvv: text})}
                    keyboardType="numeric"
                    maxLength={3}
                    secureTextEntry
                  />
                </View>
              </View>

              <TouchableOpacity 
                style={[styles.saveCardButton, { backgroundColor: theme.colors.primary }]}
                onPress={() => {
                  // Handle save card logic
                  setCardModalVisible(false);
                }}
              >
                <Text style={styles.saveCardButtonText}>
                  Save Card
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  paymentMethodsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  paymentCard: {
    width: '48%',
    borderWidth: 2,
    borderRadius: 16,
    paddingVertical: 22,
    paddingHorizontal: 12,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
    position: 'relative',
  },
  paymentCardIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  paymentCardType: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 2,
  },
  paymentCardInfo: {
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 2,
  },
  paymentCardCheck: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'transparent',
  },
  addCardButtonModern: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 2,
    borderStyle: 'dashed',
    marginTop: 8,
    marginBottom: 4,
    backgroundColor: 'transparent',
  },
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
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
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 22,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryCard: {
    margin: 16,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
    lineHeight: 22,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
    lineHeight: 18,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 18,
  },
  discountValue: {
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 18,
  },
  divider: {
    height: 1,
    marginVertical: 12,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 20,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 22,
  },
  deliveryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  deliveryText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 8,
    lineHeight: 14,
  },
  section: {
    marginHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
    lineHeight: 22,
  },
  paymentOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  paymentLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  paymentIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  paymentDetails: {
    flex: 1,
  },
  paymentType: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
    lineHeight: 20,
  },
  paymentInfo: {
    fontSize: 14,
    lineHeight: 18,
  },
  selectedIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addCardButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: 'dashed',
    marginTop: 8,
  },
  addCardText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
    lineHeight: 20,
  },
  securitySection: {
    marginHorizontal: 16,
    marginBottom: 100,
  },
  securityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  securityText: {
    fontSize: 12,
    marginLeft: 8,
    lineHeight: 14,
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
    lineHeight: 14,
  },
  bottomPriceValue: {
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 22,
  },
  payButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 8,
    marginLeft: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  payButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    marginRight: 8,
    lineHeight: 20,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 30,
    maxHeight: screenHeight * 0.8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 24,
  },
  closeButton: {
    padding: 4,
  },
  cardForm: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    lineHeight: 18,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  rowInputs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  saveCardButton: {
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  saveCardButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 20,
  },
});

export default PaymentScreen;