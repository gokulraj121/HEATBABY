import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, router } from 'expo-router';
import { Trophy, Home } from 'lucide-react-native';

export default function ResultsScreen() {
  const params = useLocalSearchParams<{ winner: string; points: string }>();
  const points = JSON.parse(params.points || '{}');
  const winner = parseInt(params.winner || '0');

  return (
    <LinearGradient colors={['#1a1a1a', '#2d2d2d']} style={styles.container}>
      <View style={styles.content}>
        <Trophy color="#FFD700" size={64} />
        <Text style={styles.title}>
          {winner === 0 ? "It's a Draw!" : `Player ${winner} Wins!`}
        </Text>
        <View style={styles.scores}>
          <Text style={styles.scoreText}>Player 1: {points.player1}</Text>
          <Text style={styles.scoreText}>Player 2: {points.player2}</Text>
        </View>
        <Pressable
          style={styles.homeButton}
          onPress={() => router.replace('/(tabs)')}
        >
          <Home color="#fff" size={24} />
          <Text style={styles.buttonText}>Back to Home</Text>
        </Pressable>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 20,
  },
  scores: {
    marginTop: 30,
  },
  scoreText: {
    fontSize: 24,
    color: '#fff',
    marginVertical: 10,
  },
  homeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF3B30',
    padding: 15,
    borderRadius: 10,
    marginTop: 40,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    marginLeft: 10,
  },
});