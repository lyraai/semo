import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, Animated } from 'react-native';
import { Button } from 'react-native-elements';
import { colors } from '../styles/color';

const { width, height } = Dimensions.get('window');

export default function MeditationScreen({ navigation }) {
  const [waveAnimation] = useState(new Animated.Value(0));
  const waveRef = useRef(null);

  useEffect(() => {
    Animated.loop(
      Animated.timing(waveAnimation, {
        toValue: 1,
        duration: 5000,
        useNativeDriver: true,
      })
    ).start();

    return () => waveAnimation.stopAnimation();
  }, []);

  const getWavePoints = (amplitude, frequency) => {
    const points = [];
    for (let x = 0; x <= width + 10; x += 5) {
      const y = amplitude * Math.sin((x / width) * frequency * Math.PI);
      points.push({ x, y });
    }
    return points;
  };

  const animatedWave = waveAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, Math.PI * 2],
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Focus on your breath</Text>
      <View style={styles.waveContainer}>
        <Animated.View
          ref={waveRef}
          style={[
            styles.wave,
            {
              transform: [
                {
                  translateY: animatedWave.interpolate({
                    inputRange: [0, Math.PI, Math.PI * 2],
                    outputRange: [0, -30, 0],
                  }),
                },
              ],
            },
          ]}
        >
          {getWavePoints(20, 3).map((point, index) => (
            <View
              key={index}
              style={[
                styles.wavePoint,
                {
                  left: point.x,
                  top: point.y + height / 2,
                },
              ]}
            />
          ))}
        </Animated.View>
      </View>
      <Button 
        title="开始冥想" 
        buttonStyle={styles.button} 
        onPress={() => navigation.goBack()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F7F4EE',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    color: '#333',
  },
  breathingCircle: {
    width: width * 0.6,
    height: width * 0.6,
    borderRadius: (width * 0.6) / 2,
    backgroundColor: '#81c784',
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#4CAF50',
    width: 200,
  },
  waveContainer: {
    width: width,
    height: height / 2,
    overflow: 'hidden',
    backgroundColor: 'rgba(129, 199, 132, 0.2)',
  },
  wave: {
    position: 'absolute',
    width: width + 10,
    height: height / 2,
  },
  wavePoint: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#81c784',
  },
});