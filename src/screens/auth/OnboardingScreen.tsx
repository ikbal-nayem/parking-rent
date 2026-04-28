import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Colors, Fonts, Spacing, BorderRadius } from '../../theme';
import { Button } from '../../components/common/Button';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const { width } = Dimensions.get('window');

const SLIDES = [
  {
    id: '1',
    title: 'Find Parking Anywhere',
    description: 'Discover available parking spots near your destination instantly.',
    icon: 'map-search',
    color: Colors.primary,
  },
  {
    id: '2',
    title: 'Book and Pay Seamlessly',
    description: 'Reserve your spot and pay securely within the app. No cash needed.',
    icon: 'credit-card-check',
    color: Colors.accent,
  },
  {
    id: '3',
    title: 'Earn from Your Space',
    description: 'Got an empty driveway? List it and start earning passive income today.',
    icon: 'cash-multiple',
    color: Colors.success,
  },
];

export const OnboardingScreen = () => {
  const navigation = useNavigation<any>();
  const [currentIndex, setCurrentIndex] = useState(0);

  const renderItem = ({ item }: { item: typeof SLIDES[0] }) => {
    return (
      <View style={styles.slide}>
        <View style={[styles.iconContainer, { backgroundColor: `${item.color}20` }]}>
          <Icon name={item.icon} size={80} color={item.color} />
        </View>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={SLIDES}
        renderItem={renderItem}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        bounces={false}
        onMomentumScrollEnd={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.x / width);
          setCurrentIndex(index);
        }}
        keyExtractor={(item) => item.id}
      />
      
      <View style={styles.footer}>
        <View style={styles.indicatorContainer}>
          {SLIDES.map((_, index) => (
            <View
              key={index.toString()}
              style={[
                styles.indicator,
                currentIndex === index && styles.indicatorActive,
              ]}
            />
          ))}
        </View>
        
        <View style={styles.buttonContainer}>
          <Button 
            title="Get Started" 
            onPress={() => navigation.navigate('Login')}
            style={styles.button}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  slide: {
    width,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xxl,
  },
  iconContainer: {
    width: 200,
    height: 200,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xxxl,
  },
  title: {
    color: Colors.textPrimary,
    fontSize: Fonts.sizes.title,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  description: {
    color: Colors.textSecondary,
    fontSize: Fonts.sizes.lg,
    textAlign: 'center',
    lineHeight: 28,
  },
  footer: {
    padding: Spacing.xl,
    paddingBottom: Spacing.xxxl,
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: Spacing.xl,
  },
  indicator: {
    height: 8,
    width: 8,
    borderRadius: 4,
    backgroundColor: Colors.surfaceHighlight,
    marginHorizontal: 4,
  },
  indicatorActive: {
    width: 24,
    backgroundColor: Colors.primary,
  },
  buttonContainer: {
    width: '100%',
  },
  button: {
    width: '100%',
  },
});
