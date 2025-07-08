import { z } from 'zod';

export const ApiErrorSchema = z.object({
  code: z.string(),
  message: z.string(),
  details: z.record(z.unknown()).optional(),
  stack: z.string().optional().describe('Only included in development')
});

export const ApiResponseSchema = z.object({
  success: z.boolean(),
  data: z.unknown().nullable(),
  error: ApiErrorSchema.optional(),
  metadata: z.object({
    timestamp: z.string().datetime(),
    requestId: z.string().uuid(),
    processingTime: z.number().optional()
  })
});

export const PaginatedResponseSchema = z.object({
  items: z.array(z.unknown()),
  total: z.number().int(),
  page: z.number().int(),
  pageSize: z.number().int(),
  hasMore: z.boolean()
});

export const ApiValidationErrorSchema = ApiErrorSchema.extend({
  code: z.literal('VALIDATION_ERROR'),
  details: z.object({
    fields: z.record(z.array(z.string()))
  })
});

export const ApiAuthErrorSchema = ApiErrorSchema.extend({
  code: z.enum(['UNAUTHORIZED', 'FORBIDDEN', 'TOKEN_EXPIRED', 'INVALID_TOKEN']),
  details: z.object({
    requiredPermissions: z.array(z.string()).optional(),
    tokenExpiry: z.string().datetime().optional()
  }).optional()
});

export const ApiRateLimitErrorSchema = ApiErrorSchema.extend({
  code: z.literal('RATE_LIMIT_EXCEEDED'),
  details: z.object({
    limit: z.number(),
    remaining: z.number(),
    resetAt: z.string().datetime()
  })
});

export const ApiVoiceProcessingErrorSchema = ApiErrorSchema.extend({
  code: z.enum([
    'AUDIO_PROCESSING_FAILED',
    'VOICE_VERIFICATION_FAILED',
    'INVALID_AUDIO_FORMAT',
    'TRANSCRIPTION_FAILED'
  ]),
  details: z.object({
    audioUrl: z.string().url().optional(),
    format: z.string().optional(),
    duration: z.number().optional(),
    errorType: z.string().optional()
  }).optional()
});

// Type aliases for convenience
export type ApiError = z.infer<typeof ApiErrorSchema>;
export type ApiResponse<T = unknown> = {
  success: boolean;
  data: T | null;
  error?: ApiError;
  metadata: {
    timestamp: string;
    requestId: string;
    processingTime?: number;
  };
};
export type PaginatedResponse<T = unknown> = z.infer<typeof PaginatedResponseSchema> & { items: T[] };
export type ApiValidationError = z.infer<typeof ApiValidationErrorSchema>;
export type ApiAuthError = z.infer<typeof ApiAuthErrorSchema>;
export type ApiRateLimitError = z.infer<typeof ApiRateLimitErrorSchema>;
export type ApiVoiceProcessingError = z.infer<typeof ApiVoiceProcessingErrorSchema>;

// Helper type for wrapping responses
export type ApiResponseWrapper<T> = Omit<ApiResponse<T>, 'data'> & { data: T | null };

// Helper type for paginated requests
export const PaginationParamsSchema = z.object({
  page: z.number().int().min(1).default(1),
  pageSize: z.number().int().min(1).max(100).default(20),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional()
});

export type PaginationParams = z.infer<typeof PaginationParamsSchema>;
