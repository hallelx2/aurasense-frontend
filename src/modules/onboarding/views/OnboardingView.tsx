'use client';

import {
  Box,
  VStack,
  Text,
  Button,
  Container,
  Heading,
  useColorModeValue,
  Center,
  Icon,
  Flex,
  HStack,
  Input,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { ArrowLeft, Mic, LogOut, SkipForward } from 'lucide-react';
import UseAnimations from 'react-useanimations';
import microphone from 'react-useanimations/lib/microphone';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@chakra-ui/react';
import { useSession, signOut } from 'next-auth/react';
import { useWebSocket } from '@/hooks/useWebSocket';

const MotionBox = motion(Box);
const MotionVStack = motion(VStack);

interface AgentMessage {
  id: string;
  sender: 'agent' | 'user';
  text: string;
  timestamp: string;
}

interface OnboardingProgress {
  [key: string]: boolean;
}

interface OnboardingData {
  age?: number;
  dietary_restrictions?: string[];
  cuisine_preferences?: string[];
  price_range?: string;
  is_tourist?: boolean;
  cultural_background?: string[];
  food_allergies?: string[];
  spice_tolerance?: number;
  preferred_languages?: string[];
  phone?: string;
}

const REQUIRED_FIELDS = [
  { key: 'age', label: 'Age' },
  { key: 'dietary_restrictions', label: 'Dietary Restrictions' },
  { key: 'cuisine_preferences', label: 'Cuisine Preferences' },
  { key: 'price_range', label: 'Price Range' },
  { key: 'is_tourist', label: 'Tourist/Local Status' },
  { key: 'cultural_background', label: 'Cultural Background' },
  { key: 'food_allergies', label: 'Food Allergies' },
  { key: 'spice_tolerance', label: 'Spice Tolerance' },
  { key: 'preferred_languages', label: 'Preferred Languages' },
  { key: 'phone', label: 'Phone Number' },
];

export function OnboardingView() {
  const bgGradient = useColorModeValue(
    'linear(to-br, primary.50, secondary.50)',
    'linear(to-br, primary.900, secondary.900)'
  );
  const textColor = useColorModeValue('gray.800', 'white');
  const mutedColor = useColorModeValue('gray.600', 'gray.300');
  const [messages, setMessages] = useState<AgentMessage[]>([]);
  const [progress, setProgress] = useState<OnboardingProgress>({});
  const [isListening, setIsListening] = useState(false);
  const [onboardingComplete, setOnboardingComplete] = useState(false);
  const toast = useToast();
  const router = useRouter();
  const { data: session, update: updateSession } = useSession();
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({});
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [isUserScrolling, setIsUserScrolling] = useState(false);

  const [wsUrl, setWsUrl] = useState<string | null>(null);

  useEffect(() => {
    if (session?.accessToken) {
      const url = process.env.NEXT_PUBLIC_WEBSOCKET_URL
        ? `${process.env.NEXT_PUBLIC_WEBSOCKET_URL.replace(/^http/, 'ws')}/api/v1/ws/onboarding?token=${session.accessToken}`
        : null;
      setWsUrl(url);
    }
  }, [session]);

  const { isConnected, lastMessage, sendMessage } = useWebSocket(wsUrl);

  const initialMessageSent = useRef(false);

  useEffect(() => {
    if (isConnected && !initialMessageSent.current) {
      initialMessageSent.current = true;
      setIsLoading(true);
      sendMessage(JSON.stringify({
        type: 'user_message',
        payload: {
          text: 'Hi, I want to get started with my onboarding'
        }
      }));
    }
    
    // Reset flag when connection is lost
    if (!isConnected) {
      initialMessageSent.current = false;
    }
  }, [isConnected, sendMessage]);

  useEffect(() => {
    if (lastMessage) {
      const message = JSON.parse(lastMessage.data);
      switch (message.type) {
        case 'agent_message':
          setMessages(prev => [...prev, {
            id: message.payload.id || Date.now().toString(),
            sender: 'agent',
            text: message.payload.text,
            timestamp: message.payload.timestamp || new Date().toISOString(),
          }]);
          setIsLoading(false);
          break;
        case 'onboarding_progress':
          setProgress(prev => ({ ...prev, [message.payload.key]: message.payload.value }));
          break;
        case 'error':
          toast({
            title: 'Error',
            description: message.payload.message,
            status: 'error',
            duration: 4000,
          });
          setIsLoading(false);
          break;
        default:
          // Silently ignore unknown message types
          console.log('Unknown message type:', message.type);
          break;
      }
    }
  }, [lastMessage, toast]);

  // Calculate progress based on populated fields
  useEffect(() => {
    const newProgress: OnboardingProgress = {};
    REQUIRED_FIELDS.forEach(field => {
      const value = onboardingData[field.key as keyof OnboardingData];
      newProgress[field.key] = value !== undefined && value !== null && value !== '' && 
        (!Array.isArray(value) || value.length > 0);
    });
    setProgress(newProgress);
  }, [onboardingData]);

  // Check if onboarding is complete
  useEffect(() => {
    const completedFields = Object.values(progress).filter(Boolean).length;
    const isComplete = completedFields === REQUIRED_FIELDS.length;
    
    if (isComplete && !onboardingComplete) {
      completeOnboarding();
    }
  }, [progress, onboardingComplete]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    const scrollToBottom = () => {
      if (messagesContainerRef.current) {
        const container = messagesContainerRef.current;
        container.scrollTop = container.scrollHeight;
      }
    };

    // Use setTimeout to ensure DOM is updated before scrolling
    const timeoutId = setTimeout(scrollToBottom, 100);
    
    return () => clearTimeout(timeoutId);
  }, [messages]);

  // Handle scroll detection (optional - can be removed if not needed)
  const handleScroll = () => {
    if (messagesContainerRef.current) {
      const container = messagesContainerRef.current;
      const isAtBottom = container.scrollTop + container.clientHeight >= container.scrollHeight - 50;
      setIsUserScrolling(!isAtBottom);
    }
  };

  const handleSendMessage = async () => {
    if (!userInput.trim() || isLoading || !isConnected) return;

    const userMessage: AgentMessage = {
      id: Date.now().toString(),
      sender: 'user' as const,
      text: userInput,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    
    sendMessage(JSON.stringify({
      type: 'user_message',
      payload: {
        text: userInput
      }
    }));

    setUserInput('');
    setIsLoading(true);
  };

  const completeOnboarding = async () => {
    try {
      const response = await fetch('/api/onboarding/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(onboardingData),
      });

      if (!response.ok) {
        throw new Error('Failed to complete onboarding');
      }

      // Update session with new data
      await updateSession();
      setOnboardingComplete(true);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to complete onboarding. Please try again.',
        status: 'error',
        duration: 4000,
      });
    }
  };

  // Handle completion and redirect
  useEffect(() => {
    if (onboardingComplete) {
      toast({
        title: 'Welcome to Aurasense!',
        description: 'Redirecting to dashboard...',
        status: 'success',
        duration: 3000,
      });

      // Give time for the toast to be seen
      setTimeout(() => router.push('/dashboard'), 2000);
    }
  }, [onboardingComplete, router, toast]);

  const handleVoiceInput = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      // For now, we'll use text input - voice can be added later
      // This just checks microphone permission
      toast({
        title: 'Microphone Ready',
        description: 'You can now use voice or text input.',
        status: 'success',
        duration: 2000,
      });
    } catch (err) {
      toast({
        title: 'Microphone Access Denied',
        description: 'Please allow microphone access or use text input.',
        status: 'warning',
        duration: 4000,
        isClosable: true,
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleGlobalKeyPress = (e: KeyboardEvent) => {
      // Ctrl/Cmd + Q to sign out
      if ((e.ctrlKey || e.metaKey) && e.key === 'q') {
        e.preventDefault();
        handleSignOut();
      }
      // Ctrl/Cmd + D to skip to dashboard
      if ((e.ctrlKey || e.metaKey) && e.key === 'd' && !onboardingComplete) {
        e.preventDefault();
        handleSkipToDashboard();
      }
    };

    window.addEventListener('keydown', handleGlobalKeyPress);
    return () => window.removeEventListener('keydown', handleGlobalKeyPress);
  }, [onboardingComplete]);

  const handleSignOut = async () => {
    try {
      await signOut({ 
        callbackUrl: '/auth/signin',
        redirect: true 
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to sign out. Please try again.',
        status: 'error',
        duration: 4000,
      });
    }
  };

  const handleSkipToDashboard = async () => {
    try {
      // Update the user's onboarding status to mark as completed
      const response = await fetch('/api/onboarding/skip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to skip onboarding');
      }

      // Update session with the new access token
      await updateSession({
        accessToken: result.access_token,
        user: {
          ...session?.user,
          isOnboarded: true,
          accessToken: result.access_token
        }
      });
      
      toast({
        title: 'Onboarding Skipped',
        description: 'You can complete your profile later in settings.',
        status: 'info',
        duration: 1000,
      });

      // Small delay to ensure session is updated, then redirect
      setTimeout(() => {
        router.push('/dashboard');
      }, 1200);
    } catch (error) {
      console.error('Skip onboarding error:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to skip onboarding. Please try again.',
        status: 'error',
        duration: 4000,
      });
    }
  };

  return (
    <Box minH="100vh" bgGradient={bgGradient} position="relative" overflow="hidden">
      <Container maxW="container.xl" py={16}>
        {/* Header with action buttons */}
        <Flex justify="space-between" align="center" mb={8}>
          <Heading size="xl" color="primary.600">
            Welcome to Aurasense
          </Heading>
          <HStack spacing={3}>
            <Button
              leftIcon={<SkipForward size={16} />}
              variant="outline"
              colorScheme="primary"
              onClick={handleSkipToDashboard}
              isDisabled={onboardingComplete}
              title="Skip to Dashboard (Ctrl+D)"
            >
              Skip to Dashboard
            </Button>
            <Button
              leftIcon={<LogOut size={16} />}
              variant="outline"
              colorScheme="red"
              onClick={handleSignOut}
              title="Sign Out (Ctrl+Q)"
            >
              Sign Out
            </Button>
          </HStack>
        </Flex>
        <Flex direction={{ base: 'column', md: 'row' }} gap={10}>
          {/* Agent Chat */}
          <Box flex={2} bg={useColorModeValue('white', 'gray.800')} borderRadius="2xl" boxShadow="lg" p={8} minH="500px" maxH="600px" position="relative" display="flex" flexDirection="column">
            <Heading size="lg" mb={6} color="primary.500">Onboarding Assistant</Heading>
            <Box 
              ref={messagesContainerRef}
              flex={1}
              overflowY="auto"
              onScroll={handleScroll}
              css={{
                '&::-webkit-scrollbar': {
                  width: '8px',
                },
                '&::-webkit-scrollbar-track': {
                  width: '8px',
                },
                '&::-webkit-scrollbar-thumb': {
                  background: 'rgba(0,0,0,0.2)',
                  borderRadius: '4px',
                },
                '&::-webkit-scrollbar-thumb:hover': {
                  background: 'rgba(0,0,0,0.3)',
                },
              }}
            >
              <VStack align="stretch" spacing={4} pb={4}>
                {messages.length === 0 && (
                  <Text color={mutedColor}>{isConnected ? 'Agent is connecting...' : 'Connecting to agent...'}</Text>
                )}
                {messages.map((msg) => (
                  <Box key={msg.id} alignSelf={msg.sender === 'agent' ? 'flex-start' : 'flex-end'}>
                    <Box
                      bg={msg.sender === 'agent' ? 'primary.50' : 'primary.500'}
                      color={msg.sender === 'agent' ? textColor : 'white'}
                      px={4}
                      py={2}
                      borderRadius="xl"
                      boxShadow="sm"
                      maxW="80%"
                    >
                      {msg.text}
                    </Box>
                    <Text fontSize="xs" color={mutedColor} mt={1} textAlign={msg.sender === 'agent' ? 'left' : 'right'}>
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </Text>
                  </Box>
                ))}
                <div ref={messagesEndRef} />
              </VStack>
            </Box>
            {/* Input area */}
            <Box mt={4} px={4} pb={4}>
              <HStack spacing={3}>
                <Input
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your response here..."
                  isDisabled={isLoading || onboardingComplete || !isConnected}
                  bg={useColorModeValue('white', 'gray.700')}
                  border="1px solid"
                  borderColor={useColorModeValue('gray.300', 'gray.600')}
                  _focus={{ borderColor: 'primary.500' }}
                />
                <Button
                  onClick={handleSendMessage}
                  isLoading={isLoading}
                  isDisabled={!userInput.trim() || onboardingComplete || !isConnected}
                  colorScheme="primary"
                  minW="80px"
                >
                  Send
                </Button>
                <Button
                  size="md"
                  bg={isListening ? 'voice.listening' : 'primary.500'}
                  color="white"
                  borderRadius="full"
                  onClick={handleVoiceInput}
                  _hover={{ bg: 'primary.600' }}
                  aria-label="Voice input"
                  isDisabled={onboardingComplete || !isConnected}
                  minW="50px"
                >
                  <UseAnimations
                    animation={microphone}
                    size={24}
                    style={{ color: 'white' }}
                    strokeColor={isListening ? '#FF6B35' : 'white'}
                  />
                </Button>
              </HStack>
            </Box>
          </Box>

          {/* Progress Checklist */}
          <Box flex={1} bg={useColorModeValue('white', 'gray.800')} borderRadius="2xl" boxShadow="lg" p={8} minH="500px">
            <Heading size="md" mb={4} color="primary.500">Your Progress</Heading>
            <VStack align="stretch" spacing={4}>
              {REQUIRED_FIELDS.map(field => (
                <HStack key={field.key} spacing={3}>
                  <Box
                    as="span"
                    w={5}
                    h={5}
                    borderRadius="md"
                    borderWidth={2}
                    borderColor={progress[field.key] ? 'green.400' : 'gray.300'}
                    bg={progress[field.key] ? 'green.400' : 'transparent'}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    {progress[field.key] && (
                      <Text color="white" fontSize="xs" fontWeight="bold">✓</Text>
                    )}
                  </Box>
                  <Text color={textColor} fontSize="sm">{field.label}</Text>
                </HStack>
              ))}
            </VStack>
            
            {/* Progress indicator */}
            <Box mt={6} p={4} bg={useColorModeValue('gray.50', 'gray.700')} borderRadius="md">
              <Text fontSize="sm" color={mutedColor} mb={2}>
                Progress: {Object.values(progress).filter(Boolean).length}/{REQUIRED_FIELDS.length}
              </Text>
              <Box w="full" bg="gray.200" borderRadius="full" h={2}>
                <Box
                  bg="primary.500"
                  h={2}
                  borderRadius="full"
                  transition="width 0.3s"
                  w={`${(Object.values(progress).filter(Boolean).length / REQUIRED_FIELDS.length) * 100}%`}
                />
              </Box>
            </Box>
          </Box>
        </Flex>
      </Container>
    </Box>
  );
}

