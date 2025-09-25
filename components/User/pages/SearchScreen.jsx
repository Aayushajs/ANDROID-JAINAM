import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, FlatList, Platform, Image, Dimensions, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColorScheme } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const SearchScreen = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

  const getResponsiveSize = (size) => {
    const baseWidth = 375; // design base
    return Math.round((screenWidth / baseWidth) * size);
  };
  const [query, setQuery] = useState(route?.params?.query || '');
  const [recent, setRecent] = useState([]);
  const [trending, setTrending] = useState([]);
  const [similarProducts, setSimilarProducts] = useState([]);

  // Calculate trending card width to fit two columns with a small gap
  const trendingGap = getResponsiveSize(12);
  const sectionHorizontalPadding = 16 * 2; // styles.section uses padding:16
  const trendingCardWidth = Math.round((screenWidth - sectionHorizontalPadding - trendingGap) / 2);

  useEffect(() => {
    // Load data (placeholder for now)
    setRecent([
      { id: '1', name: 'aspirin', image: 'https://content.jdmagicbox.com/comp/def_content/pharmaceutical-manufacturers/shutterstock-1061962874-pharmaceutical-manufacturers-7-xzfxi.jpg' },
      { id: '2', name: 'vitamin c', image: 'https://img.freepik.com/premium-photo/top-trending-pills-photos-medical-health-campaigns_1285004-121.jpg' },
      { id: '3', name: 'baby lotion', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQBFuWThkL9RkHzSxpkdWHH9a-rkZOImwrkDA&s' },
      { id: '4', name: 'pain relief', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS5W8G7aSuiOdySoGpVMh-BDtLEv2wYbD-lYg&s' },
    ]);
    
    setTrending([
      { id: '1', name: 'immune booster', count: '1.2M', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTdHjOXTYs_dxh9CN3v7t8DSPobjD_XQ5rHTQ&s' },
      { id: '2', name: 'sleep aid', count: '980K', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTigq1nS6yGP4LyN4fN0mumpltPZ1VLaGmq3g&s' },
      { id: '3', name: 'protein powder', count: '850K', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRInZKFQQSXmwl4wzHSKkzOn7M31UJ4cLNssKPMtvYT7TdsFfSiGCglGL60SWB51CR9-E0&usqp=CAU' },
      { id: '4', name: 'allergy relief', count: '720K', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTmMXdVG7dn3sMcV7fNytfKkgdiX0P1yyuW8B7FZd_RvD5rq__iiehuTvE4U1RI9xIhhJY&usqp=CAU' },
       { id: '2', name: 'sleep aid', count: '980K', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTigq1nS6yGP4LyN4fN0mumpltPZ1VLaGmq3g&s' },
      { id: '3', name: 'protein powder', count: '850K', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRInZKFQQSXmwl4wzHSKkzOn7M31UJ4cLNssKPMtvYT7TdsFfSiGCglGL60SWB51CR9-E0&usqp=CAU' },
    ]);
    
    setSimilarProducts([
      { id: '1', name: 'Paracetamol', description: 'Pain reliever and fever reducer', price: '5.99k', image: 'https://nextgeninvent.com/wp-content/uploads/2024/09/AI-in-Drug-Development.png' },
      { id: '2', name: 'Ibuprofen', description: 'Anti-inflammatory medication', price: '7.49k', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQf-s5E6GHToNMIFnNfBgTjo-IS9oieoboB38XhGDin9ncS7rUhXSBrmzWsZ6es1n2gsYk&usqp=CAU' },
      { id: '3', name: 'Vitamin D3', description: 'Supports bone and immune health', price: '12.99k', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTBFDLaGMaxkaxVa-tn9bxJEi0PWSGqNWFgT5trIN9x-i7hqJLFFG8VxmwFyqMXMh1wj5I&usqp=CAU' },
    ]);
  }, [query]); // This would actually depend on your search logic

  const onSearch = (text) => {
    setQuery(text);
    // In a real app, you would trigger search suggestions here
  };

  const onSubmit = () => {
    if (!query) return;
    // Save to recent (in-memory for now)
    const newItem = { id: Date.now().toString(), name: query, image: `https://placehold.co/100x100/7950F2/white?text=${query.charAt(0).toUpperCase()}` };
    setRecent(prev => [newItem, ...prev.filter(x => x.name !== query)].slice(0, 4));
    // You might want to navigate to a results screen or perform search here
  };

  const clearRecent = () => {
    setRecent([]);
  };

  const renderRecent = ({ item }) => (
    <TouchableOpacity
      style={[styles.recentItem, { backgroundColor: isDark ? '#131313' : '#fff' }]}
      onPress={() => { setQuery(item.name); onSubmit(); }}
      activeOpacity={0.8}
    >
      <ImageWithFallback uri={item.image} size={getResponsiveSize(90)} />
      <Text style={[styles.recentText, { color: isDark ? '#fff' : '#222', fontSize: getResponsiveSize(12) }]} numberOfLines={1}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  const renderTrending = ({ item, index }) => (
    <TouchableOpacity
      style={[styles.trendingCard, { backgroundColor: isDark ? '#111' : '#fff', width: trendingCardWidth }]}
      onPress={() => { setQuery(item.name); onSubmit(); }}
      activeOpacity={0.9}
    >
      {/* image will be square and fill the card width; asymmetric corner radii applied */}
      <ImageWithFallback
        uri={item.image}
        size={trendingCardWidth}
        label={item.name}
        noMargin
        borderRadiusStyle={{ borderTopLeftRadius: 28, borderBottomRightRadius: 35 }}
      />
      <View style={{ marginTop: 8 }}>
        <Text style={[styles.trendingText, { color: isDark ? '#fff' : '#222', fontSize: getResponsiveSize(14) }]} numberOfLines={2}>
          {item.name}
        </Text>
        <Text style={[styles.trendingCount, { color: isDark ? '#999' : '#666', fontSize: getResponsiveSize(12) }]}>
          {item.count} searches
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderSimilarProduct = ({ item }) => (
    <TouchableOpacity
      style={[styles.productItem, { backgroundColor: isDark ? '#0F0F0F' : '#fff' }]}
      onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}
      activeOpacity={0.85}
    >
  <ImageWithFallback uri={item.image} size={getResponsiveSize(60)} rounded={getResponsiveSize(10)} />
      <View style={styles.productInfo}>
        <Text style={[styles.productName, { color: isDark ? '#fff' : '#222', fontSize: getResponsiveSize(14) }]}>
          {item.name}
        </Text>
        <Text style={[styles.productDesc, { color: isDark ? '#ccc' : '#666', fontSize: getResponsiveSize(12) }]} numberOfLines={1}>
          {item.description}
        </Text>
      </View>
      <Text style={[styles.productPrice, { color: isDark ? '#fff' : '#222', fontSize: getResponsiveSize(14) }]}>
        {item.price}
      </Text>
    </TouchableOpacity>
  );

  function ImageWithFallback({ uri, size = 56, label = '', rounded = null, noMargin = false, borderRadiusStyle = null }) {
    const [error, setError] = React.useState(false);
    const defaultRadius = rounded != null ? rounded : Math.round(size / 2);
    const marginStyle = noMargin ? {} : { marginBottom: 8, marginRight: 8 };
    // If caller provides per-corner radii, use that; otherwise use default uniform radius
    const radiusStyle = borderRadiusStyle ? borderRadiusStyle : { borderRadius: defaultRadius };
    if (!uri || error) {
      const initial = label ? label.charAt(0).toUpperCase() : '?';
      return (
        <View style={[{ width: size, height: size, backgroundColor: isDark ? '#222' : '#EFEFEF', justifyContent: 'center', alignItems: 'center' }, radiusStyle, marginStyle]}>
          <Text style={{ color: isDark ? '#fff' : '#666', fontWeight: '700' }}>{initial}</Text>
        </View>
      );
    }

    return (
      <Image
        source={{ uri }}
        style={[{ width: size, height: size }, radiusStyle, marginStyle]}
        resizeMode="cover"
        onError={() => setError(true)}
      />
    );
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={[styles.container, { paddingTop: insets.top, backgroundColor: isDark ? '#0B0B0B' : '#F8F9FA' }]}> 
          {/* Search Header - fixed */}
          <View style={[styles.header, { backgroundColor: isDark ? '#0F0F0F' : '#fff' }]}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton} accessibilityLabel="Back">
              <Icon name="arrow-back" size={22} color={isDark ? '#fff' : '#000'} />
            </TouchableOpacity>
            <View style={[styles.searchBar, { backgroundColor: isDark ? '#141414' : '#f7f8fa' }]}>
              <Icon name="search-outline" size={20} color={isDark ? '#888' : '#777'} />
              <TextInput
                value={query}
                onChangeText={onSearch}
                placeholder="Search medicines, vitamins..."
                placeholderTextColor={isDark ? '#999' : '#999'}
                style={[styles.input, { color: isDark ? '#fff' : '#111' }]}
                onSubmitEditing={onSubmit}
                autoFocus
                returnKeyType="search"
              />
              {query.length > 0 ? (
                <TouchableOpacity onPress={() => setQuery('')} accessibilityLabel="Clear search">
                  <Icon name="close-circle" size={20} color={isDark ? '#bbb' : '#777'} />
                </TouchableOpacity>
              ) : null}
            </View>
          </View>

          {/* Scrollable content below header */}
          <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: insets.bottom }} keyboardShouldPersistTaps="handled">
            {!query ? (
              <>
                {/* Recent Searches */}
                <View style={styles.section}>
                  <View style={styles.sectionHeader}>
                    <Text style={[styles.sectionTitle, { color: isDark ? '#fff' : '#222' }]}>
                      Recent Searches
                    </Text>
                    {recent.length > 0 && (
                      <TouchableOpacity onPress={clearRecent}>
                        <Text style={{ color: '#7950F2', fontSize: 14 }}>Clear all</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                  {recent.length > 0 ? (
                    <FlatList
                      data={recent}
                      keyExtractor={(item) => item.id}
                      renderItem={renderRecent}
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      initialNumToRender={4}
                      windowSize={2}
                      removeClippedSubviews={true}
                      getItemLayout={(data, index) => ({ length: getResponsiveSize(96), offset: getResponsiveSize(96) * index, index })}
                      contentContainerStyle={styles.recentList}
                    />
                  ) : (
                    <Text style={[styles.placeholderText, { color: isDark ? '#999' : '#666' }] }>
                      No recent searches
                    </Text>
                  )}
                </View>

                {/* Trending Searches */}
                <View style={styles.section}>
                  <View style={styles.sectionHeader}>
                    <Text style={[styles.sectionTitle, { color: isDark ? '#fff' : '#222' }]}>
                      Trending Now
                    </Text>
                  </View>
                  <FlatList
                    data={trending}
                    keyExtractor={(item) => item.id}
                    renderItem={renderTrending}
                    numColumns={2}
                    // provide a key that changes when `query` toggles so FlatList is remounted
                    // (prevents the "Changing numColumns on the fly is not supported" error)
                    key={`trending-${query ? 'search' : 'grid2'}`}
                    columnWrapperStyle={{ justifyContent: 'space-between' }}
                    initialNumToRender={6}
                    windowSize={5}
                    removeClippedSubviews={true}
                    showsVerticalScrollIndicator={false}
                    scrollEnabled={false}
                  />
                </View>
              </>
            ) : (
              /* Similar Products when searching */
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: isDark ? '#fff' : '#222' }]}>
                  Similar Products
                </Text>
                <FlatList
                  data={similarProducts}
                  keyExtractor={(item) => item.id}
                  renderItem={renderSimilarProduct}
                  ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
                  initialNumToRender={6}
                  windowSize={5}
                  removeClippedSubviews={true}
                  showsVerticalScrollIndicator={false}
                  scrollEnabled={false}
                />
              </View>
            )}
          </ScrollView>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  backButton: {
    marginRight: 12,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'android' ? 8 : 10,
    borderRadius: 12,
  },
  input: { 
    flex: 1, 
    marginLeft: 8, 
    marginRight: 8,
    fontSize: 16,
    padding: 0,
  },
  section: {
    padding: 16,
    
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: { 
    fontWeight: '700', 
    fontSize: 18,
    marginBottom: 25,
    marginLeft: 4,
  },
  recentList: {
    paddingRight: 16,
  },
  recentItem: {
    alignItems: 'center',
    marginRight: 16,
    borderRadius: 50,
    width: 90,
    height: 90,
  },
  recentImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 8,
  },
  recentText: {
    fontSize: 12,
    textAlign: 'center',
  },
  trendingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
  },
  trendingCard: {
    borderRadius: 12,
    overflow: 'hidden',
    padding: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    marginBottom: 6,
  },
 
 
  trendingContent: {
    flex: 1,
  },
  trendingText: {
    fontWeight: '600',
    marginBottom: 2,
  },
  trendingCount: {
    fontSize: 12,
  },
  productItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  productImage: {
    width: 50,
    height: 50,
    borderRadius: 10,
    marginRight: 12,
  },
  productInfo: {
    flex: 1,
    marginRight: 12,
  },
  productName: {
    fontWeight: '600',
    marginBottom: 4,
  },
  productDesc: {
    fontSize: 12,
  },
  productPrice: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  placeholderText: {
    textAlign: 'center',
    marginVertical: 20,
    fontStyle: 'italic',
  },
});

export default SearchScreen;