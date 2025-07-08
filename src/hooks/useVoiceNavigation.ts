"use client";

import { useCallback, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface NavigationCommand {
  type: 'navigate' | 'back' | 'home';
  destination?: string;
  confidence: number;
}

interface VoiceNavigationOptions {
  onNavigationStart?: () => void;
  onNavigationComplete?: () => void;
  onNavigationError?: (error: Error) => void;
  confidenceThreshold?: number;
}

const NAVIGATION_PATTERNS = {
  go: /^(?:go|navigate|take me) (?:to|back to)(?: the)? (.+)$/i,
  back: /^(?:go back|return|previous)$/i,
  home: /^(?:go home|home|main|start)$/i
};

const ROUTE_MAPPINGS = {
  'home': '/',
  'dashboard': '/dashboard',
  'food': '/food',
  'travel': '/travel',
  'community': '/community',
  'profile': '/profile',
  'settings': '/settings',
  'sign in': '/auth/signin',
  'sign up': '/auth/signup',
  'login': '/auth/signin',
  'register': '/auth/signup',
  'onboarding': '/onboarding'
};

export function useVoiceNavigation(options: VoiceNavigationOptions = {}) {
  const {
    onNavigationStart,
    onNavigationComplete,
    onNavigationError,
    confidenceThreshold = 0.8
  } = options;

  const router = useRouter();
  const pathname = usePathname();
  const [isNavigating, setIsNavigating] = useState(false);
  const [lastCommand, setLastCommand] = useState<NavigationCommand | null>(null);

  // Parse voice command to extract navigation intent
  const parseNavigationCommand = useCallback((text: string): NavigationCommand | null => {
    // Check for "go back" command
    if (NAVIGATION_PATTERNS.back.test(text)) {
      return {
        type: 'back',
        confidence: 0.95
      };
    }

    // Check for "home" command
    if (NAVIGATION_PATTERNS.home.test(text)) {
      return {
        type: 'navigate',
        destination: '/',
        confidence: 0.95
      };
    }

    // Check for "go to" command
    const goMatch = text.match(NAVIGATION_PATTERNS.go);
    if (goMatch) {
      const destination = goMatch[1].toLowerCase().trim();

      // Find best matching route
      const matches = Object.entries(ROUTE_MAPPINGS)
        .map(([key, path]) => ({
          path,
          confidence: calculateConfidence(destination, key)
        }))
        .filter(match => match.confidence > confidenceThreshold)
        .sort((a, b) => b.confidence - a.confidence);

      if (matches.length > 0) {
        return {
          type: 'navigate',
          destination: matches[0].path,
          confidence: matches[0].confidence
        };
      }
    }

    return null;
  }, [confidenceThreshold]);

  // Calculate confidence score for fuzzy matching
  const calculateConfidence = (input: string, target: string): number => {
    const inputWords = input.toLowerCase().split(' ');
    const targetWords = target.toLowerCase().split(' ');

    // Check for exact match
    if (input === target) return 1;

    // Calculate word match ratio
    const matchedWords = inputWords.filter(word =>
      targetWords.some(targetWord =>
        targetWord.includes(word) || word.includes(targetWord)
      )
    );

    return matchedWords.length / Math.max(inputWords.length, targetWords.length);
  };

  // Handle navigation based on command
  const handleNavigation = useCallback(async (command: NavigationCommand) => {
    try {
      setIsNavigating(true);
      onNavigationStart?.();

      switch (command.type) {
        case 'navigate':
          if (command.destination && command.destination !== pathname) {
            await router.push(command.destination);
          }
          break;

        case 'back':
          router.back();
          break;

        case 'home':
          if (pathname !== '/') {
            await router.push('/');
          }
          break;
      }

      setLastCommand(command);
      onNavigationComplete?.();
    } catch (error) {
      onNavigationError?.(error instanceof Error ? error : new Error('Navigation failed'));
    } finally {
      setIsNavigating(false);
    }
  }, [router, pathname, onNavigationStart, onNavigationComplete, onNavigationError]);

  // Process voice command for navigation
  const processVoiceCommand = useCallback(async (text: string) => {
    const command = parseNavigationCommand(text);

    if (command && command.confidence >= confidenceThreshold) {
      await handleNavigation(command);
      return true;
    }

    return false;
  }, [parseNavigationCommand, handleNavigation, confidenceThreshold]);

  // Clean up navigation state on unmount
  useEffect(() => {
    return () => {
      setIsNavigating(false);
      setLastCommand(null);
    };
  }, []);

  return {
    isNavigating,
    lastCommand,
    processVoiceCommand,
    currentPath: pathname
  };
}
