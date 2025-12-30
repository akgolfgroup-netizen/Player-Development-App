/**
 * AI Coach Service
 *
 * Provides AI-powered golf coaching features:
 * - Chat with AI coach for training advice
 * - Training plan recommendations
 * - Breaking point analysis
 * - Progress insights
 */

import { claudeClient, ChatMessage } from './claude-client.service';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Types
export interface PlayerContext {
  id: string;
  name: string;
  email: string;
  category?: string;
  handicap?: number;
  averageScore?: number;
  breakingPoints?: Array<{
    area: string;
    description: string;
    progress: number;
  }>;
  recentSessions?: Array<{
    date: string;
    type: string;
    duration: number;
    rating?: number;
  }>;
  goals?: string[];
}

export interface CoachingMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface CoachingSession {
  id: string;
  playerId: string;
  messages: CoachingMessage[];
  context?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

// System prompts
const GOLF_COACH_SYSTEM_PROMPT = `Du er en erfaren golf-coach ved AK Golf Academy. Du hjelper spillere med treningsråd, teknikk-tips, og mental forberedelse.

DINE EGENSKAPER:
- Vennlig og støttende, men profesjonell
- Fokusert på spillerens individuelle behov og mål
- Gir konkrete, praktiske råd
- Snakker norsk naturlig

OMRÅDER DU KAN HJELPE MED:
1. Treningsplanlegging og periodisering
2. Teknikk-forbedring (driver, jern, putting, kort spill)
3. Mental trening og selvtillit
4. Spillestrategi på banen
5. Breaking point analyse og forbedring
6. Målsetting og motivasjon

VIKTIGE PRINSIPPER:
- Tilpass råd til spillerens nivå (kategori A-D)
- Fokuser på ett område om gangen
- Gi konkrete øvelser når relevant
- Spør oppfølgingsspørsmål for å forstå bedre
- Vær realistisk om tidsrammer for forbedring

Svar alltid på norsk med mindre spilleren skriver på engelsk.`;

class AICoachService {
  /**
   * Get player context for AI coaching
   */
  async getPlayerContext(playerId: string): Promise<PlayerContext | null> {
    try {
      const player = await prisma.player.findUnique({
        where: { id: playerId },
        include: {
          user: {
            select: {
              email: true,
            },
          },
          breakingPoints: {
            where: { status: 'active' },
            take: 5,
          },
        },
      });

      if (!player) return null;

      // Get recent training sessions
      const recentAssignments = await prisma.dailyTrainingAssignment.findMany({
        where: {
          playerId,
          status: 'completed',
        },
        orderBy: { date: 'desc' },
        take: 5,
        include: {
          sessionTemplate: true,
        },
      });

      return {
        id: player.id,
        name: `${player.firstName} ${player.lastName}`,
        email: player.user?.email || '',
        category: player.currentCategory || undefined,
        handicap: player.handicap ? parseFloat(player.handicap.toString()) : undefined,
        averageScore: player.averageScore ? parseFloat(player.averageScore.toString()) : undefined,
        breakingPoints: player.breakingPoints?.map((bp: { area: string; description: string | null; progressPercent: { toString: () => string } | null }) => ({
          area: bp.area,
          description: bp.description || '',
          progress: bp.progressPercent ? parseFloat(bp.progressPercent.toString()) : 0,
        })),
        recentSessions: recentAssignments.map((a: { date: Date; sessionTemplate: { sessionType: string } | null; actualDuration: number | null; estimatedDuration: number | null; qualityRating: number | null }) => ({
          date: a.date.toISOString().split('T')[0],
          type: a.sessionTemplate?.sessionType || 'general',
          duration: a.actualDuration || a.estimatedDuration || 60,
          rating: a.qualityRating || undefined,
        })),
        goals: player.goals ? (player.goals as string[]) : [],
      };
    } catch (error) {
      console.error('Error getting player context:', error);
      return null;
    }
  }

  /**
   * Build system prompt with player context
   */
  private buildSystemPrompt(playerContext?: PlayerContext | null): string {
    let prompt = GOLF_COACH_SYSTEM_PROMPT;

    if (playerContext) {
      prompt += `\n\nSPILLERINFORMASJON:
- Navn: ${playerContext.name}
- Kategori: ${playerContext.category || 'Ukjent'}
- Handicap: ${playerContext.handicap !== undefined ? playerContext.handicap : 'Ukjent'}
- Snittcore: ${playerContext.averageScore || 'Ukjent'}`;

      if (playerContext.breakingPoints && playerContext.breakingPoints.length > 0) {
        prompt += `\n\nBREAKING POINTS (områder å forbedre):`;
        playerContext.breakingPoints.forEach((bp, i) => {
          prompt += `\n${i + 1}. ${bp.area}: ${bp.description} (${bp.progress}% fremgang)`;
        });
      }

      if (playerContext.recentSessions && playerContext.recentSessions.length > 0) {
        prompt += `\n\nSISTE TRENINGSØKTER:`;
        playerContext.recentSessions.forEach(s => {
          prompt += `\n- ${s.date}: ${s.type} (${s.duration} min)${s.rating ? ` - Rating: ${s.rating}/10` : ''}`;
        });
      }

      if (playerContext.goals && playerContext.goals.length > 0) {
        prompt += `\n\nSPILLERENS MÅL:`;
        playerContext.goals.forEach((g, i) => {
          prompt += `\n${i + 1}. ${g}`;
        });
      }
    }

    return prompt;
  }

  /**
   * Chat with AI coach
   */
  async chat(
    playerId: string,
    message: string,
    conversationHistory: ChatMessage[] = []
  ): Promise<{ response: string; tokens: { input: number; output: number } }> {
    if (!claudeClient.isAvailable()) {
      return {
        response: 'AI-coach er ikke tilgjengelig for øyeblikket. Vennligst kontakt din trener direkte.',
        tokens: { input: 0, output: 0 },
      };
    }

    // Get player context
    const playerContext = await this.getPlayerContext(playerId);
    const systemPrompt = this.buildSystemPrompt(playerContext);

    // Build messages
    const messages: ChatMessage[] = [
      ...conversationHistory,
      { role: 'user', content: message },
    ];

    try {
      const response = await claudeClient.chat(messages, {
        system: systemPrompt,
        temperature: 0.7,
      });

      return {
        response: response.content,
        tokens: {
          input: response.usage.inputTokens,
          output: response.usage.outputTokens,
        },
      };
    } catch (error) {
      console.error('AI Coach chat error:', error);
      return {
        response: 'Beklager, jeg kunne ikke behandle meldingen din. Vennligst prøv igjen.',
        tokens: { input: 0, output: 0 },
      };
    }
  }

  /**
   * Get training recommendations
   */
  async getTrainingRecommendations(playerId: string): Promise<string> {
    const playerContext = await this.getPlayerContext(playerId);

    if (!playerContext) {
      return 'Kunne ikke finne spillerinformasjon.';
    }

    const prompt = `Basert på denne spillerens profil og treningshistorikk, gi 3-5 konkrete treningsanbefalinger for neste uke.

Fokuser på:
1. Breaking points som trenger oppmerksomhet
2. Balanse mellom teknikk, kort spill og putting
3. Realistisk tidsbruk basert på spillerens nivå

Vær spesifikk med øvelser og tidsangivelser.`;

    try {
      const response = await claudeClient.chat(
        [{ role: 'user', content: prompt }],
        {
          system: this.buildSystemPrompt(playerContext),
          temperature: 0.5,
        }
      );

      return response.content;
    } catch (error) {
      console.error('Error getting recommendations:', error);
      return 'Kunne ikke generere anbefalinger. Vennligst prøv igjen senere.';
    }
  }

  /**
   * Analyze breaking point and suggest exercises
   */
  async analyzeBreakingPoint(
    playerId: string,
    breakingPointArea: string,
    description?: string
  ): Promise<string> {
    const playerContext = await this.getPlayerContext(playerId);

    const prompt = `Analyser dette breaking point for spilleren og foreslå en konkret treningsplan:

BREAKING POINT: ${breakingPointArea}
${description ? `BESKRIVELSE: ${description}` : ''}

Gi:
1. Mulige årsaker til problemet
2. 3-4 spesifikke øvelser for å forbedre
3. Forventet tidsramme for merkbar forbedring
4. Tips for å måle fremgang`;

    try {
      const response = await claudeClient.chat(
        [{ role: 'user', content: prompt }],
        {
          system: this.buildSystemPrompt(playerContext),
          temperature: 0.5,
        }
      );

      return response.content;
    } catch (error) {
      console.error('Error analyzing breaking point:', error);
      return 'Kunne ikke analysere breaking point. Vennligst prøv igjen senere.';
    }
  }

  /**
   * Get AI coach status
   */
  getStatus(): { available: boolean; model: string } {
    const modelInfo = claudeClient.getModelInfo();
    return {
      available: claudeClient.isAvailable(),
      model: modelInfo.model,
    };
  }
}

// Export singleton
export const aiCoach = new AICoachService();
export default aiCoach;
