import { z } from 'zod';

export const VoiceCommandSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  sessionId: z.string().uuid(),
  audioUrl: z.string().url(),
  timestamp: z.string().datetime(),
  context: z.object({
    agentType: z.enum(['food', 'travel', 'social', 'health', 'onboarding', 'auth']),
    previousCommandId: z.string().uuid().optional(),
    userState: z.record(z.unknown()).optional()
  }),
  processingStatus: z.enum(['pending', 'processing', 'completed', 'failed']),
  transcription: z.object({
    text: z.string(),
    confidence: z.number().min(0).max(1),
    language: z.string().optional()
  }).optional()
});

export const VoiceResponseSchema = z.object({
  id: z.string().uuid(),
  commandId: z.string().uuid(),
  audioUrl: z.string().url().optional(),
  text: z.string(),
  timestamp: z.string().datetime(),
  type: z.enum(['text', 'audio', 'both']),
  metadata: z.object({
    emotion: z.enum(['neutral', 'happy', 'concerned', 'urgent']).optional(),
    speed: z.number().min(0.5).max(2).optional(),
    pitch: z.number().min(-10).max(10).optional()
  }).optional(),
  actions: z.array(z.object({
    type: z.string(),
    payload: z.record(z.unknown())
  })).optional()
});

export const AudioProcessingConfigSchema = z.object({
  sampleRate: z.number().int().positive(),
  channels: z.number().int().min(1).max(2),
  encoding: z.enum(['LINEAR16', 'FLAC', 'MULAW', 'AMR', 'AMR_WB', 'OGG_OPUS', 'SPEEX_WITH_HEADER_BYTE']),
  languageCode: z.string(),
  alternativeLanguageCodes: z.array(z.string()).optional(),
  enhanceAudio: z.boolean().optional(),
  removeNoise: z.boolean().optional(),
  vadLevel: z.number().min(0).max(3).optional()
});

export const VoiceVerificationSchema = z.object({
  userId: z.string().uuid(),
  audioUrl: z.string().url(),
  challengeText: z.string(),
  timestamp: z.string().datetime(),
  confidence: z.number().min(0).max(1),
  status: z.enum(['pending', 'verified', 'failed']),
  metadata: z.record(z.unknown()).optional()
});

export type VoiceCommand = z.infer<typeof VoiceCommandSchema>;
export type VoiceResponse = z.infer<typeof VoiceResponseSchema>;
export type AudioProcessingConfig = z.infer<typeof AudioProcessingConfigSchema>;
export type VoiceVerification = z.infer<typeof VoiceVerificationSchema>;
