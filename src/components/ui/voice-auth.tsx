"use client";

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { signIn } from 'next-auth/react';
import { useVoiceRecording } from '@/hooks/useVoiceRecording';
import { VoiceFeedback } from './voice-feedback';
import { Button } from '@/components/ui/button';
import { Loader2, RefreshCw, CheckCircle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { VoiceVerification } from '@/types/voice';

interface VoiceAuthProps {
  email: string;
  onSuccess: () => void;
  onError: (error: Error) => void;
  className?: string;
}

const CHALLENGE_PHRASES = [
  "My voice is my passport, verify me",
  "The quick brown fox jumps over the lazy dog",
  "She sells seashells by the seashore",
  "How much wood would a woodchuck chuck"
];

export function VoiceAuth({
  email,
  onSuccess,
  onError,
  className
}: VoiceAuthProps) {
  const [challengePhrase, setChallengePhrase] = useState('');
  const [verificationStatus, setVerificationStatus] = useState<VoiceVerification['status']>('pending');
  const [attempts, setAttempts] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const {
    startRecording,
    stopRecording,
    isRecording,
    audioBlob,
    volume,
    error: recordingError
  } = useVoiceRecording({
    maxDuration: 5,
    autoStopAfterMaxDuration: true,
    processingConfig: {
      enhanceAudio: true,
      removeNoise: true,
      vadLevel: 3
    }
  });

  // Generate a new challenge phrase
  const generateChallenge = useCallback(() => {
    const index = Math.floor(Math.random() * CHALLENGE_PHRASES.length);
    setChallengePhrase(CHALLENGE_PHRASES[index]);
  }, []);

  // Initialize challenge on mount
  useEffect(() => {
    generateChallenge();
  }, [generateChallenge]);

  // Handle verification process
  const handleVerification = useCallback(async () => {
    if (!audioBlob) return;

    try {
      setIsLoading(true);
      setVerificationStatus('pending');

      // Create form data for the audio file
      const formData = new FormData();
      formData.append('audio', audioBlob);
      formData.append('email', email);
      formData.append('challengeText', challengePhrase);

      // Attempt to sign in with voice verification
      const result = await signIn('voice-auth', {
        email,
        audioUrl: URL.createObjectURL(audioBlob),
        challengeSentence: challengePhrase,
        redirect: false
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      setVerificationStatus('verified');
      onSuccess();
    } catch (error) {
      setVerificationStatus('failed');
      setAttempts(prev => prev + 1);
      onError(error instanceof Error ? error : new Error('Voice verification failed'));
    } finally {
      setIsLoading(false);
    }
  }, [audioBlob, email, challengePhrase, onSuccess, onError]);

  // Handle recording completion
  useEffect(() => {
    if (audioBlob && !isRecording) {
      handleVerification();
    }
  }, [audioBlob, isRecording, handleVerification]);

  // Reset verification state
  const handleReset = useCallback(() => {
    setVerificationStatus('pending');
    generateChallenge();
  }, [generateChallenge]);

  return (
    <div className={cn('space-y-6', className)}>
      {/* Challenge Phrase Display */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-2"
      >
        <h3 className="text-lg font-semibold text-gray-900">
          Voice Verification
        </h3>
        <p className="text-sm text-gray-600">
          Please read the following phrase:
        </p>
        <p className="text-lg font-medium text-orange-600 mt-2">
          "{challengePhrase}"
        </p>
      </motion.div>

      {/* Voice Recording Interface */}
      <div className="flex flex-col items-center space-y-4">
        <VoiceFeedback
          isRecording={isRecording}
          isPaused={false}
          volume={volume}
          error={recordingError}
          className="w-32 h-32"
        />

        <AnimatePresence mode="wait">
          {verificationStatus === 'pending' && !isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Button
                onClick={isRecording ? stopRecording : startRecording}
                variant={isRecording ? 'destructive' : 'default'}
                size="lg"
                className="w-48"
              >
                {isRecording ? 'Stop Recording' : 'Start Recording'}
              </Button>
            </motion.div>
          )}

          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center space-x-2"
            >
              <Loader2 className="w-5 h-5 animate-spin text-orange-500" />
              <span className="text-sm text-gray-600">
                Verifying voice...
              </span>
            </motion.div>
          )}

          {verificationStatus === 'verified' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex items-center space-x-2 text-green-600"
            >
              <CheckCircle className="w-5 h-5" />
              <span>Voice verified successfully</span>
            </motion.div>
          )}

          {verificationStatus === 'failed' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4 text-center"
            >
              <div className="flex items-center space-x-2 text-red-600 justify-center">
                <XCircle className="w-5 h-5" />
                <span>Verification failed</span>
              </div>

              {attempts < 3 && (
                <Button
                  onClick={handleReset}
                  variant="outline"
                  size="sm"
                  className="space-x-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Try Again</span>
                </Button>
              )}

              {attempts >= 3 && (
                <p className="text-sm text-red-600">
                  Too many failed attempts. Please try again later.
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Help Text */}
      <p className="text-xs text-gray-500 text-center">
        Speak clearly and naturally. Make sure you're in a quiet environment.
      </p>
    </div>
  );
}
