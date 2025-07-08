import { z } from 'zod';

export const UserPreferencesSchema = z.object({
  cuisineTypes: z.array(z.string()),
  dietaryRestrictions: z.array(z.enum(['halal', 'kosher', 'vegetarian', 'vegan', 'gluten-free'])),
  priceRange: z.object({
    min: z.number(),
    max: z.number()
  }),
  spiceTolerance: z.number().min(1).max(5),
  travelPreferences: z.object({
    preferredTransportation: z.array(z.enum(['car', 'plane', 'train', 'bus'])),
    accommodationTypes: z.array(z.enum(['hotel', 'hostel', 'apartment', 'resort'])),
    budgetPerDay: z.number(),
    preferredActivities: z.array(z.string())
  }).optional(),
  communicationPreferences: z.object({
    preferredLanguages: z.array(z.string()),
    voiceSpeed: z.number().min(0.5).max(2),
    notificationTypes: z.array(z.enum(['voice', 'visual', 'haptic']))
  })
});

export const HealthProfileSchema = z.object({
  allergies: z.array(z.string()),
  conditions: z.array(z.enum(['diabetes', 'hypertension', 'heart-disease', 'celiac', 'other'])),
  medications: z.array(z.string()).optional(),
  dietaryNeeds: z.array(z.string()),
  emergencyContact: z.object({
    name: z.string(),
    phone: z.string(),
    relationship: z.string()
  }).optional()
});

export const UserProfileSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string(),
  preferences: UserPreferencesSchema,
  healthProfile: HealthProfileSchema,
  voiceProfile: z.object({
    voiceId: z.string().optional(),
    lastVerified: z.string().datetime().optional(),
    enrollmentStatus: z.enum(['none', 'pending', 'enrolled']),
    voiceSettings: z.object({
      pitch: z.number().min(-10).max(10).optional(),
      speed: z.number().min(0.5).max(2).optional()
    }).optional()
  }),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  lastActive: z.string().datetime().optional()
});

export type UserPreferences = z.infer<typeof UserPreferencesSchema>;
export type HealthProfile = z.infer<typeof HealthProfileSchema>;
export type UserProfile = z.infer<typeof UserProfileSchema>;

export const SessionSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  startTime: z.string().datetime(),
  endTime: z.string().datetime().optional(),
  type: z.enum(['food', 'travel', 'social', 'health', 'general']),
  status: z.enum(['active', 'completed', 'failed']),
  metadata: z.record(z.unknown()).optional()
});

export type Session = z.infer<typeof SessionSchema>;
