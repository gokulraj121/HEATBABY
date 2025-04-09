import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { 
  MessageCircle, 
  Users, 
  Dice, 
  Footprints, 
  ChessKnight, 
  Target, 
  Trophy,
  Map 
} from 'lucide-react-native';
import React from 'react';

export type GameMode = 'romantic' | 'fun' | 'spicy' | 'extreme' | 'classic' | 'quick' | 'power';

export interface Game {
  id: string;
  title: string;
  icon: any;
  color: string;
  description: string;
  modes: GameMode[];
  minPlayers: number;
  maxPlayers: number;
  timePerRound: number;
  points: {
    completion: number;
    bonus: number;
  };
  parameters: {
    single: any;
  };
}

export const games: Game[] = [
  {
    id: 'truth-dare',
    title: 'Truth or Dare',
    icon: MessageCircle,
    color: '#FF3B30',
    description: 'Answer spicy questions or perform daring acts',
    modes: ['romantic', 'fun', 'spicy', 'extreme'],
    minPlayers: 2,
    maxPlayers: 2,
    timePerRound: 60,
    points: {
      completion: 10,
      bonus: 5,
    },
    parameters: {
      single: {
        questions: [],
        dares: []
      }
    }
  },
  {
    id: 'would-you-rather',
    title: 'Would You Rather?',
    icon: Users,
    color: '#4A90E2',
    description: 'Choose between two intriguing scenarios',
    modes: ['romantic', 'fun', 'spicy', 'extreme'],
    minPlayers: 2,
    maxPlayers: 2,
    timePerRound: 30,
    points: {
      completion: 5,
      bonus: 3,
    },
    parameters: {
      single: []
    }
  },
  {
    id: 'ludo-master',
    title: 'Ludo Master',
    icon: Dice,
    color: '#FFB400',
    description: 'Classic Ludo with exciting power-ups and challenges',
    modes: ['classic', 'quick', 'power'],
    minPlayers: 2,
    maxPlayers: 4,
    timePerRound: 30,
    points: {
      completion: 20,
      bonus: 10,
    },
    parameters: {
      single: {
        aiPlayers: 3,
        difficulty: ['easy', 'medium', 'hard'],
        aiDelay: 1000,
        powerUpsEnabled: true
      }
    }
  },
  {
    id: 'snake-ladder',
    title: 'Snakes & Ladders',
    icon: Footprints,
    color: '#4CAF50',
    description: 'Enhanced version with special tiles and abilities',
    modes: ['classic', 'quick', 'power'],
    minPlayers: 2,
    maxPlayers: 4,
    timePerRound: 20,
    points: {
      completion: 15,
      bonus: 8,
    },
    parameters: {
      single: {
        aiPlayers: 1,
        difficulty: ['easy', 'medium', 'hard'],
        aiDelay: 800,
        specialTilesEnabled: true
      }
    }
  },
  {
    id: 'chess-royale',
    title: 'Chess Royale',
    icon: ChessKnight,
    color: '#2196F3',
    description: 'Chess with special powers and time challenges',
    modes: ['classic', 'quick', 'power'],
    minPlayers: 2,
    maxPlayers: 2,
    timePerRound: 300,
    points: {
      completion: 25,
      bonus: 15,
    },
    parameters: {
      single: {
        aiPlayers: 1,
        difficulty: ['easy', 'medium', 'hard'],
        aiDelay: 1000,
        specialMovesEnabled: true
      }
    }
  },
  {
    id: 'carrom-strike',
    title: 'Carrom Strike',
    icon: Target,
    color: '#8E24AA',
    description: 'Digital carrom with power shots and special coins',
    modes: ['classic', 'quick', 'power'],
    minPlayers: 2,
    maxPlayers: 4,
    timePerRound: 45,
    points: {
      completion: 18,
      bonus: 9,
    },
    parameters: {
      single: {
        aiPlayers: 1,
        difficulty: ['easy', 'medium', 'hard'],
        aiDelay: 800,
        powerShotsEnabled: true
      }
    }
  },
  {
    id: 'monopoly-rush',
    title: 'Monopoly Rush',
    icon: Trophy,
    color: '#F44336',
    description: 'Fast-paced property trading with special cards',
    modes: ['classic', 'quick', 'power'],
    minPlayers: 2,
    maxPlayers: 6,
    timePerRound: 60,
    points: {
      completion: 30,
      bonus: 15,
    },
    parameters: {
      single: {
        aiPlayers: 3,
        difficulty: ['easy', 'medium', 'hard'],
        aiDelay: 1200,
        startingMoney: 1500,
        specialCardsEnabled: true
      }
    }
  },
  {
    id: 'uno-blast',
    title: 'UNO Blast',
    icon: Map,
    color: '#00BCD4',
    description: 'UNO with special cards and power moves',
    modes: ['classic', 'quick', 'power'],
    minPlayers: 2,
    maxPlayers: 8,
    timePerRound: 30,
    points: {
      completion: 15,
      bonus: 8,
    },
    parameters: {
      single: {
        aiPlayers: 3,
        difficulty: ['easy', 'medium', 'hard'],
        aiDelay: 1000,
        handSize: 7,
        specialCardsEnabled: true
      }
    }
  }
];

export default function GamesScreen() {
  const handleGamePress = (game: Game) => {
    router.push(`/games/${game.id}`);
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.grid}>
          {games.map((game) => (
            <Pressable 
              key={game.id} 
              style={styles.gameCard}
              onPress={() => handleGamePress(game)}
            >
              <LinearGradient
                colors={[game.color, `${game.color}dd`]}
                style={styles.gameCardGradient}
              >
                <Text style={styles.gameTitle}>{game.title}</Text>
                <Text style={styles.gameDescription}>{game.description}</Text>
              </LinearGradient>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  content: {
    flex: 1,
    padding: 10,
  },
  grid: {
    padding: 10,
  },
  gameCard: {
    width: '100%',
    marginBottom: 15,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  gameCardGradient: {
    padding: 20,
  },
  gameTitle: {
    fontFamily: 'Poppins-SemiBold',
    color: '#fff',
    fontSize: 24,
    marginBottom: 5,
  },
  gameDescription: {
    fontFamily: 'Poppins-Regular',
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
  },
});













