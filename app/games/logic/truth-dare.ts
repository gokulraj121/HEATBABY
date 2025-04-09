export interface TruthDareGameState {
  currentPlayer: 1 | 2;
  points: {
    player1: number;
    player2: number;
  };
  currentRound: number;
  totalRounds: number;
  lastChoice?: 'truth' | 'dare';
  usedQuestions: Set<string>;
  gameOver: boolean;
}

export class TruthDareGame {
  private state: TruthDareGameState;
  private mode: string;
  private content: any;

  constructor(mode: string, content: any) {
    this.mode = mode;
    this.content = content;
    this.state = {
      currentPlayer: 1,
      points: {
        player1: 0,
        player2: 0,
      },
      currentRound: 1,
      totalRounds: 10,
      usedQuestions: new Set(),
      gameOver: false,
    };
  }

  public getState(): TruthDareGameState {
    return { ...this.state };
  }

  public getQuestion(choice: 'truth' | 'dare'): string | null {
    const questions = this.content[this.mode][`${choice}s`];
    const availableQuestions = questions.filter(
      (q: string) => !this.state.usedQuestions.has(q)
    );

    if (availableQuestions.length === 0) {
      return null;
    }

    const randomIndex = Math.floor(Math.random() * availableQuestions.length);
    const selectedQuestion = availableQuestions[randomIndex];
    this.state.usedQuestions.add(selectedQuestion);
    this.state.lastChoice = choice;

    return selectedQuestion;
  }

  public completeRound(completed: boolean): void {
    if (completed) {
      this.state.points[`player${this.state.currentPlayer}`] += 10;
    }

    if (this.state.currentRound >= this.state.totalRounds) {
      this.state.gameOver = true;
      return;
    }

    this.state.currentPlayer = this.state.currentPlayer === 1 ? 2 : 1;
    this.state.currentRound++;
  }

  public getWinner(): number | null {
    if (!this.state.gameOver) return null;
    
    if (this.state.points.player1 > this.state.points.player2) return 1;
    if (this.state.points.player2 > this.state.points.player1) return 2;
    return 0; // Draw
  }
}