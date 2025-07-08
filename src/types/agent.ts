import { z } from 'zod';
import { VoiceCommandSchema, VoiceResponseSchema } from './voice';
import { UserProfileSchema } from './user';

export const AgentConfigSchema = z.object({
  id: z.string().uuid(),
  type: z.enum(['food', 'travel', 'social', 'health', 'onboarding', 'auth']),
  name: z.string(),
  description: z.string(),
  capabilities: z.array(z.string()),
  requiredContext: z.array(z.string()),
  systemPrompt: z.string(),
  maxTokens: z.number().int().positive(),
  temperature: z.number().min(0).max(2),
  topP: z.number().min(0).max(1).optional(),
  stopSequences: z.array(z.string()).optional()
});

export const AgentStateSchema = z.object({
  agentId: z.string().uuid(),
  userId: z.string().uuid(),
  sessionId: z.string().uuid(),
  currentContext: z.record(z.unknown()),
  conversationHistory: z.array(z.object({
    role: z.enum(['user', 'assistant', 'system']),
    content: z.string(),
    timestamp: z.string().datetime()
  })),
  lastUpdated: z.string().datetime(),
  metadata: z.record(z.unknown()).optional()
});

export const AgentActionSchema = z.object({
  type: z.enum([
    'query_user_profile',
    'update_user_preferences',
    'process_voice_command',
    'generate_voice_response',
    'execute_api_call',
    'update_session_state',
    'trigger_notification'
  ]),
  payload: z.record(z.unknown()),
  timestamp: z.string().datetime(),
  status: z.enum(['pending', 'processing', 'completed', 'failed']),
  result: z.record(z.unknown()).optional()
});

export const AgentResponseSchema = z.object({
  id: z.string().uuid(),
  agentId: z.string().uuid(),
  sessionId: z.string().uuid(),
  voiceResponse: VoiceResponseSchema,
  actions: z.array(AgentActionSchema).optional(),
  context: z.object({
    userProfile: UserProfileSchema,
    voiceCommand: VoiceCommandSchema,
    sessionState: z.record(z.unknown())
  }),
  timestamp: z.string().datetime(),
  metadata: z.record(z.unknown()).optional()
});

export type AgentConfig = z.infer<typeof AgentConfigSchema>;
export type AgentState = z.infer<typeof AgentStateSchema>;
export type AgentAction = z.infer<typeof AgentActionSchema>;
export type AgentResponse = z.infer<typeof AgentResponseSchema>;
