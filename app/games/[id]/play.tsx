import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, router } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { games } from '../../(tabs)';

export default function GamePlayScreen() {
  const params = useLocalSearchParams<{ id: string }>();
  const game = games.find((g) => g.id === params.id);

  if (!game) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Game not found</Text>
      </View>
    );
  }

  return (
    <LinearGradient colors={[game.color, `${game.color}dd`]} style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft color="#fff" size={24} />
        </Pressable>
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>{game.title}</Text>
        <Text style={styles.subtitle}>{game.description}</Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 32,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontFamily: 'Poppins-Regular',
    fontSize: 18,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
  },
  errorText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
    marginTop: 40,
  },
});

