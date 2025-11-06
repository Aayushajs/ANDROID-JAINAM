import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Animated,
  Easing,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");
const getSize = (size) => (width / 375) * size;

const COLORS = {
  // primary: "#6a11cb",
  // secondary: "#2575fc",
  white: "#FFFFFF",
  black: "#1F2937",
  gray: "#949699ff",
  darkBg: "#2020203d",
  darkCard: "#2f2f2fb1",
};

const PrivacyTermsPage = ({ isDark }) => {
  const [expanded, setExpanded] = useState(true);
  const animatedHeight = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(1)).current;

  const toggleCard = () => {
    Animated.timing(animatedHeight, {
      toValue: expanded ? 0 : 1,
      duration: 500,
      easing: Easing.out(Easing.ease),
      useNativeDriver: false,
    }).start();

    Animated.timing(rotateAnim, {
      toValue: expanded ? 0 : 1,
      duration: 400,
      useNativeDriver: true,
    }).start();

    setExpanded(!expanded);
  };

  const cardHeight = animatedHeight.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 500],
  });

  const rotateArrow = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isDark ? COLORS.darkBg : COLORS.white },
      ]}
    >
      {/* Header */}
      <View style={[styles.header , {backgroundColor: isDark ? COLORS.darkCard : COLORS.primary}]}>
        <Text style={styles.headerTitle}>Privacy & Terms</Text>
        {/* Arrow Button */}
        <TouchableOpacity activeOpacity={0.8} onPress={toggleCard}>
          <Animated.View
            style={[
              styles.arrowContainer,
              { transform: [{ rotate: rotateArrow }] },
            ]}
          >
            <MaterialCommunityIcons
              name="chevron-down"
              size={32}
              color={COLORS.white}
            />
          </Animated.View>
        </TouchableOpacity>
      </View>
      {/* Animated Card (content under header) */}
      <Animated.View
        style={[
          styles.card,
          {
            backgroundColor: isDark ? COLORS.darkCard : COLORS.white,
            height: cardHeight,
            marginTop: expanded ? 15 : 0,
            opacity: animatedHeight,
          },
        ]}
      >
        {expanded && (
          <ScrollView
            style={styles.scroll}
            showsVerticalScrollIndicator={false}
          >
            <Text
              style={[
                styles.title,
                { color: isDark ? COLORS.white : COLORS.black },
              ]}
            >
              Privacy Policy
            </Text>
            <Text
              style={[
                styles.paragraph,
                { color: isDark ? COLORS.gray : "#282b2fff" },
              ]}
            >
              Your privacy is extremely important to us. We ensure your personal
              information remains secure and is only used to improve your
              experience. We do not share or sell your data to third parties.
              All stored data is protected with strong encryption standards.
            </Text>

            <Text
              style={[
                styles.title,
                { color: isDark ? COLORS.white : COLORS.black },
              ]}
            >
              Terms of Service
            </Text>
            <Text
              style={[
                styles.paragraph,
                { color: isDark ? COLORS.gray : "#374151" },
              ]}
            >
              By using our app, you agree to follow all the listed terms and
              policies. Unauthorized access, misuse, or data tampering is
              strictly prohibited. We reserve the right to modify these terms
              periodically to enhance user safety and experience.
            </Text>

            <Text
              style={[
                styles.title,
                { color: isDark ? COLORS.white : COLORS.black },
              ]}
            >
              Data Protection
            </Text>
            <Text
              style={[
                styles.paragraph,
                { color: isDark ? COLORS.gray : "#374151" },
              ]}
            >
              Our systems use advanced encryption and cloud security frameworks
              to protect user data. We continuously monitor and update our
              systems to ensure full compliance with modern privacy standards.
            </Text>

            <View style={{ height: 20 }} />
          </ScrollView>
        )}
      </Animated.View>
    </View>
  );
};

export default PrivacyTermsPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
    alignItems: "center",
  },
  header: {
    width: "92%",
    height: 60,
    paddingVertical: 7,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    paddingHorizontal: 19,
  },
  headerTitle: {
    fontSize: getSize(17),
    fontWeight: "900",
    color: COLORS.white,
    letterSpacing: 0.8,
  },
  arrowContainer: {
    backgroundColor: "rgba(255,255,255,0.2)",
    padding: 2,
    borderRadius: 50,
  },
  card: {
    width: "95%",
    borderRadius: 18,
    overflow: "hidden",
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
    marginBottom: 20,
  },
  scroll: {
    paddingHorizontal: 20,
    paddingTop: 15,
  },
  title: {
    fontSize: getSize(17),
    fontWeight: "700",
    marginTop: 15,
    marginBottom: 5,
  },
  paragraph: {
    fontSize: getSize(14),
    lineHeight: 22,
    textAlign: "justify",

  },
});
