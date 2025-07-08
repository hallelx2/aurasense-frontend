"use client";

import { useCallback, useEffect, useState } from 'react';
import { useAnimate, animate, motion } from 'framer-motion';

interface VoiceAnimationOptions {
  onAnimationComplete?: () => void;
  pulseColor?: string;
  waveColor?: string;
  size?: number;
  duration?: number;
}

interface VoiceAnimationState {
  isAnimating: boolean;
  currentAnimation: 'idle' | 'listening' | 'processing' | 'speaking' | 'error';
  volume: number;
}

export function useVoiceAnimation(options: VoiceAnimationOptions = {}) {
  const {
    onAnimationComplete,
    pulseColor = '#FF6B35',
    waveColor = '#004E89',
    size = 64,
    duration = 1.5
  } = options;

  const [state, setState] = useState<VoiceAnimationState>({
    isAnimating: false,
    currentAnimation: 'idle',
    volume: 0
  });

  const [scope, animate] = useAnimate();

  const startListeningAnimation = useCallback(async () => {
    setState(prev => ({
      ...prev,
      isAnimating: true,
      currentAnimation: 'listening'
    }));

    await animate(scope.current, {
      scale: [1, 1.1, 1],
      opacity: [1, 0.8, 1]
    }, {
      duration,
      repeat: Infinity,
      ease: 'easeInOut'
    });
  }, [animate, scope, duration]);

  const startProcessingAnimation = useCallback(async () => {
    setState(prev => ({
      ...prev,
      isAnimating: true,
      currentAnimation: 'processing'
    }));

    await animate(scope.current, {
      rotate: [0, 360]
    }, {
      duration: 2,
      repeat: Infinity,
      ease: 'linear'
    });
  }, [animate, scope]);

  const startSpeakingAnimation = useCallback(async (volume: number = 0) => {
    setState(prev => ({
      ...prev,
      isAnimating: true,
      currentAnimation: 'speaking',
      volume
    }));

    // Create wave effect based on volume
    const maxHeight = size * 0.8;
    const height = Math.max(maxHeight * volume, maxHeight * 0.2);

    await animate(scope.current, {
      height: [height * 0.5, height, height * 0.5],
      width: [4, 6, 4]
    }, {
      duration: 0.5,
      repeat: Infinity,
      ease: 'easeInOut'
    });
  }, [animate, scope, size]);

  const showError = useCallback(async () => {
    setState(prev => ({
      ...prev,
      isAnimating: true,
      currentAnimation: 'error'
    }));

    await animate(scope.current, {
      scale: [1, 1.2, 0.9, 1.1, 1],
      rotate: [0, -10, 10, -5, 0]
    }, {
      duration: 0.5,
      ease: 'easeInOut'
    });

    setState(prev => ({
      ...prev,
      isAnimating: false,
      currentAnimation: 'idle'
    }));
  }, [animate, scope]);

  const stopAnimation = useCallback(() => {
    animate(scope.current, {
      scale: 1,
      rotate: 0,
      opacity: 1,
      height: size,
      width: size
    }, {
      duration: 0.3,
      ease: 'easeOut'
    });

    setState({
      isAnimating: false,
      currentAnimation: 'idle',
      volume: 0
    });

    onAnimationComplete?.();
  }, [animate, scope, size, onAnimationComplete]);

  // Clean up animations on unmount
  useEffect(() => {
    return () => {
      stopAnimation();
    };
  }, [stopAnimation]);

  return {
    ...state,
    scope,
    startListeningAnimation,
    startProcessingAnimation,
    startSpeakingAnimation,
    showError,
    stopAnimation,
    animations: {
      pulse: {
        initial: { scale: 1, opacity: 1 },
        animate: {
          scale: [1, 1.1, 1],
          opacity: [1, 0.8, 1]
        },
        transition: {
          duration,
          repeat: Infinity,
          ease: 'easeInOut'
        }
      },
      wave: {
        initial: { scaleY: 1 },
        animate: {
          scaleY: [1, 0.5, 1]
        },
        transition: {
          duration: 1,
          repeat: Infinity,
          ease: 'easeInOut'
        }
      },
      error: {
        initial: { scale: 1, rotate: 0 },
        animate: {
          scale: [1, 1.2, 0.9, 1.1, 1],
          rotate: [0, -10, 10, -5, 0]
        },
        transition: {
          duration: 0.5,
          ease: 'easeInOut'
        }
      }
    }
  };
}
