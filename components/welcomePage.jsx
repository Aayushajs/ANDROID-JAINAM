import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Dimensions, Animated, Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; // Import FontAwesome icons

// Get the screen width using Dimensions
const { width: screenWidth } = Dimensions.get('window');

// Data for the carousel cards
const carouselData = [
  {
    id: 1,
    title: 'Effortless Control with Syncra',
    description: '"Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit..."',
    icon: 'home', // Icon name for FontAwesome
  },
  {
    id: 2,
    nestedCards: [
      {
        id: 2.1,
        description: 'This is the first nested card.',
        icon: 'home',
      },
      {
        id: 2.2,
        description: 'This is the second nested card.',
        icon: 'user',
      },
      {
        id: 2.3,
        description: 'This is the third nested card.',
        icon: 'home',
      },
      {
        id: 2.4,
        description: 'This is the fourth nested card.',
        icon: 'user',
      },
    ],
  },
  {
    id: 3,
    description: '"Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...""There is no one who loves pain itself, who seeks after it and wants to have it, simply because it is pain...""Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit..." " .',
  },
];

// WelcomePage Component
const WelcomePage = ({ navigation }) => {
  // Reference for the FlatList to control scrolling
  const flatListRef = useRef(null);

  // State to track the current active index of the carousel
  const [currentIndex, setCurrentIndex] = useState(0);

  // Animation values for the teacher and student buttons
  const teacherButtonPosition = useRef(new Animated.Value(200)).current; // Starts from the right
  const studentButtonPosition = useRef(new Animated.Value(-200)).current; // Starts from the left

  // Animate buttons when the component mounts
  useEffect(() => {
    // Animate the teacher button to its original position
    Animated.timing(teacherButtonPosition, {
      toValue: 0, // Move to the original position
      duration: 800, // Animation duration
      useNativeDriver: true, // Use native driver for better performance
    }).start();

    // Animate the student button to its original position
    Animated.timing(studentButtonPosition, {
      toValue: 0, // Move to the original position
      duration: 800, // Animation duration
      useNativeDriver: true, // Use native driver for better performance
    }).start();
  }, []);

  // Append the first item to the end of the array to create an infinite loop
  const infiniteCarouselData = [...carouselData, carouselData[0]];

  // Automatically scroll the FlatList every 3.5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      // Calculate the next index
      const nextIndex = (currentIndex + 1) % infiniteCarouselData.length;
      setCurrentIndex(nextIndex);

      // Scroll to the next index
      flatListRef.current?.scrollToIndex({ animated: true, index: nextIndex });

      // If it's the last item, reset to the first item without animation
      if (nextIndex === infiniteCarouselData.length - 1) {
        setTimeout(() => {
          flatListRef.current?.scrollToIndex({ animated: false, index: 0 });
          setCurrentIndex(0);
        }, 300); // Delay to match the scroll animation duration
      }
    }, 3500); // Scroll interval (3.5 seconds)

    // Cleanup the interval on component unmount
    return () => clearInterval(interval);
  }, [currentIndex]);

  // Render each carousel item with custom styles
  const renderCarouselItem = ({ item }) => {
    let cardStyle, titleStyle, descriptionStyle;

    // Apply different styles based on the card ID
    switch (item.id) {
      case 1:
        cardStyle = { height: 300, backgroundColor: 'transparent', alignItems: 'center' };
        titleStyle = { fontSize: 46, fontWeight: 'bold', color: '#e0e0e0', marginTop: "auto" };
        descriptionStyle = { fontSize: 16, color: '#e0e0e0', marginTop: "auto" };
        break;
      case 2:
        cardStyle = { height: 300, backgroundColor: 'transparent' };
        titleStyle = { fontSize: 22, fontWeight: '600', color: '#FFF' };
        descriptionStyle = { fontSize: 14, color: '#FFF' };
        break;
      case 3:
        cardStyle = { height: 300, backgroundColor: 'transparent' };
        descriptionStyle = {
          fontSize: 18,
          color: '#FFF',
          marginBottom: "5",
          marginTop: "-27%",
          textAlign: 'center',
          letterSpacing: 1,
        };
        break;
      default:
        cardStyle = {};
        titleStyle = {};
        descriptionStyle = {};
    }

    return (
      <View style={[styles.carouselCard, cardStyle]}>
        {/* Icon with Text for Card 1 */}
        {item.id === 1 && (
          <View style={styles.iconTextContainer}>
            <Icon name={item.icon} style={styles.icon} size={16} color="#FFF" />
            <Text style={styles.iconText}>AI Voice Command</Text>
          </View>
        )}
        {/* Title */}
        <Text style={[styles.carouselTitle, titleStyle]}>{item.title}</Text>
        {/* Description */}
        <Text style={[styles.carouselDescription, descriptionStyle]}>{item.description}</Text>
        {/* Nested Cards for Card 2 */}
        {item.id === 2 && (
          <View style={styles.nestedCardsContainer}>
            {item.nestedCards.map((nestedCard) => (
              <View key={nestedCard.id} style={styles.nestedCard}>
                <Icon name={nestedCard.icon} size={23} color="white" />
                <Text style={styles.nestedCardDescription}>{nestedCard.description}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Logo Image */}
      <Image
        source={{ uri: 'https://dev.screenapp.io/articles/content/images/size/w1000/2023/08/ScreenApp-7.png' }}
        style={styles.logoImage}
      />

      {/* Background Image */}
      <Image
        source={{ uri: 'https://www.pixelstalk.net/wp-content/uploads/image12/Abstract-dark-smoke-patterns-twisting-and-intertwining-against-a-black-background-illuminated-by-faint-purple-and-teal-highlights.jpg' }}
        style={styles.topImage}
        resizeMode="cover"
      />

      {/* Carousel */}
      <FlatList
        data={infiniteCarouselData}
        ref={flatListRef}
        renderItem={renderCarouselItem}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        horizontal={true}
        pagingEnabled={true}
        showsHorizontalScrollIndicator={false}
        style={styles.carouselContainer}
        contentContainerStyle={styles.carouselContentContainer}
        onMomentumScrollEnd={(event) => {
          const contentOffsetX = event.nativeEvent.contentOffset.x;
          const newIndex = Math.round(contentOffsetX / screenWidth);

          // Handle the last item (reset to the first item)
          if (newIndex === infiniteCarouselData.length - 1) {
            flatListRef.current?.scrollToIndex({ animated: false, index: 0 });
            setCurrentIndex(0);
          } else {
            setCurrentIndex(newIndex);
          }
        }}
      />

      {/* Pagination Dots */}
      <View style={styles.pagination}>
        {carouselData.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              currentIndex === index && styles.activeDot,
            ]}
          />
        ))}
      </View>

      {/* Buttons */}
      <View style={styles.container}>
        <View style={styles.content}>

          {/* Student Button - Animated from Left */}
          <TouchableOpacity style={styles.content} onPress={() => navigation.navigate("Start")}>
            <Animated.View
              style={[
                styles.button,
                { transform: [{ translateX: studentButtonPosition }] },
              ]}
            >
              <Text style={styles.buttonText}>STUDENT</Text>
            </Animated.View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

// Styles for the component
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#0e0e0e',
    padding: 0,
    position: 'relative',
    height: "90%",
    zIndex: 0,
  },
  topImage: {
    position: 'absolute',
    top: 230,
    left: '-50',
    width: '130%',
    height: 150,
    zIndex: 0,
    transform: [{ rotate: '-30deg' }],
  },
  logoImage: {
    position: 'absolute',
    top: 65,
    left: '23%',
    borderWidth: 1,
    borderColor: 'rgb(11, 11, 11)',
    borderRadius: 50,
    width: "55%",
    height: 40,
    zIndex: 1,
  },
  carouselContainer: {
    flexGrow: 0,
    marginTop: 200,
  },
  carouselContentContainer: {
    alignItems: 'center',
  },
  carouselCard: {
    width: screenWidth * 0.9,
    backgroundColor: '#fff',
    padding: 20,
    alignItems: 'center',
    marginHorizontal: screenWidth * 0.05,
    textAlign: 'center',
  },
  iconTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    borderRadius: 50,
    width: "58%",
    height: 30,
    backgroundColor: 'transparent',
    borderColor: 'rgba(255, 252, 252, 0.5)',
    borderWidth: 1,
    textAlign: 'center',
    justifyContent: 'center',
  },
  iconText: {
    marginLeft: 5,
    fontSize: 13,
    color: 'rgb(255, 255, 255)',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 15,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 5,
    backgroundColor: '#888',
    marginHorizontal: 5,
    marginRight: 15,
  },
  activeDot: {
    backgroundColor: '#fff',
    width: 7,
    height: 7,
  },
  carouselTitle: {
    fontSize: 46,
    fontWeight: 'bold',
    color: '#e0e0e0',
    marginTop: "auto",
    textAlign: 'center',
  },
  carouselDescription: {
    fontSize: 16,
    color: '#e0e0e0',
    textAlign: 'center',
  },
  nestedCardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: screenWidth * 0.9,
    marginTop: "auto",
    backgroundColor: 'transparent',
  },
  nestedCard: {
    width: '48%',
    backgroundColor: 'transparent',
    borderColor: 'rgba(255, 252, 252, 0.5)',
    borderWidth: 1,
    height: 110,
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nestedCardDescription: {
    fontSize: 12,
    color: 'white',
    marginTop: 10,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  button: {
    backgroundColor: 'transparent',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#1ABC9C',
    marginBottom: 15,
    width: '86%',
    height: 48,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: -5,
  },
});

export default WelcomePage;