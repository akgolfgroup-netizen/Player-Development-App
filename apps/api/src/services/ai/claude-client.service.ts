/**
 * Claude Client Service
 *
 * Provides interface to Anthropic Claude API for AI-powered features.
 * Used for:
 * - AI coaching chat
 * - Training plan recommendations
 * - Performance analysis
 * - Breaking point diagnosis
 */

import Anthropic from '@anthropic-ai/sdk';
import { config } from '../../config';

// Types
export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface Tool {
  name: string;
  description: string;
  input_schema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
}

export interface ChatOptions {
  system?: string;
  tools?: Tool[];
  temperature?: number;
  maxTokens?: number;
}

export interface ChatResponse {
  content: string;
  stopReason: string;
  toolCalls?: Array<{
    id: string;
    name: string;
    input: Record<string, unknown>;
  }>;
  usage: {
    inputTokens: number;
    outputTokens: number;
  };
}

class ClaudeClientService {
  private client: Anthropic | null = null;
  private isEnabled: boolean;

  constructor() {
    this.isEnabled = config.anthropic.enabled;

    if (this.isEnabled && config.anthropic.apiKey) {
      this.client = new Anthropic({
        apiKey: config.anthropic.apiKey,
      });
      console.log('Claude AI client initialized');
    } else {
      console.log('Claude AI client disabled (no API key)');
    }
  }

  /**
   * Check if Claude is available
   */
  isAvailable(): boolean {
    return this.isEnabled && this.client !== null;
  }

  /**
   * Send a chat message to Claude
   */
  async chat(
    messages: ChatMessage[],
    options: ChatOptions = {}
  ): Promise<ChatResponse> {
    if (!this.client) {
      throw new Error('Claude AI is not configured. Set ANTHROPIC_API_KEY.');
    }

    try {
      const response = await this.client.messages.create({
        model: config.anthropic.model,
        max_tokens: options.maxTokens || config.anthropic.maxTokens,
        system: options.system,
        messages: messages.map(m => ({
          role: m.role,
          content: m.content,
        })),
        tools: options.tools as Anthropic.Tool[] | undefined,
        temperature: options.temperature,
      });

      // Extract text content
      const textContent = response.content
        .filter((block): block is Anthropic.TextBlock => block.type === 'text')
        .map(block => block.text)
        .join('\n');

      // Extract tool use if any
      const toolCalls = response.content
        .filter((block): block is Anthropic.ToolUseBlock => block.type === 'tool_use')
        .map(block => ({
          id: block.id,
          name: block.name,
          input: block.input as Record<string, unknown>,
        }));

      return {
        content: textContent,
        stopReason: response.stop_reason || 'end_turn',
        toolCalls: toolCalls.length > 0 ? toolCalls : undefined,
        usage: {
          inputTokens: response.usage.input_tokens,
          outputTokens: response.usage.output_tokens,
        },
      };
    } catch (error) {
      console.error('Claude API error:', error);
      throw error;
    }
  }

  /**
   * Simple one-shot completion
   */
  async complete(
    prompt: string,
    system?: string,
    options: Omit<ChatOptions, 'system'> = {}
  ): Promise<string> {
    const response = await this.chat(
      [{ role: 'user', content: prompt }],
      { ...options, system }
    );
    return response.content;
  }

  /**
   * Get model info
   */
  getModelInfo(): { model: string; maxTokens: number; enabled: boolean } {
    return {
      model: config.anthropic.model,
      maxTokens: config.anthropic.maxTokens,
      enabled: this.isEnabled,
    };
  }
}

// Export singleton instance
export const claudeClient = new ClaudeClientService();
export default claudeClient;
