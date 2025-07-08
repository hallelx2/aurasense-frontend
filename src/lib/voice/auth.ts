import { apiClient } from '@/lib/api/apiClient';
import { VoiceVerification } from '@/types/voice';
import { ApiResponse } from '@/types/api';

interface VoiceVerificationParams {
  email: string;
  audioUrl: string;
  challengeText: string;
}

interface VoiceEnrollmentParams {
  userId: string;
  audioUrl: string;
  enrollmentPhrase: string;
}

interface VoiceChallengeParams {
  email: string;
  type: 'login' | 'signup' | 'verification';
}

export async function verifyVoiceAuthentication(params: VoiceVerificationParams): Promise<boolean> {
  try {
    const response = await apiClient.post<ApiResponse<VoiceVerification>>('/auth/voice/verify', params);
    return response.data.success && response.data.data?.status === 'verified';
  } catch (error) {
    console.error('Voice verification failed:', error);
    return false;
  }
}

export async function enrollVoiceProfile(params: VoiceEnrollmentParams): Promise<VoiceVerification | null> {
  try {
    const response = await apiClient.post<ApiResponse<VoiceVerification>>('/auth/voice/enroll', params);
    return response.data.data;
  } catch (error) {
    console.error('Voice enrollment failed:', error);
    return null;
  }
}

export async function generateVoiceChallenge(params: VoiceChallengeParams): Promise<string | null> {
  try {
    const response = await apiClient.post<ApiResponse<{ challengeText: string }>>('/auth/voice/challenge', params);
    return response.data.data?.challengeText ?? null;
  } catch (error) {
    console.error('Failed to generate voice challenge:', error);
    return null;
  }
}

export async function checkVoiceEnrollmentStatus(userId: string): Promise<VoiceVerification | null> {
  try {
    const response = await apiClient.get<ApiResponse<VoiceVerification>>(`/auth/voice/status/${userId}`);
    return response.data.data;
  } catch (error) {
    console.error('Failed to check voice enrollment status:', error);
    return null;
  }
}

export async function deleteVoiceProfile(userId: string): Promise<boolean> {
  try {
    const response = await apiClient.delete<ApiResponse<void>>(`/auth/voice/profile/${userId}`);
    return response.data.success;
  } catch (error) {
    console.error('Failed to delete voice profile:', error);
    return false;
  }
}
