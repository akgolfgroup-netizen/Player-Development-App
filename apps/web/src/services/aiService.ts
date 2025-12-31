/**
 * AK Golf Academy - AI Coach Service
 *
 * Provides interface to the AI Coach backend API.
 * Handles chat, recommendations, and analysis requests.
 */

import axios, { AxiosInstance } from 'axios';

// =============================================================================
// Types
// =============================================================================

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface ChatRequest {
  message: string;
  conversationHistory?: Array<{
    role: 'user' | 'assistant';
    content: string;
  }>;
  context?: {
    currentScreen?: string;
    recentActions?: string[];
  };
}

export interface ChatResponse {
  response: string;
  suggestions?: string[];
  relatedTopics?: string[];
}

export interface AIStatusResponse {
  available: boolean;
  message: string;
  provider?: string;
}

export interface RecommendationsResponse {
  recommendations: Array<{
    type: 'exercise' | 'focus_area' | 'goal' | 'mental';
    title: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
    actionable?: {
      type: string;
      id?: string;
    };
  }>;
  summary: string;
}

export interface BreakingPointAnalysis {
  category: string;
  testType: string;
  results: number[];
}

export interface BreakingPointResponse {
  analysis: string;
  recommendations: string[];
  focusAreas: string[];
}

// =============================================================================
// Service
// =============================================================================

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000/api/v1';

const aiApi: AxiosInstance = axios.create({
  baseURL: `${API_BASE_URL}/ai`,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 60000, // AI can take time to respond
});

// Add auth interceptor
aiApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// =============================================================================
// API Functions
// =============================================================================

/**
 * Check if AI service is available
 */
export async function checkAIStatus(): Promise<AIStatusResponse> {
  try {
    const response = await aiApi.get<AIStatusResponse>('/status');
    return response.data;
  } catch (error) {
    console.error('[AIService] Status check failed:', error);
    return {
      available: false,
      message: 'AI-tjenesten er midlertidig utilgjengelig',
    };
  }
}

/**
 * Send a chat message to the AI coach
 */
export async function sendChatMessage(request: ChatRequest): Promise<ChatResponse> {
  const response = await aiApi.post<ChatResponse>('/chat', request);
  return response.data;
}

/**
 * Get personalized training recommendations
 */
export async function getRecommendations(): Promise<RecommendationsResponse> {
  const response = await aiApi.get<RecommendationsResponse>('/recommendations');
  return response.data;
}

/**
 * Analyze breaking point data
 */
export async function analyzeBreakingPoint(
  analysis: BreakingPointAnalysis
): Promise<BreakingPointResponse> {
  const response = await aiApi.post<BreakingPointResponse>('/analyze-breaking-point', analysis);
  return response.data;
}

// =============================================================================
// Conversation Management
// =============================================================================

const CONVERSATION_KEY = 'ai_coach_conversation';
const MAX_CONVERSATION_LENGTH = 20;

/**
 * Get stored conversation history
 */
export function getConversationHistory(): ChatMessage[] {
  try {
    const stored = localStorage.getItem(CONVERSATION_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed.map((msg: ChatMessage) => ({
        ...msg,
        timestamp: new Date(msg.timestamp),
      }));
    }
  } catch (error) {
    console.error('[AIService] Failed to get conversation:', error);
  }
  return [];
}

/**
 * Add message to conversation history
 */
export function addToConversation(message: ChatMessage): void {
  try {
    const history = getConversationHistory();
    history.push(message);

    // Keep only last N messages
    const trimmed = history.slice(-MAX_CONVERSATION_LENGTH);
    localStorage.setItem(CONVERSATION_KEY, JSON.stringify(trimmed));
  } catch (error) {
    console.error('[AIService] Failed to save conversation:', error);
  }
}

/**
 * Clear conversation history
 */
export function clearConversation(): void {
  localStorage.removeItem(CONVERSATION_KEY);
}

// =============================================================================
// Export
// =============================================================================

export const aiService = {
  checkStatus: checkAIStatus,
  chat: sendChatMessage,
  getRecommendations,
  analyzeBreakingPoint,
  getConversationHistory,
  addToConversation,
  clearConversation,
};

export default aiService;
